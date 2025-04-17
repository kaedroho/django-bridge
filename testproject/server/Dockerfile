FROM node:22.14.0-bookworm-slim AS client

# Install client dependencies
COPY testproject/client/package.json testproject/client/package-lock.json /code/testproject/client/
RUN cd /client && npm install

# Copy the source code of the client into the container.
COPY testproject/client/ /code/testproject/client/

# Build the client
RUN cd /code/testproject/client/ && npm run build

FROM python:3.13.2-slim-bookworm AS base

RUN apt update -y \
    && apt install -y --no-install-recommends \
    # Required to build psycopg2
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

ENV VIRTUAL_ENV=/venv
ENV PATH=$VIRTUAL_ENV/bin:$PATH \
    PYTHONPATH=/code/testproject/server/,/code/python/ \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=testproject.settings \
    PORT=8000

# Add user that will be used in the container
ARG UID=1000
RUN useradd testproject --uid ${UID} --create-home && mkdir -p /code/testproject/server/ $VIRTUAL_ENV && chown -R testproject /code/testproject/server/ $VIRTUAL_ENV

# Install poetry
RUN pip install poetry==2.1.1

# Use user "testproject" to run the build commands below and the server itself.
USER testproject

# Use /code/testproject/ folder as a directory where the source code is stored.
WORKDIR /code/testproject/server/

# Set up virtual environment
RUN python -m venv $VIRTUAL_ENV

# Install Python dependencies
COPY --chown=testproject python /code/python
COPY --chown=testproject README.md /code/README.md
COPY --chown=testproject testproject/server/pyproject.toml testproject/server/poetry.lock ./
RUN poetry install --no-root --only main

# Copy the source code of the project into the container.
COPY --chown=testproject testproject/server .

# Run poetry install again to install our project
RUN poetry install --only main

FROM base AS prod

# Copy the client bundle from the client target
COPY --chown=testproject --from=client /client/dist /client

# Collect static files
ENV VITE_BUNDLE_DIR=/client
RUN DJANGO_SECRET_KEY=secret python manage.py collectstatic --noinput --clear

CMD gunicorn -w 4 --threads 2 testproject.wsgi:application

FROM base AS dev

# Install dev dependencies
RUN poetry install
