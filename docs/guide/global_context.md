# Global Context

Your application may need access to some global data that isn't view specific. For example, URLs to display in heading navigation, or details about the currently logged in user.

This data can be provided by using a "global context provider" which is a Python function that takes a request and returns some data to send with the response.

These are analogous to Django's "template context processors" with one key difference, each global context processor's data can be retrieved individually in the frontend (they are not merged together).

## An example global context provider

Here's an example global context provider that provides details about the currently logged in user.

```python
def user(request):
   return {
       "username": request.user.username,
       "fullName": request.user.get_full_name(),
       "profileUrl": reverse("user_profile", args=[request.user.username])
   }
```

To register it, add the dotted path to the function to the ``CONTEXT_PROVIDERS`` key in your  ``DJANGO_BRIDGE`` settings:

```python
DJANGO_BRIDGE = {
   ...
   "CONTEXT_PROVIDERS": {
       "user": "myapp.context_providers.user",
   }
}
```
## Using global context data in React

Global context processors are mapped to React contexts, so their data can be retrieved in the view component, or any component called by a view using React's [``useContext``](https://react.dev/reference/react/useContext) hook.

Firstly, you need to create the contexts and register them with your Django Bridge ``Config``.
If you used the template to generate your application, this object is located in ``client/src/main.tsx``.

To register the context, call ``Config.addContextProvider``. For example, here's how to register an empty context to take the user details:

```jsx
const UserContext = React.createContext(null);

config.addContextProvider("user", UserContext);
```

Note the first argument must match the key used in ``CONTEXT_PROVIDERS``.

Now you can retrieve the user details in a component. Here's a component that displays the user's name in a link to their account:

```jsx
export function UserAccount() {
  const user = React.useContext(UserContext);
  return <Link href={user.profileUrl}>{user.fullName}</Link>;
}
```
