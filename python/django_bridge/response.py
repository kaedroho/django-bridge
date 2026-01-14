import json
import warnings

from django.contrib import messages
from django.core.exceptions import ImproperlyConfigured
from django.http import JsonResponse, StreamingHttpResponse
from django.shortcuts import render
from django.templatetags.static import static
from django.utils.cache import patch_cache_control
from django.utils.html import conditional_escape

from .adapters.registry import JSContext
from .conf import config
from .metadata import Metadata


def get_messages(request):
    default_level_tag = messages.DEFAULT_TAGS[messages.SUCCESS]
    return [
        {
            "level": messages.DEFAULT_TAGS.get(message.level, default_level_tag),
            "html": conditional_escape(message.message),
        }
        for message in messages.get_messages(request)
    ]


class BaseResponse(JsonResponse):
    """
    Base class for all Django Bridge responses.
    """

    action = None

    def __init__(self, data, *, status=None):
        js_context = JSContext()
        self.data = {
            "action": self.action,
            **data,
        }
        super().__init__(js_context.pack(self.data), status=status)
        self["X-DjangoBridge-Action"] = self.action

        # Make sure that Django Bridge responses are never cached by browsers
        # We need to do this because Django Bridge responses are given on the same URLs that
        # users would otherwise get HTML responses on if they visited those URLs
        # directly.
        # If a Django Bridge response is cached, there's a chance that a user could see the
        # JSON document in their browser rather than a HTML page.
        # This behaviour only seems to occur (intermittently) on Firefox.
        patch_cache_control(self, no_store=True)


class Response(BaseResponse):
    """
    Instructs the client to render a view (React component) with the given context.
    """

    action = "render"

    def __init__(
        self,
        request,
        view,
        props,
        *,
        overlay=False,
        title="",
        metadata: Metadata | None = None,
        status=None,
    ):
        if metadata is None:
            if title:
                warnings.warn(
                    "The title argument is deprecated. Use metadata instead.",
                    PendingDeprecationWarning,
                )

            metadata = Metadata(title=title)
        elif title:
            raise TypeError("title and metadata cannot both be provided")

        self.view = view
        self.props = props
        self.overlay = overlay
        self.metadata = metadata
        self.context = {
            name: provider(request)
            for name, provider in config.context_providers.items()
        }
        self.messages = get_messages(request)
        super().__init__(
            {
                "view": self.view,
                "overlay": self.overlay,
                "metadata": self.metadata,
                "props": self.props,
                "context": self.context,
                "messages": self.messages,
            },
            status=status,
        )


class ReloadResponse(BaseResponse):
    """
    Instructs the client to load the view the old-fashioned way.
    """

    action = "reload"

    def __init__(self):
        super().__init__({})


class RedirectResponse(BaseResponse):
    action = "redirect"

    def __init__(self, path):
        self.path = path
        super().__init__(
            {
                "path": self.path,
            }
        )


class CloseOverlayResponse(BaseResponse):
    action = "close-overlay"

    def __init__(self, request):
        self.messages = get_messages(request)
        super().__init__(
            {
                "messages": self.messages,
            }
        )


def process_response(request, response):
    if isinstance(response, StreamingHttpResponse):
        return response

    if response.status_code == 301:
        return response

    # If the request was made by Django Bridge
    # (using `fetch()`, rather than a regular browser request)
    if request.META.get("HTTP_X_REQUESTED_WITH") == "DjangoBridge":
        # Convert redirect responses to a JSON response with a `redirect` status
        # This allows the client code to handle the redirect
        if response.status_code == 302:
            return RedirectResponse(response["Location"])

        return response

    # Regular browser request
    # If the response is a Django Bridge response, wrap it in our bootstrap template
    # to load the React SPA and render the response data.
    if isinstance(response, BaseResponse):
        vite_react_refresh_runtime = None

        if config.vite_bundle_dir:
            # Production - Use asset manifest to find URLs to bundled JS/CSS
            asset_manifest = json.loads(
                (config.vite_bundle_dir / ".vite/manifest.json").read_text()
            )

            js = [
                static(asset_manifest[config.entry_point]["file"]),
            ]
            css = asset_manifest[config.entry_point].get("css", [])

        elif config.vite_devserver_url:
            # Development - Fetch JS/CSS from Vite server
            js = [
                f"{config.vite_devserver_url}/@vite/client",
                f"{config.vite_devserver_url}/{config.entry_point}",
            ]
            css = []
            if config.framework == "react":
                vite_react_refresh_runtime = (
                    config.vite_devserver_url + "/@react-refresh"
                )

        else:
            raise ImproperlyConfigured(
                "DJANGO_BRIDGE['VITE_BUNDLE_DIR'] (production) or DJANGO_BRIDGE['VITE_DEVSERVER_URL'] (development) must be set"
            )

        # Wrap the response with our bootstrap template
        initial_response = json.loads(response.content.decode("utf-8"))
        new_response = render(
            request,
            "django_bridge/bootstrap.html",
            {
                "metadata": initial_response.get("metadata"),
                "initial_response": json.loads(response.content.decode("utf-8")),
                "js": js,
                "css": css,
                "vite_react_refresh_runtime": vite_react_refresh_runtime,
            },
        )

        # Copy status_code and cookies from the original response
        new_response.status_code = response.status_code
        new_response.cookies = response.cookies

        return new_response

    return response
