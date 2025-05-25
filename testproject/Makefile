.PHONY: setup rebuild migrate superuser start test test-ui test-debug test-install

setup: rebuild migrate ## Sets up development environment
	docker compose run client npm install

rebuild: ## Rebuilds the docker containers
	docker compose pull
	bash -c "docker compose build --build-arg UID=$$(id -u)"

migrate: ## Run Django migrations
	docker compose run server django-admin migrate

superuser: ## Create a superuser
	docker compose run server django-admin createsuperuser

start: ## Starts the docker containers
	docker compose up

test-install: ## Install Playwright test dependencies
	npm install
	npx playwright install

test: ## Run Playwright tests
	npm test

test-ui: ## Run Playwright tests in UI mode
	npm run test:ui

test-debug: ## Run Playwright tests in debug mode
	npm run test:debug
