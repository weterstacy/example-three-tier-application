# Architecture Overview

## Three-Tier Architecture

This application implements a classic three-tier architecture pattern, separating concerns into presentation, business logic, and data layers:

```
Browser → Web Tier → API Tier → Database Tier
```

### 1. Presentation Layer (Web Tier)
- **Technology**: Next.js 16 with React 19 and Tailwind CSS
- **Location**: `src/web/`
- **Port**: 3000 (exposed to host)
- **Responsibilities**:
  - Server-side rendering of UI components
  - Client-side interactivity
  - Form handling via Next.js Server Actions
  - Proxying API requests to the backend

### 2. Business Logic Layer (API Tier)
- **Technology**: Express 5 on Node.js 22
- **Location**: `src/api/`
- **Port**: 3001 (internal only)
- **Responsibilities**:
  - RESTful API endpoints (`/tasks`, `/health`)
  - Input validation and error handling
  - Database query execution
  - Business logic for task management

### 3. Data Layer (Database Tier)
- **Technology**: PostgreSQL 17
- **Responsibilities**:
  - Persistent storage of task data
  - Data integrity and constraints
  - Transactional consistency

## Communication Flow

1. **User Interaction**: Browser interacts with Next.js frontend at localhost:3000
2. **Server Actions**: Next.js server calls Express API via internal network (http://api:3001)
3. **Database Access**: Express API connects to PostgreSQL via connection pool
4. **Response Chain**: Data flows back through API → Web → Browser

## Container Orchestration

### Local Development (Docker Compose)

The application uses Docker Compose to orchestrate four services:

1. **postgres**: PostgreSQL 17 database with health checks
2. **migrate**: One-shot service that applies database migrations using node-pg-migrate
3. **api**: Express backend (depends on successful migration)
4. **web**: Next.js frontend (depends on API availability)

Service dependencies ensure proper startup order: postgres → migrate → api → web

### Cloud Deployment (GCP)

Terraform provisions infrastructure on Google Cloud Platform:

- **Cloud Run**: Serverless containers for web and API tiers
- **Cloud SQL**: Managed PostgreSQL instance with private IP
- **VPC**: Network isolation and security
- **Secret Manager**: Secure credential storage
- **IAM**: Service accounts and permission bindings

## Database Migration Strategy

Migrations are managed by `node-pg-migrate` and stored in `src/db/migrations/`:

- **Initial schema** (1718500000000): Creates base database structure
- **Task table** (1718500001000): Creates tasks table with id, title, completed, created_at

The `migrate` service runs automatically on `docker compose up`, applying all pending migrations before the API starts.

## Key Design Decisions

1. **Internal API**: The API is not exposed to the host, enforcing that all external traffic flows through the web tier
2. **Server-Side Rendering**: Next.js App Router provides server-side rendering and Server Actions for form handling without client-side JavaScript frameworks
3. **Connection Pooling**: The API uses pg connection pooling for efficient database access
4. **Health Checks**: PostgreSQL health checks ensure database readiness before migration
5. **Immutable Infrastructure**: Terraform enables reproducible cloud deployments

## Technology Stack Summary

| Layer | Framework | Language | Port |
|-------|-----------|----------|------|
| Web | Next.js 16 | TypeScript | 3000 |
| API | Express 5 | JavaScript | 3001 |
| DB | PostgreSQL 17 | SQL | 5432 |
| Migrations | node-pg-migrate | JavaScript | - |
| IaC | Terraform | HCL | - |

## Application Domain

The application is a simple task manager (to-do list) demonstrating:
- Creating tasks with titles
- Marking tasks as completed/incomplete
- Persistent storage across container restarts
- Full-stack data flow from UI to database
