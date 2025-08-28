FROM node:22.14.0-bookworm-slim AS dev

ARG UID=1000
RUN userdel node && useradd testproject --uid ${UID} -l --create-home && mkdir -p /code/testproject/client/react/ && chown testproject /code/testproject/client/react/

WORKDIR /code/testproject/client/react/
USER testproject
