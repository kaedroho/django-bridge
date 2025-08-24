---
sidebar_position: 7
---

# Forms

Django Bridge applications can use Django’s built-in forms framework for creating forms and implementing application logic and validation.

## How they work

Forms are defined in Python using Django’s built-in form, field and widget types.
These definitions are serialised into JSON using [Telepath](https://wagtail.github.io/telepath/) and then rendered with React.

When a user submits a form, it’s submitted in the standard encodings that Django is already built to accept, so all the backend code works as if it’s a regular old Django app, no separate APIs are needed.

Validation is all performed by Django and the logic doesn’t have to be repeated in JavaScript. When a validation error occurs, the view and form are re-rendered with the validation errors rendered in the form.

## Building a form with Django Bridge

In this section, we will build a simple form that takes a user's name. Note that this is the same example used by [Django documentation](https://docs.djangoproject.com/en/5.2/topics/forms/#building-a-form-in-django) and has been adapted for Django Bridge.

### The form class

```python
from django import forms

class NameForm(forms.Form):
    your_name = forms.CharField(label="Your name", max_length=100)
```

### The view

Form data sent back to a Django website is processed by a view, generally the same view which published the form. This allows us to reuse some of the same logic.

To handle the form we need to instantiate it in the view for the URL where we want it to be published:

```python
from django.http import HttpResponseRedirect
from django_bridge.response import Response

from .forms import NameForm

def get_name(request):
    # if this is a POST request we need to process the form data
    if request.method == "POST":
        # create a form instance and populate it with data from the request:
        form = NameForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            return HttpResponseRedirect("/thanks/")

    # if a GET (or any other method) we'll create a blank form
    else:
        form = NameForm()

    return Response(request, "GetName", {"form": form})
```

Note that this view is almost exactly the same as what you would implement for a [regular Django application](https://docs.djangoproject.com/en/5.0/topics/forms/#the-view).
The only difference is the last line has changed from using Django’s ``render()`` shortcut which renders a template to using Django Bridge’s ``Response`` class.

### The React component

Here is a React component that can render this form:

```jsx
import { Form } from "@django-bridge/react";
import { CSRFTokenContext } from "./contexts";

export default function GetNameView({ form }) {
  const { csrfToken } = useContext(CSRFTokenContext);

  return (
    <Form action="/your-name/" method="post">
      <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
      {form.render()}
      <button type="submit" value="Submit" />
    </Form>
  );
}
```

Let’s step through this code one line at a time:

- First, we import the ``<Form>`` component from Django Bridge and `CSRFTokenContext` from our project’s ``contexts`` module (this is provided by the ``create-django-bridge`` project template)

- Next, we define a function view component called ``GetNameView`` that takes a form as a prop

- Then we use the ``CSRFTokenContext`` to get a CSRF token

- Then we use the ``<Form>`` component to build the form. This component extends the HTML ``<form>`` tag to add AJAX form submission and protection from navigating away if the form contains unsaved content <!-- See “dirty form protection” -->

- Then we add a hidden input to hold the CSRF token

- Then we render the form. The Django form is converted into an instance of the ``FormDef`` class which has a ``render()`` method. The project template includes a simple rendering implementation that can be customised <!-- See “Python object in React” for more information on how this mechanism works -->

- Finally we have the submit button that submits the form
