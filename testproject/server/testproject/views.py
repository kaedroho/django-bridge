from django_bridge.response import Response


def home(request):
    return Response(request, "Home", {})
