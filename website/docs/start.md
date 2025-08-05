---
sidebar_position: 2
---

# Getting started

## Trying it out

Have a look at our [demo project](https://demo.django-bridge.org) to get an idea of how Django Bridge works.

You can find the source code to this demo on GitHub: [https://github.com/django-bridge/django-react-cms](https://github.com/django-bridge/django-react-cms).
It’s permissively licensed so you can copy it to get started.

## Starting new Django Bridge application

In this section, we will show how to scaffold a new Django/React application on your local machine.

Make sure you have an up-to-date version of [Node.js](https://nodejs.org/) installed and your current working directory is the one where you intend to create a project.

Run the following command in your command line:

```sh
npm create django-bridge@latest myproject
```

This command will install and execute [`create-django-bridge`](https://www.npmjs.com/package/create-django-bridge), the official Django Bridge project scaffolding tool.

### Running the new project with Docker Compose

The root folder contains a ``docker-compose.yml`` file  and ``Makefile`` containing some shortcuts for docker compose.

To create the Docker environment, run ``make setup``. Once that's finished, run ``make start`` to boot it up.

Your new Django Bridge project should be running on [localhost:8000](http://localhost:8000)!

### Running the new project without Docker Compose

You will need to open two terminals so that you can run the Python and Vite processes side by side.

In one terminal, run the following commands to start the Vite devserver:

```sh
cd client
npm install
npm run dev
```

This should start a server at [localhost:5173](http://localhost:5173), there shouldn't be anything here as this will be used by the Python server to fetch built JavaScript in development.

In the other terminal, run the following to install Django, create the database, create a user, then start the Django devserver:

```sh
cd server
poetry install
poetry run python manage.py migrate
poetry run python manage.py createsuperuser
poetry run python manage.py runserver
```

Your new Django Bridge project should be running on [localhost:8000](http://localhost:8000)!

## Adding React and Django Bridge to an existing Django application

In this section, we will show how to install Django Bridge into an existing Django application.

### Installing the Python package

First, install the [``django-bridge`` PyPI package](https://pypi.org/project/django-bridge/) into your Django project using your favourite Python packaging tool. For example, with ``pip`` run:

```sh
pip install django-bridge
```

### Configuring Django settings

The following tasks need to be done in your project's Django settings file.

Add ``django_bridge`` to ``INSTALLED_APPS``:

```python
INSTALLED_APPS = [
	# …

    "django_bridge",

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]
```

Add the ``DjangoBridgeMiddleware`` class to ``MIDDLEWARE``:

```python
MIDDLEWARE = [
    # …

    "django_bridge.middleware.DjangoBridgeMiddleware",
]
```

Add the ``DJANGO_BRIDGE`` setting:

```python
DJANGO_BRIDGE = {
    "CONTEXT_PROVIDERS": {},
    "VITE_DEVSERVER_URL": "http://localhost:5173/static",
}
```

In your production settings, set the ``VITE_BUNDLE_DIR`` to the location of the Vite bundle on the filesystem, and add this to ``STATICFILES_DIRS`` as well:

```python
DJANGO_BRIDGE[“VITE_BUNDLE_DIR”] = # Location of the vite bundle
STATICFILES_DIRS = [DJANGO_BRIDGE["VITE_BUNDLE_DIR"]]
```

### Scaffolding the frontend

The easiest way to set up a new frontend would be to use the ``create-django-bridge`` script to create a new project and copy the ``client`` folder into your existing project.

Make sure you have an up-to-date version of [Node.js](https://nodejs.org/) installed and your current working directory is the one where you intend to create a project.

Run the following command in your command line:

```sh
npm create django-bridge@latest
```

Give the new project the same name as your existing application as the scaffolding too will put that name in various parts of the code.

Once the project is created, copy the ``client`` folder into your existing application source code. You can delete the rest of the generated code.

Now you can start the Vite dev server by running the following commands

```sh
cd client
npm install
npm run dev
```

This should start a server at [localhost:5173](http://localhost:5173), there shouldn't be anything here as this will be used by the Python library to fetch built JavaScript in development.

### Configure your deployment pipeline to deploy the Vite bundle

To generate the Vite bundle, run the following commands in the ``client`` folder:

```sh
cd client
npm install
npm run build
```

This will generate the Vite bundle and save it in the ``client/dist`` folder.

When deployed, the frontend bundle needs to be available on the local filesystem to the Python library so that it can load the Vite bundle manifest (``.vite/manifest.json``) to find the filenames of the generated .js and .css files.
You will need to provide this even if the static assets are hosted separately to the application.
