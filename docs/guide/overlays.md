# Overlays and modals

**WORK IN PROGRESS: This is just a stub for now**

Django Bridge supports opening any URL in an overlay/modal using the ``openOverlay`` function.

For example:

```jsx
<button
  onClick={() =>
    openOverlay("/posts/add/", (content) => (
      <ModalWindow>
        {content}
      </ModalWindow>
    ), {
      onClose: () => {
        // Refresh props so new post pops up in listing
        refreshProps();
      }
    })
  }
>
  Add Post
</button>
```

This will fetch the view at ``/posts/add/`` and render the result in an overlay. The overlay UI is provided by the ``<ModalWindow>`` component defined by the application.
