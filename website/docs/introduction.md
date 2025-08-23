---
sidebar_position: 1
---

# Introduction

### What is Django Bridge?

Django Bridge is a Python and TypeScript package for building React frontends for Django applications.

It allows you to use Django URLpatterns and views for building single page apps.

## Why use Django routing instead of react-router?

- **Faster backend** - Views provide a way to make specialised endpoints for each part of your app that can be optimised, and don't incur the complexity of GraphQL.
- **Lighter frontend** - All routing is on the server, views provide a great place to keep all your app logic. You can just use React as a templating system if you want to.
- **Work with Django ecosystem** - You can use Django middleware, auth tools, forms, and even share your URL space with regular Django HTML views and APIs -- handy for migrating to React, or using the Django admin.

### How does it work?

Like a regular Django app, all requests are routed by URL patterns defined in Python to a Django view, instead of an API. Views return JSON instead of HTML to describe what to render and the rendering is done by React instead of a template.

When a user clicks a link, a background HTTP request is made to Django which routes the request to a view and returns a JSON document describing what to render next:

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

On the very first request, the response is wrapped with a "bootstrap" HTML template that loads the frontend bundle and renders the first response. Subsequent requests after that update the page using the JSON responses.

Django Bridge uses Telepath to allow any Python object to be serialized into JSON and deserialized into JavaScript objects This is useful for rendering Django forms and widgets with React.

### Should I use it?

Django Bridge is a good choice when:

- You are building an application, not a website
- You want to use React
- You are building the frontend and backend together

