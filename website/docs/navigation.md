---
sidebar_position: 5
---

# Navigation

## The ``<Link>`` component

Django Bridge includes a ``<Link>`` built-in component that extends the HTML ``<a>`` tag to provide client-side navigation between views.

For example:

```jsx
import { Link } from "@django-bridge/react";

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

When a user clicks this link, the ``/dashboard`` URL will be fetched in the background and the response rendered.

The ``<Link>`` component accepts all ``<a>`` tag attributes as props, and an extra optional prop called ``skipDirtyFormCheck`` which allows you to disable blocking the navigation away from a page that contains unsaved data in a form.

## The ``navigate()`` function

You can also trigger client-side navigation with the ``navigate()`` function that is provided by ``NavigationContext``.

For example, we can call this function from the ``onClick`` handler of a ``<button>``:

```jsx
import { Link, NavigationContext } from "@django-bridge/react";

export default function Page() {
  const { navigate } = useContext(NavigationContext);
  return <button type="button" onClick={() => navigate("/dashboard")}>Dashboard</button>
}
```

## The `isNavigating` state

The `NavigationContext` provides an `isNavigating` boolean that indicates whether a navigation is currently in progress. This is useful for showing the loading state.

```jsx
import { useContext } from "react";
import { NavigationContext } from "@django-bridge/react";

export default function LoadingIndicator() {
  const { isNavigating } = useContext(NavigationContext);

  return (
    <div className="loading-indicator">
      {isNavigating ? "Loading..." : null}
    </div>
  );
}
