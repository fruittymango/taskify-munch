# Taskify Munch

A simple task management application built with Node.js and TypeScript.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Running Tests](#running-tests)
- [Docker Setup](#docker-setup)
- [Contributing](#contributing)
- [License](#license)

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

To start the development server, use:

```bash
npm run start:dev
```

To start the build server, use:

```bash
npm run start:build
```

## Running Test

To run all tests

```bash
npm run test
```

To run and watch all test tests

```bash
npm run test:dev:unit
```

To run and watch all test tests:

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

# 1.Build the Docker image:

```bash
docker build -t taskify-munch .
```

# 2. Run the Docker container:

```bash
docker run -p 3000:3000 taskify-munch
```

## [Optional] Docker Compose

To start the services, use:

```bash
docker-compose up
```

To start and run test in an isolated service, use:

```bash
docker-compose run test
```

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/your-feature)
3. Commit your changes (git commit -m 'Add some feature')
4. Push to the branch (git push origin feature/your-feature)
5. Open a Pull Request
