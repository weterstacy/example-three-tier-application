# Source Files Reference

This document provides a comprehensive listing of all files under the `src/` directory with a one-line description of each file's purpose.

## Table of Contents

- [API Service (`src/api/`)](#api-service-srcapi)
- [Database Service (`src/db/`)](#database-service-srcdb)
- [Infrastructure (`src/infrastructure/`)](#infrastructure-srcinfrastructure)
- [Web Application (`src/web/`)](#web-application-srcweb)

---

## API Service (`src/api/`)

Backend REST API service built with Express and PostgreSQL.

### Root Files

- **`.dockerignore`** - Specifies files to exclude from Docker build context (node_modules, .git)
- **`Dockerfile`** - Multi-stage Docker build configuration for the API service using Node 22 Alpine
- **`db.js`** - Database connection pool configuration using pg library with DATABASE_URL from environment
- **`index.js`** - Express server with REST endpoints for tasks (GET, POST, PATCH) and health check
- **`package.json`** - Node.js package manifest defining API service dependencies (express, pg)
- **`package-lock.json`** - Locked dependency versions for reproducible npm installs

---

## Database Service (`src/db/`)

Database migration service using node-pg-migrate for schema management.

### Root Files

- **`.dockerignore`** - Specifies files to exclude from Docker build context (node_modules, .git)
- **`Dockerfile`** - Docker image that runs database migrations against an existing Postgres instance
- **`package.json`** - Node.js package manifest for migration tooling (node-pg-migrate, pg)
- **`package-lock.json`** - Locked dependency versions for reproducible npm installs

### Migrations (`src/db/migrations/`)

- **`1718500000000_initial-schema.js`** - Creates the users table with id, email, and created_at columns
- **`1718500001000_create-tasks.js`** - Creates the tasks table with id, title, completed, and created_at columns

---

## Infrastructure (`src/infrastructure/`)

Terraform configuration for deploying the three-tier application to Google Cloud Platform.

### Root Files

- **`.gitignore`** - Excludes Terraform state files, tfvars, and temporary files from version control
- **`main.tf`** - Primary Terraform configuration defining VPC, Cloud SQL, Cloud Run services, and networking
- **`migration.tf`** - Defines Cloud Run Job for executing database migrations with VPC access
- **`outputs.tf`** - Terraform outputs including URLs, database info, VPC name, and service account
- **`terraform.tfvars.example`** - Example configuration file template with placeholder values for required variables
- **`variables.tf`** - Input variable definitions including project_id, region, image references, and scaling config

---

## Web Application (`src/web/`)

Next.js frontend application with server-side rendering and Tailwind CSS.

### Root Files

- **`.dockerignore`** - Specifies files to exclude from Docker build context (node_modules, .next, .git)
- **`.gitignore`** - Excludes build artifacts, dependencies, and environment files from version control
- **`Dockerfile`** - Multi-stage Docker build for production Next.js deployment with standalone output
- **`eslint.config.mjs`** - ESLint configuration using Next.js recommended rules for code quality
- **`jest.config.ts`** - Jest test framework configuration with TypeScript support and path mapping
- **`next.config.ts`** - Next.js configuration enabling standalone output mode for Docker deployment
- **`package.json`** - Node.js package manifest with Next.js, React, testing, and build dependencies
- **`package-lock.json`** - Locked dependency versions for reproducible npm installs
- **`postcss.config.mjs`** - PostCSS configuration for Tailwind CSS processing
- **`tsconfig.json`** - TypeScript compiler configuration with Next.js-specific settings and path aliases

### Application Code (`src/web/app/`)

- **`actions.ts`** - Next.js server actions for task management (getTasks, createTask, toggleTask)
- **`c6-ci-test.ts`** - Test marker file containing a constant for CI/CD testing purposes
- **`favicon.ico`** - Application favicon displayed in browser tabs
- **`globals.css`** - Global CSS styles with Tailwind imports and theme variables for light/dark mode
- **`layout.tsx`** - Root layout component defining HTML structure, fonts, and metadata
- **`page.tsx`** - Home page component rendering the to-do list UI with task forms and list display

### Utility Functions (`src/web/utils/`)

- **`dateHelpers.ts`** - Utility functions for date formatting, manipulation, and validation
- **`dateHelpers.test.ts`** - Comprehensive Jest test suite for all date helper functions
- **`README.md`** - Documentation for the utils directory (content not inspected)

### Public Assets (`src/web/public/`)

- **`file.svg`** - SVG icon asset for file representation
- **`globe.svg`** - SVG icon asset for globe/world representation
- **`next.svg`** - Next.js logo SVG asset
- **`vercel.svg`** - Vercel logo SVG asset
- **`window.svg`** - SVG icon asset for window representation

### Documentation (`src/web/`)

- **`AGENTS.md`** - Documentation for AI agents working on the project
- **`CLAUDE.md`** - Claude AI-specific documentation or instructions
- **`README.md`** - Web application documentation and setup instructions
- **`TESTING.md`** - Testing guidelines and documentation for the web application

---

## Summary

The source tree is organized into four main sections:

1. **API Service**: Express.js REST API providing task management endpoints
2. **Database Service**: PostgreSQL schema migrations using node-pg-migrate
3. **Infrastructure**: Terraform IaC for GCP deployment with Cloud Run and Cloud SQL
4. **Web Application**: Next.js frontend with TypeScript, Tailwind CSS, and comprehensive testing

Total file count: **57 files** across all directories under `src/`.
