# Testing

Django bridge provides a ``TestCase`` that includes some helpers for testing Django-bridge enabled views.

As Django Bridge views are just regular Django views, testing them is

The main difference from a regular Django view test us you need to pass an extra header to make Django Bridge return JSON: ``X-Requested-With: DjangoBridge``. Without this, Django Bridge will replace the response with a HTML bootstrap response.

Here's an example of how you can test the ``current_datetime`` view in the [Writing Views](views.md) document:

```python
from datetime import datetime
from django.urls import reverse
from django.test import TestCase


class CurrentDateTimeViewTestCase(TestCase):
    def setUp(self):
        pass # Set up test data here.

    def test_get(self):
        response = self.client.get(reverse("current-datetime"))

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.props["time"], datetime)
```

### Django form submissions

Django Bridge submits form data the same way as a traditional Django app does (using the standard HTML form encodings rather than JSON).
This means testing forms is done almost exactly the same way as in a traditional Django app.

The only difference is how the form is represented in the response with JSON rather than HTML.

For example, we can write a test for the ``get_name`` view in the [Forms](forms.md) document:

```python
from datetime import datetime
from django.urls import reverse
from django_bridge.test import TestCase


class GetNameViewTestCase(TestCase):
    def test_post(self):
        response = self.client.post(
            reverse("get-name"),
            {"name": "Test"},
        )

        self.assertRedirects(response, "/thanks/")

        # ... check name was saved correctly

    def test_post_invalid(self):
        response = self.client.post(
            reverse("get-name"),
            {"name": "Disallowed!"},
        )

        self.assertEqual(response.status_code, 200)

        # response.props can be used to get original form object before JSON serialisation,
        # so you can use Django's built in assertion for form errors
        self.assertFormError(response.props["form"], "name", "'Disallowed!' isn't an allowed value")
```
