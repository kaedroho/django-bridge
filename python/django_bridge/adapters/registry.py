from datetime import datetime

from django import forms
from telepath import Adapter, AdapterRegistry, JSContextBase


class CustomJSContextBase(JSContextBase):
    # Remove default media as we import 'telepath-unpack' directly into the client app
    @property
    def base_media(self):
        return forms.Media()


class CustomAdapterRegistry(AdapterRegistry):
    js_context_base_class = CustomJSContextBase


registry = CustomAdapterRegistry()


def register(adapter, cls):
    registry.register(adapter, cls)


class DateTimeAdapter(Adapter):
    js_constructor = "Date"

    def js_args(self, date):
        return [date.isoformat()]


register(DateTimeAdapter(), datetime)
