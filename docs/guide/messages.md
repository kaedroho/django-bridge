# Messages

When building web applications, you will likely need to send users one-time notifications (also known as "flash messages") after certain events take place (like creating/updating/deleting something).

Django provides [a module](https://docs.djangoproject.com/en/5.0/ref/contrib/messages/) for generating these messages from Python and Django Bridge makes these messages available to React components with a context called ``MessagesContext``.

Messages can have one of three levels: Success, Warning and Error. Their contents can be either plain text or HTML.

The ``MessagesContext`` also provides a ``pushMessage`` function that you can use  to generate new messages from client-side code.

## Rendering messages with a React component

Here's an example component that will render the messages using a React component:

```jsx
import { MessagesContext } from "@django-bridge/react";

export function Messages() {
 const { messages } = React.useContext(MessagesContext);

 return (
   <ul>
     {messages.map((message) => {
       if ("html" in message) {
         return (
           <li
             key={message.html}
             role="alert"
             aria-live={message.level === "error" ? "assertive" : "polite"}
             dangerouslySetInnerHTML={{
               __html: message.html,
             }}
           />
         );
       }

       return (
         <li
           key={message.text}
           role="alert"
           aria-live={message.level === "error" ? "assertive" : "polite"}
         >
           {message.text}
         </li>
       );
     })}
   </ul>
 );
}
```

## Generating messages from React

In addition to messages coming from the Django app, messages can be sent from frontend code using the ``pushMessage()`` function.
This function takes an object containing a "level" key which can either be "success", "warning" or "error" and either a "text" key for plain text or a "html" key for HTML.

For example, here's how you could generate a message when a user clicks a button:

```jsx
import { MessagesContext } from "@django-bridge/react";

export function MessageButton() {
 const { pushMessage } = React.useContext(MessagesContext);

 return (
   <button
     onClick={() =>
       pushMessage({
         level: "success",
         text: "Button Clicked!",
       })
     }
   >
     Click me
   </button>
 );
}
```
