# Architecture

This application follows a classic **three-tier architecture** pattern, separating concerns into presentation, application logic, and data persistence layers.

## Tier 1: Presentation Layer (Frontend)

- **Technology**: Next.js 16 with React 19, Tailwind CSS | **Location**: `src/web/`
- **Responsibility**: Renders the user interface, handles user interactions, and communicates with the API tier
- **Communication**: Server-side actions call the API via HTTP (internal `API_URL`)
- **Deployment**: Cloud Run (GCP) or Docker container on port 3000

## Tier 2: Application Layer (API)

- **Technology**: Express 5 on Node.js 22 | **Location**: `src/api/`
- **Responsibility**: Provides RESTful endpoints (`/tasks`, `/health`), implements business logic, validates requests, and queries the database
- **Communication**: Receives HTTP requests from the web tier, connects to PostgreSQL via connection pool
- **Deployment**: Cloud Run (GCP) or Docker container on port 3001 (not exposed publicly)

## Tier 3: Data Layer (Database)

- **Technology**: PostgreSQL 17 | **Location**: Managed by Docker (local) or Cloud SQL (GCP)
- **Responsibility**: Stores persistent application data (tasks table), enforces schema constraints
- **Communication**: Accepts SQL queries from the API tier over TCP connection
- **Migrations**: Schema changes managed by `node-pg-migrate` in `src/db/migrations/`

## Benefits of This Architecture

- **Separation of concerns**: Each tier has a single, well-defined responsibility
- **Independent scaling**: Each tier can scale independently based on load
- **Technology flexibility**: Tiers can be upgraded or replaced without affecting others (as long as interfaces remain stable)
