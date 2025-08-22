# Django Bridge Test Project

This folder contains a small project with some views test all the logic of Django Bridge.

This project directly imports the Django Bridge code from this repository so you can make changes and test them quickly.

## Running the Application

### Installation

Firstly, you will need to install Docker on your machine.

To set up the containers, run the following command:

```
make setup
```

### Starting

To start the project, run:

```
make start
```

The project will run on port 8000.

## Running Tests

This project includes a comprehensive Playwright test suite for end-to-end testing of Django Bridge functionality.

### Test Setup

1. Install test dependencies:
   ```
   make test-install
   ```

2. Ensure the application is running:
   ```
   make start
   ```

### Running Tests

Run all tests:
```
make test
```

Run tests in UI mode (recommended for development):
```
make test-ui
```

Run tests in debug mode:
```
make test-debug
```

### Test Coverage

The test suite includes:
- **Home page tests**: Element verification, props refresh, URL manipulation
- **Navigation tests**: Link component, navigate() function, error handling
- **Integration tests**: Frame context, state preservation, browser navigation

See `tests/README.md` for detailed information about the test suite.

## Project Structure

```
testproject/
├── client/              # React frontend
├── server/              # Django backend
├── tests/               # Playwright E2E tests
│   ├── home.spec.ts
│   ├── navigation.spec.ts
│   └── integration.spec.ts
├── docker-compose.yml   # Docker configuration
├── Makefile            # Build and run commands
├── package.json        # Node.js dependencies (Playwright)
└── playwright.config.ts # Playwright configuration
```

## Available Make Commands

- `make setup` - Set up the development environment
- `make start` - Start the application
- `make test-install` - Install Playwright dependencies
- `make test` - Run all tests
- `make test-ui` - Run tests in UI mode
- `make test-debug` - Run tests in debug mode
- `make rebuild` - Rebuild Docker containers
- `make migrate` - Run Django migrations
- `make superuser` - Create a Django superuser
