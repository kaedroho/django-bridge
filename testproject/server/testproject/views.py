from django.urls import reverse
from django.utils import timezone
from django_bridge.response import Response


def home(request):
    return Response(
        request,
        "Home",
        {"time": timezone.now(), "navigation_test_url": reverse("navigation_test")},
    )


def navigation_test(request):
    if "delay" in request.GET:
        # Simulate a delay in the response
        import time

        time.sleep(5)

    if "raise_exception" in request.GET:
        # Simulate an exception
        raise Exception("Simulated exception for testing")

    if "no_component" in request.GET:
        # Simulate a response without a component
        return Response(request, "Foo", {})

    return Response(
        request,
        "Navigation",
        {
            "home_url": reverse("home"),
        },
    )
