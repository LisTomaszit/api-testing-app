# API Testing App with Playwright

Custom web application for testing API interactions with automated UI and API tests using Playwright.

## Project Overview

This project was created to simulate real-world API testing scenarios using a custom-built web application.

The application allows users to:

- fetch users from an API
- send POST requests
- display results in UI
- handle and log errors

## Tech Stack

- JavaScript (ES6+)
- HTML & CSS
- Playwright
- REST API (JSONPlaceholder)

## Project Structure

    .
    ├── index.html
    ├── script.js
    ├── tests/
    │   ├── api.spec.js
    │   └── ui.spec.js
    ├── playwright.config.js
    ├── package.json

## Test Coverage

### API Tests

- GET users endpoint returns valid data
- POST request creates a new user

### UI Tests

- fetching users updates UI list
- POST request adds logs to UI
- clearing data removes users and logs
- API error (500) is handled correctly

## Features Tested

- request interception and mocking
- validation of request payload
- error handling and edge cases
- DOM updates and UI state changes

## How to Run

Run the application using Live Server (VS Code extension).

Install dependencies:

    npm install

Run tests:

    npx playwright test

Run UI mode:

    npx playwright test --ui

## Notes

- UI tests use request interception to simulate API responses
- project demonstrates both frontend logic and test automation

## Author

Tomasz Lis
