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

## Running Test\

To run tests, use:

```bash
npm run test
```

To run tests with coverage, use:

```bash
npm run test:coverage
```

To run tests with the coverage, verbose and watchAll flag, use:

```bash
npm run test:dev
```

To run tests with verbose flag, use:

```bash
npm run test:verbose
```

To run tests with the verbose and coverage flag, use:

```bash
npm run test:verbose:coverage
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

To run tests with Docker Compose, use:

```bash
docker-compose run test
```

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/your-feature)
3. Commit your changes (git commit -m 'Add some feature')
4. Push to the branch (git push origin feature/your-feature)
5. Open a Pull Request
