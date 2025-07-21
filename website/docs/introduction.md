---
sidebar_position: 1
---

# Introduction

### What is Django Bridge?

Django Bridge is a Python and TypeScript package that makes it a lot easier to build React frontends for Django applications.

It takes care of routing requests (using Django URL patterns) and marshalling data from Django views and forms to React.

Working on a Django Bridge app feels a lot like working on a traditional MVC Django app but instead of templates, you use React components.

### What are the main advantages of Django Bridge?

#### Lighter then traditional SPA

Django Bridge encourages putting application logic on the server,  using purpose-built Django views instead of generic APIs and keeping the client-side light and nimble.

But like an SPA, page loads are fast and you can easily bundle React components when you need them.

#### React without the heavy boilerplate

Django Bridge only requires vanilla react, no redux, react-router, is required if you don't want them. Just one small (~15KB) library and a little bit of [configuration](https://github.com/django-bridge/django-react-cms/blob/9873e1295701a20a94ce0496af6b4e04f44a9843/client/src/main.tsx#L24-L44) is required to start rendering pages.

There is nothing fancy about the tooling (Vite based) so is compatible with all common React component libaries and styling frameworks. It even has support for Storybook!

#### Built for Django

Django Bridge has deep support for Django, so features such as forms, messaging, user auth, and internationalisation work in a similar way to a regular Django app.

### How does it work?

On the backend, it's very similar to a traditional Django app. The difference is, views return JSON instead of HTML to describe what to render.

When a user clicks a link in your app, a `fetch()` request is made to the application in the background. This request is routed by Django to a view that processes the request and returns a JSON document like the following:

```
{
    "action": "render",
    "view": "ImageListing",
    "props": {
        "images": [
           ...
        ],
       ...
    },
    "metadata": {
    	"title": "Image Listing"
    },
    "context": {
    	"user": {
    	    ...
    	}
    }
}
```

This provides everything the frontend needs to know to render the page:

- `action`: What to do (can be `render` or `redirect`)
- `view`: What component to render
- `props`: The data to pass directly into the component (can include Python-adapted objects like forms)
- `metadata`: This includes the `title` to show in the browser bar, but can include other metadata fields as well
- `context`: Global data that is added to all responses automatically, used for user details, URLs, CSRF token. These get translated into React contexts.

When this response is received by the frontend, it is rendered and then displayed to the user.

On the very first request, the browser will be expecting HTML. So we have a Django middleware that checks if the request was from the browser or from a background `fetch()`, if it's from the browser, the responses is wrapped with a "bootstrap" HTML template that loads the frontend bundle and renders the first response.

### Should I use it?

Django Bridge is a good choice when:

- You are building an application, not a website
- You want to use React
- You are building the frontend and backend together

