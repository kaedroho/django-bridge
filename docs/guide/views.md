# Writing Views

Django Bridge applications use Django's views and URL routing for all backend application logic.
The only difference from a regular Django application is the response type.

If you're unfamiliar with Django views, they are Python functions that take a web request and return a web response.
In a traditional Django application, the views will return the HTML for the browser to render. See Django's own [Writing Views](https://docs.djangoproject.com/en/5.0/topics/http/views/) document if you're interested in seeing an example.

## A simple view

Here's a view that renders a component called "CurrentTime" with the current time as the only prop:

```python
import datetime
from django_bridge.response import Response

def current_datetime(request):
    now = datetime.datetime.now()

    return Response(
        request,
        "CurrentTime",
        {
            "time": now
        },
        metadata={
            "title": "Current time"
        }
    )
```

Let's step through this code one line at a time:

- First, we import the class Response from django_bridge, along with Python's datetime library.

- Next, we define a function called current_datetime. This is the view function. Each view function takes an HttpRequest object as its first parameter, which is typically named request.

  Note that the name of the view function doesn't matter; it doesn't have to be named in a certain way in order for Django to recognize it. We're calling it current_datetime here, because that name clearly indicates what it does.

- The view returns an Response object that contains the name of the frontend component to render ("CurrentTime"), the props to pass in to it, and some metadata which includes the page title. We will look at what this component looks like in the next section.

## Adding views to your URL config

All Django projects contain a URL configuration file (usually called ``urls.py``in the project folder) that defines what views to run at what URLs. There are no differences in how the URL dispatcher works in a Django Bridge application, and you can even mix React-rendered views with template-rendered views.

See Django's [URL dispatcher](https://docs.djangoproject.com/en/5.0/topics/http/urls/) documentation for instructions on how to add views to your URL configuration.

## Class based views

Django Bridge provides ``DjangoBridgeView`` class that can be subclassed to define class based views
and also ``DjangoBridgeMixin`` which can be used to convert existing class based views to render with Django bridge.

[[source]](https://github.com/django-bridge/django-bridge/blob/main/python/django_bridge/views.py)

As a simple example, here's the view above written as a class based view:

```python
import datetime
from django_bridge.views import DjangoRenderView


class CurrentDateTime(DjangoRenderView):
    view_name = "CurrentTime"

    def get_context_data(self):
        return {
            "time": datetime.datetime.now()
        }
```
