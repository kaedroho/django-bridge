# Python objects in React

Django Bridge has built-in support for converting Python objects into JavaScript objects so they can be used by React.

To use this, we need to define two adapters, one which converts Python class into a JSON representation, the other which constructs a JavaScript object from that JSON.

In Python, Django Bridge will look for an ``adapters.py`` file in each installed application and load any adapters it defines. In JavaScript, you need to register adapters using the ``Config.addAdapter`` function.

For example, here is an adapter to convert Django's ``TextInput`` widget:

```python

from django import forms
from django_bridge.adapters import Adapter, register

class TextInputAdapter(Adapter):
    js_constructor = "forms.TextInput"

    def js_args(self, widget):
        return [
            "text",
            widget.attrs.get("class", ""),
        ]

register(TextInputAdapter(), forms.TextInput)
```

Let's step through this code one line at a time:

- First, we import the Django forms framework and the ``Adapter`` class and ``register`` function from Django Bridge

- Next, we define a class called ``TextInputAdapter`` that inherits from ``Adapter``

- Then we set the ``js_constructor`` attribute to "forms.TextInput". This tells the frontend which constructor to use to create the JavaScript object. The naming convention of this is arbitrary

- We then define a ``js_args`` function. This takes an instance of a ``TextInput`` and returns a list of arguments that will be passed in to the constructor.
In this example, we want to know the type of ``TextInput`` (since we can reuse this for passwords and emails) and the ``class``.

- Finally, we call ``register`` which adds the adapter to the registry. The second argument is the type of object that this adapter will adapt. Note that this `adapter` will also adapt any other class that inherits from ``TextInput`` unless a more specific adapter is registered for the sub-class

Next we need to define the JavaScript portion of the adapter. For this, we need a class that represents our ``TextInputDef``:

```jsx
export default class TextInputDef {
  constructor(type, className) {
    this.type = type;
    this.className = className;
  }

  render(id, name, disabled, value) {
    return (
      <input
        id={id}
        type={this.type}
        name={name}
        defaultValue={value}
        disabled={disabled}
        className={this.className}
      />
    );
  }
}
```

The only part of this class that is important to get right is the parameters to the constructor. These parameters must match the values returned by the ``js_args`` method of the Python adapter.

In this example, we've added ``render()`` method to demonstrate that how you can use these classes. You can define any methods you like on the class.

To register the adapter, use the ``addAdapter`` method on your config object in ``main.tsx``. The first parameter must match the value of ``js_constructor`` on the Python adapter as this is how Django Bridge will know which JavaScript adapter to use. The second parameter is the class to use:

```tsx
const config = new DjangoBridge.Config();

// Add your views here
config.addView("Home", HomeView);
// ...


// Add your adapters here
config.addAdapter("forms.TextInput", TextInputDef);
```

Now, when you use a ``TextInput`` in a response, it will be automatically converted to a ``TextInputDef`` in JavaScript, where you can call ``.render()`` on it.
