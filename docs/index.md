# Django Bridge

**Django Bridge lets you build React applications with Django views.**

[Get started](getting-started/start.md){ .md-button .md-button--primary }
[Demo](https://demo.django-bridge.org){ .md-button }

---

- Use Django views, URLs, and forms to build single page applications
- Render your frontend with React using any component library or styling framework
- No REST API or GraphQL layer needed — views return everything a page needs in one request
- Works with Django middleware, auth, forms, and extensions like django-allauth
- Hot-reloading in development for fast iteration
- Serialize Python objects (including forms and widgets) directly into React props

---

## Example

A Django view returns a response specifying which React component to render and what props to pass:

```python
from django_bridge import Response

def form_view(request):
    form = MyForm(request.POST or None)

    if form.is_valid():
        # Form submission logic here

    return Response(request, "FormView", {
        "action_url": reverse("form"),
        "form": form,
    })
```

The React component receives those props and renders the page:

```jsx
function FormView({ action_url, form }) {
    return (
      <Layout>
        <h1>A Django form rendered with React</h1>

        <Form action={action_url} method="post">
          {form.render()}
          <button type="submit">Submit</button>
        </Form>
      </Layout>
    );
}
```
