---
sidebar_position: 4
---

# Writing View Components

Django Bridge applications use React components to render the frontend.
We call these components "View Components" to distinguish them from regular UI components, but there is nothing technically special about them.

## A simple view component

Here's a view component that will render the current time from a prop (see the [example in Writing Views](/docs/views#a-simple-view) for the backend):

```jsx
export default function CurrentTimeView({ time }: { time: Date }) {
    return <h1>It is now {time.toString()}</h1>;
}
```

Let’s step through this code one line at a time:

- First, we define a function component that takes one prop, the time. Because in the Python code this was a ``datetime`` object, this will be converted to a ``Date`` object by Django Bridge

  Note that the name of this function doesn’t matter. We will assign it a name that the Django view can use when we register it in the next step

 - The component returns a JSX element containing the text “It is now [time]” in a ``<h1>`` element

## Registering view components

View components should be registered with your ``Config`` object. If you used the template to generate your application, the ``Config`` object is located in ``client/src/main.tsx``.

To register the view, call ``config.addView()``:

```jsx
config.addView("CurrentTime", CurrentTimeView);
```

Now, whenever a Django view returns a ``Response`` containing the name “CurrentTime”, the ``CurrentTimeView`` will be rendered.
