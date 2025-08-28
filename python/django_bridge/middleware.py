import json
from pathlib import Path

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.http import StreamingHttpResponse
from django.shortcuts import render
from django.templatetags.static import static

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
            # Defaults set for backwards compatibility
            FRAMEWORK = settings.DJANGO_BRIDGE.get("FRAMEWORK", "react")
            ENTRY_POINT = settings.DJANGO_BRIDGE.get("ENTRY_POINT", "src/main.tsx")
            VITE_BUNDLE_DIR = settings.DJANGO_BRIDGE.get("VITE_BUNDLE_DIR")
            VITE_DEVSERVER_URL = settings.DJANGO_BRIDGE.get("VITE_DEVSERVER_URL")

            vite_react_refresh_runtime = None

            if VITE_BUNDLE_DIR:
                # Production - Use asset manifest to find URLs to bundled JS/CSS
                asset_manifest = json.loads(
                    (Path(VITE_BUNDLE_DIR) / ".vite/manifest.json").read_text()
                )

                js = [
                    static(asset_manifest[ENTRY_POINT]["file"]),
                ]
                css = asset_manifest[ENTRY_POINT].get("css", [])

            elif VITE_DEVSERVER_URL:
                # Development - Fetch JS/CSS from Vite server
                js = [
                    f"{VITE_DEVSERVER_URL}/@vite/client",
                    f"{VITE_DEVSERVER_URL}/{ENTRY_POINT}",
                ]
                css = []
                if FRAMEWORK == "react":
                    vite_react_refresh_runtime = VITE_DEVSERVER_URL + "/@react-refresh"

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
