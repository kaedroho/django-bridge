import json
import warnings

from django.contrib import messages
from django.core.exceptions import ImproperlyConfigured
from django.http import HttpResponse, JsonResponse, StreamingHttpResponse
from django.shortcuts import render
from django.templatetags.static import static
from django.utils.cache import patch_cache_control
from django.utils.html import conditional_escape

from .adapters.registry import JSContext
from .conf import config as default_config
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


class BaseResponse(HttpResponse):
    """
    Base class for all Django Bridge responses.

    Inherits from HttpResponse so middleware and decorators can attach cookies.
    The content is empty as process_response will convert this to either a
    JsonResponse or HTML response.
    """

    action = None

    def __init__(self, data, *, status=None):
        super().__init__(status=status)
        self.data = {
            "action": self.action,
            **data,
        }

    def get_response_data(self, config):
        """
        Returns response data adapted and ready for JSON serialization.
        """
        js_context = JSContext()
        return js_context.pack(self.data)

    def as_jsonresponse(self, config):
        response = JsonResponse(self.get_response_data(config), status=self.status_code)
        response["X-DjangoBridge-Action"] = self.action
        response.cookies = self.cookies

        # Make sure that Django Bridge responses are never cached by browsers
        # We need to do this because Django Bridge responses are given on the same URLs that
        # users would otherwise get HTML responses on if they visited those URLs
        # directly.
        # If a Django Bridge response is cached, there's a chance that a user could see the
        # JSON document in their browser rather than a HTML page.
        # This behaviour only seems to occur (intermittently) on Firefox.
        patch_cache_control(response, no_store=True)

        return response


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

        super().__init__({}, status=status)
        self._request = request
        self.view = view
        self.props = props
        self.overlay = overlay
        self.metadata = metadata
        self.messages = get_messages(request)

    def get_response_data(self, config):
        context = {
            name: provider(self._request)
            for name, provider in config.context_providers.items()
        }
        js_context = JSContext()
        return js_context.pack(
            {
                "action": self.action,
                "view": self.view,
                "overlay": self.overlay,
                "metadata": self.metadata,
                "props": self.props,
                "context": context,
                "messages": self.messages,
            }
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


def process_response(request, response, config=None):
    if config is None:
        config = default_config

    if isinstance(response, StreamingHttpResponse):
        return response

    if response.status_code == 301:
        return response

    # If the request was made by Django Bridge
    # (using `fetch()`, rather than a regular browser request)
    if request.META.get("HTTP_X_REQUESTED_WITH") == "DjangoBridge":
        # Convert redirect responses to a RedirectResponse
        # This allows the client code to handle the redirect
        if response.status_code == 302:
            response = RedirectResponse(response["Location"])

    if isinstance(response, BaseResponse):
        # If the request was made by Django Bridge
        # (using `fetch()`, rather than a regular browser request)
        if request.META.get("HTTP_X_REQUESTED_WITH") == "DjangoBridge":
            return response.as_jsonresponse(config)

        # Regular browser request
        # Wrap the response in our bootstrap template to load the React SPA
        # and render the response data.
        return _render_html(
            request,
            response.get_response_data(config),
            response.status_code,
            config,
            response.cookies,
        )

    return response


def _render_html(request, response_data, status_code, config, cookies=None):
    """
    Wrap response data in our bootstrap template to load the frontend bundle.
    """
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
            vite_react_refresh_runtime = config.vite_devserver_url + "/@react-refresh"

    else:
        raise ImproperlyConfigured(
            "DJANGO_BRIDGE['VITE_BUNDLE_DIR'] (production) or DJANGO_BRIDGE['VITE_DEVSERVER_URL'] (development) must be set"
        )

    new_response = render(
        request,
        config.bootstrap_template,
        {
            "metadata": response_data.get("metadata"),
            "initial_response": response_data,
            "js": js,
            "css": css,
            "vite_react_refresh_runtime": vite_react_refresh_runtime,
        },
    )

    new_response.status_code = status_code
    if cookies:
        new_response.cookies = cookies

    return new_response
