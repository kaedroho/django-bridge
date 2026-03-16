---
hide:
  - navigation
  - toc
---

# Django Bridge

**Build modern web applications with Django and React**

[Get started](getting-started/introduction.md){ .md-button .md-button--primary }
[Demo](https://demo.django-bridge.org){ .md-button }

---

### Ready for action

Ship your next product fast with the most productive backend framework.
Iterate your frontend quickly with hot-reloading.

### Familiar and compatible

Build modern SPAs that are powered by standard Django views and forms.
Compatible with common React development practises, component libraries and styling frameworks.

### Lightweight and fast

Keep your frontend lean by putting all app logic in Django views.
Django views are easier to optimise than generic APIs/GraphQL and provide all the data a page needs in a single round-trip.

---

## Build your application logic in Django

Build your backend using Django URLs, views and forms.

```python
from django_bridge import Response

def form(request):
    form = MyForm(request.POST or None)

    if form.is_valid():
        # Form submission logic here

    return Response(request, "FormView", {
        "action_url": reverse("form"),
        "form": form,
    })
```

You can put as much logic as you like into views, as it stays on the server it won't add bloat to your application.

Most Django extensions work without changes (for example, you can use the [Django allauth](https://docs.allauth.org/en/latest/) extension to implement federated authentication).

Views return JSON describing what the frontend should render.

## Render the frontend with React

The JSON response from the server is fed into the props of a React component to render it.

```jsx
function FormView({ action_url, form }) {
    const { csrfToken } = useContext(CSRFTokenContext);

    return (
      <Layout>
        <h1>A Django form rendered with React</h1>

        <Form action={action_url} method="post">
          <input
            type="hidden"
            name="csrfmiddlewaretoken"
            value={csrf_token} />

          {form.render()}

          <button type="submit">Submit</button>
        </Form>
      </Layout>
    );
}
```

Unopinionated about how you build your frontend, you can use any React component library or styling framework that you like.
