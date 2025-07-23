---
sidebar_position: 1
---

# Introduction

### What is Django Bridge?

Django Bridge is a Python and TypeScript package that makes it a lot easier to build React frontends for Django applications.

It takes care of routing requests (using Django URL patterns) and marshalling data from Django views and forms to React.

### How does it work?

The Django side is very similar to a traditional Django app: Every page has a URL, and every URL routes to a view that processes requests. The difference is, views return JSON instead of HTML to describe what to render and the rendering is done by React instead of a template.

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

