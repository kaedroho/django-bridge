import json

from django.core.exceptions import ImproperlyConfigured
from django.http import StreamingHttpResponse
from django.shortcuts import render
from django.templatetags.static import static

from .conf import config
from .response import BaseResponse, RedirectResponse


class DjangoBridgeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

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
