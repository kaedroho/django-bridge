.PHONY: setup rebuild migrate superuser start-react start-vue

setup: rebuild migrate ## Sets up development environment
	FRAMEWORK=react docker compose run client npm install
	FRAMEWORK=vue3 docker compose run client npm install

rebuild: ## Rebuilds the docker containers
	docker compose pull
	bash -c "docker compose build --build-arg UID=$$(id -u)"

migrate: ## Run Django migrations
	docker compose run server django-admin migrate

superuser: ## Create a superuser
	docker compose run server django-admin createsuperuser

start-react: ## Starts the docker containers
	FRAMEWORK=react VITE_DEVSERVER_URL=http://localhost:5173/static docker compose up

start-vue: ## Starts the docker containers
	FRAMEWORK=vue3 VITE_DEVSERVER_URL=http://localhost:5174/static docker compose up
