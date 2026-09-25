# Angular.web

A sample Angular single-page application designed to demonstrate modern frontend development, containerization, code quality validation, and CI/CD automation using GitHub Actions.

## Overview

This repository contains the frontend application of the project.

The application is designed as a Single Page Application (SPA) and can be built and served using Node.js during development or Nginx when containerized.

The repository demonstrates:

* Angular frontend development
* Production builds
* Automated testing
* Docker containerization
* Nginx-based serving
* Code quality analysis
* GitHub Actions CI/CD
* Deployment automation

## Technology Stack

| Technology      | Purpose                         |
| --------------- | ------------------------------- |
| Angular         | Frontend framework              |
| TypeScript      | Programming language            |
| Node.js / npm   | Dependency management and build |
| Jasmine / Karma | Frontend testing                |
| Docker          | Containerization                |
| Nginx           | Production web server           |
| GitHub Actions  | CI/CD automation                |
| Sonar           | Code quality/security analysis  |

## Repository Structure

```text
Angular.web/
│
├── .github/
│   └── workflows/
│       └── CI/CD workflow files
│
├── angular.web/
│   └── Angular application source
│
├── scripts/
│   └── Automation/deployment scripts
│
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── sonar-project.properties
└── .dockerignore
```

## Prerequisites

Install the following tools for local development:

* Node.js
* npm
* Angular CLI
* Git
* Docker (optional)

## Clone the Repository

```bash
git clone https://github.com/rohityadav10/Angular.web.git
cd Angular.web
```

## Install Dependencies

Navigate to the Angular application directory if required and install the dependencies:

```bash
npm ci
```

If the project is being initialized locally for the first time, `npm install` may also be used.

## Run the Application Locally

Start the Angular development server:

```bash
ng serve
```

The application can then be accessed through the local URL displayed by Angular CLI.

## Production Build

Create a production build using:

```bash
ng build --configuration production
```

The generated production files can be served using a web server such as Nginx.

## Testing

The Angular application uses the Jasmine/Karma testing ecosystem.

Tests can be executed using:

```bash
ng test
```

The CI/CD pipeline is designed to execute automated frontend tests as part of the validation process.

## Docker

The repository contains a multi-stage Dockerfile for building and serving the Angular application.

The typical approach is:

```text
Angular Source
      ↓
Node.js Build Stage
      ↓
Production Angular Build
      ↓
Nginx Runtime Image
      ↓
Angular SPA
```

### Build Docker Image

```bash
docker build -t angular-web .
```

### Run Docker Container

```bash
docker run -d -p 8080:80 --name angular-web angular-web
```

The application can then be accessed through:

```text
http://localhost:8080
```

## Nginx

Nginx is used as the production web server for the containerized Angular application.

The Nginx configuration is maintained in:

```text
nginx.conf
```

The configuration supports serving the Angular SPA from the Nginx runtime container.

## Docker Compose

A `docker-compose.yml` file is also included for simplified local container-based execution.

Example:

```bash
docker compose up --build
```

To stop the containers:

```bash
docker compose down
```

## Code Quality and Security

The repository contains Sonar configuration:

```text
sonar-project.properties
```

The CI/CD process can use static analysis and dependency/security checks to identify issues before deployment.

Security practices include:

* Avoiding hardcoded credentials
* Dependency vulnerability scanning
* Static code analysis
* Secure CI/CD secrets
* Environment-specific configuration

Sensitive information should never be committed to source control.

## CI/CD

The repository uses **GitHub Actions** for CI/CD automation.

The workflow is maintained under:

```text
.github/workflows/
```

The pipeline is intended to automate:

1. Source checkout
2. Node.js setup
3. Dependency installation
4. Angular production build
5. Automated tests
6. Code quality/security validation
7. Docker image build
8. Deployment-related activities

## Branch Strategy

The application follows a feature-based development model.

```text
feature/*
    ↓
Build / Test / Security Scan
    ↓
Pull Request
    ↓
main / release
    ↓
Deployment Pipeline
```

Feature branches are validated without directly deploying the application.

Deployment activities are associated with the main/release delivery flow.

## Environment-Based Deployment

The CI/CD design supports multiple deployment environments.

```text
Feature Branch
      ↓
Validation
      ↓
SIT
      ↓
UAT
      ↓
Production
```

Environment-specific values should be stored using secure environment variables, GitHub Actions secrets, or other approved secret-management mechanisms.

## Frontend and Backend

This repository represents the frontend portion of the application.

The corresponding backend REST API is maintained separately in:

**NetCore.API**

The two repositories can therefore be maintained and delivered independently while participating in the overall application CI/CD process.

## Container Deployment

The Angular application is container-ready and can be deployed to container platforms such as Azure Container Apps.

The containerized deployment provides:

* Consistent runtime environment
* Repeatable deployments
* Scalable application hosting
* Environment isolation
* Easy rollback through image versioning

## Project Purpose

This project is primarily intended as a DevOps/CI-CD exercise demonstrating automated delivery of an Angular SPA.

The main areas demonstrated are:

* Frontend build automation
* Automated testing
* Code quality analysis
* Security scanning
* Docker containerization
* Nginx-based hosting
* CI/CD automation
* Environment-based deployment

## License

This project is provided for demonstration and learning purposes.
