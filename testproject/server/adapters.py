from django import forms
from django_bridge.adapters import Adapter, register


class TextInputAdapter(Adapter):
    js_constructor = "forms.TextInput"

    def js_args(self, widget):
        return [
            "text",
            widget.attrs.get("class", ""),
        ]


register(TextInputAdapter(), forms.TextInput)


class PasswordInputAdapter(Adapter):
    js_constructor = "forms.TextInput"

    def js_args(self, widget):
        return [
            "password",
            widget.attrs.get("class", ""),
        ]


register(PasswordInputAdapter(), forms.PasswordInput)


class SelectAdapter(Adapter):
    js_constructor = "forms.Select"

    def js_args(self, widget):
        return [
            widget.options("__NAME__", ""),
            widget.attrs.get("class", ""),
        ]


register(SelectAdapter(), forms.Select)
