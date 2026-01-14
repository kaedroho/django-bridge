from pathlib import Path

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.utils.module_loading import import_string


class DjangoBridgeConfig:
    def __init__(
        self,
        *,
        framework="react",
        entry_point=None,
        vite_bundle_dir=None,
        vite_devserver_url=None,
        bootstrap_template="django_bridge/bootstrap.html",
        context_providers=None,
    ):
        self.framework = framework
        self.entry_point = entry_point
        self.vite_bundle_dir = Path(vite_bundle_dir) if vite_bundle_dir else None
        self.vite_devserver_url = vite_devserver_url
        self.bootstrap_template = bootstrap_template
        self.context_providers = context_providers or {}

    @classmethod
    def from_settings(cls):
        config = cls(
            framework=settings.DJANGO_BRIDGE.get("FRAMEWORK", "react"),
            entry_point=settings.DJANGO_BRIDGE.get("ENTRY_POINT", "src/main.tsx"),
            vite_bundle_dir=settings.DJANGO_BRIDGE.get("VITE_BUNDLE_DIR"),
            vite_devserver_url=settings.DJANGO_BRIDGE.get("VITE_DEVSERVER_URL"),
            context_providers=(
                {
                    name: import_string(provider)
                    for name, provider in settings.DJANGO_BRIDGE.get(
                        "CONTEXT_PROVIDERS", {}
                    ).items()
                }
            ),
        )

        if not config.vite_bundle_dir and not config.vite_devserver_url:
            raise ImproperlyConfigured(
                "DJANGO_BRIDGE['VITE_BUNDLE_DIR'] (production) or DJANGO_BRIDGE['VITE_DEVSERVER_URL'] (development) must be set"
            )

        return config


config = DjangoBridgeConfig.from_settings()
