<h1 align="center">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="website/static/img/django-bridge-text-black.svg">
        <source media="(prefers-color-scheme: dark)" srcset="website/static/img/django-bridge-text.svg">
        <img width="350" src="website/static/img/django-bridge-text-black.svg" alt="Django Bridge">
    </picture>
</h1>

<p align="center">
    <br>
    <a href="https://github.com/django-bridge/django-bridge/actions">
        <img src="https://github.com/django-bridge/django-bridge/workflows/Django%20Bridge%20CI/badge.svg" alt="Build Status" />
    </a>
    <a href="https://opensource.org/licenses/BSD-3-Clause">
        <img src="https://img.shields.io/badge/license-BSD-blue.svg" alt="License" />
    </a>
    <a href="https://pypi.python.org/pypi/django-bridge/">
        <img src="https://img.shields.io/pypi/v/django-bridge.svg" alt="Version" />
    </a>
    <a href="https://pypi.python.org/pypi/django-bridge/">
        <img src="https://img.shields.io/badge/Documentation-blue" alt="Documentation" />
    </a>
</p>

With Django Bridge, you can create fast, user-friendly single-page-applications and use all components available in the React and Vue ecosystems while keeping all application logic in Django.

Django Bridge applications use Django's built-in URL routing and views, allowing you to build your backend like a regular Django app and render the frontend with React or Vue components instead of Django templates.

The package contains a Django middleware and a small (11KB) frontend library that handles the data fetching and adapting Python objects into JavaScript.

Find out more in our [Introduction](https://django-bridge.org/docs/introduction)

## Key Features

 - Quickly build React or Vue applications with all the app logic in Django views, no APIs required!
 - Deeply integrated with Django. Supports Django forms, messages, and authentication
 - Open URLs in overlays to build modal interfaces
 - Use whatever UI component library/css framework you like
 - Supports Storybook and Vite hot module reloading
 - Available for both React (`@django-bridge/react`) and Vue 3 (`@django-bridge/vue`)

## Demo project

Have a look at our demo project to see Django Bridge in action!

Live Demo: [demo.django-bridge.org](https://demo.django-bridge.org)
Source code: [github.com/django-bridge/django-react-cms](https://github.com/django-bridge/django-react-cms)

## Support

For support, please reach out to us on [GitHub discussions](https://github.com/django-bridge/django-bridge/discussions)
