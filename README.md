# Taskify Munch

A simple task management application built with Node.js and TypeScript.

Please see: [API Documentation](https://documenter.getpostman.com/view/21279543/2sA3kPoPHC)

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Running Tests](#running-tests)
-   [Docker Setup](#docker-setup)
-   [Contributing](#contributing)
-   [License](#license)

## Installation

First, clone the repository:

```bash
git clone https://github.com/fruittymango/taskify-munch.git
cd taskify-app
```

Install the necessary dependencies:

```bash
npm install
```

Ensure that you have TypeScript installed globally:

```bash
npm install -g typescript
```

## Usage

To start the build server, use:

```bash
npm run start
```

To start the development server, use:

```bash
npm run dev
```

## Running linter

To run the linter use:

```bash
npm run lint
```

## Running Test

To run all tests

```bash
npm run test
```

To run and watch all unit tests

```bash
npm run test:dev:unit
```

To run and watch all integration tests:

```bash
npm run test:dev:api
```

To run all integration tests:

```bash
npm run test:api
```

To run all unit tests:

```bash
npm run test:unit
```

## Docker Setup

To run the application using Docker, follow these steps:

### 1.Build the Docker image

```bash
docker build -t taskify-munch:latest .
```

### 2. Run the Docker container

```bash
docker run -p 5050:5050 --env-file .env.development taskify-munch-app:latest
```

### 3. Run the Docker container with tests

```bash
docker run --env-file .env.test taskify-munch-app:latest npm run test
```

### 4. Run the Docker container in interactive mode

```bash
docker run -p 5050:5050 --env-file .env.development -i -t taskify-munch:latest sh
```

## Important!

Ensure you have on of the three .env files at the least, name:

-   .env.production
-   .env.development
-   .env.test

With the following variables:

-   PORT=
-   NODE_ENV=
-   DB_NAME=
-   DB_USERNAME=
-   DB_PASSWORD=
-   DB_DIALECT=
-   DB_URL=
-   JWT_SECRET=

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/your-feature)
3. Commit your changes (git commit -m 'Add some feature')
4. Push to the branch (git push origin feature/your-feature)
5. Open a Pull Request

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
