# Verita Marketplace

A monorepo containing two Next.js applications for the Verita AI job marketplace platform.

## Overview

Verita Marketplace is a job board platform for AI training specialists, featuring:

- **Public Site** (`apps/public`): Public-facing job board where candidates can browse and apply for positions
- **Ops Dashboard** (`apps/ops`): Internal dashboard for managing jobs and reviewing applications

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Neon)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5
- **Monorepo**: Turborepo + pnpm workspaces

## Project Structure

```
verita-marketplace/
├── apps/
│   ├── public/          # jobs.verita.ai - Public job board
│   └── ops/             # ops.verita.ai - Internal dashboard
├── packages/
│   └── database/        # Shared Prisma schema and client
├── package.json         # Root package.json with workspaces
├── turbo.json          # Turborepo configuration
└── pnpm-workspace.yaml # pnpm workspace configuration
```

## Local Development

### Prerequisites

- Node.js >= 18
- pnpm >= 9.0.0
- PostgreSQL database (or Neon account)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd verita-marketplace
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create `.env` files in the following locations:

   **Root `.env`** (for Prisma commands):
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
   ```

   **`apps/public/.env`**:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
   ```

   **`apps/ops/.env`**:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
   AUTH_SECRET="your-secret-key-min-32-characters"
   AUTH_URL="http://localhost:3001"
   AUTH_TRUST_HOST=true
   ```

4. **Generate Prisma client**
   ```bash
   pnpm db:generate
   ```

5. **Push database schema**
   ```bash
   pnpm db:push
   ```

6. **Seed the database** (optional)
   ```bash
   cd packages/database
   pnpm db:seed
   ```

7. **Start development servers**
   ```bash
   pnpm dev
   ```

   - Public site: http://localhost:3000
   - Ops dashboard: http://localhost:3001

### Default Login Credentials

After running the seed script:

- **Admin**: `admin@verita.ai` / `changeme123`
- **Ops User**: `ops@verita.ai` / `verita123`

## Environment Variables

### Required for Both Apps

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |

### Required for Ops App Only

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | Secret key for NextAuth.js (min 32 characters) |
| `AUTH_URL` | Full URL of the ops app (e.g., `https://ops.verita.ai`) |
| `AUTH_TRUST_HOST` | Set to `true` for Vercel deployment |

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Lint all apps |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema changes to database |
| `pnpm db:migrate` | Run database migrations |

## Deployment to Vercel

### Public Site (jobs.verita.ai)

1. Create a new Vercel project
2. Set the **Root Directory** to `apps/public`
3. Add environment variable:
   - `DATABASE_URL`: Your production database URL

### Ops Dashboard (ops.verita.ai)

1. Create a new Vercel project
2. Set the **Root Directory** to `apps/ops`
3. Add environment variables:
   - `DATABASE_URL`: Your production database URL
   - `AUTH_SECRET`: A secure random string (min 32 characters)
   - `AUTH_URL`: `https://ops.verita.ai` (your production URL)
   - `AUTH_TRUST_HOST`: `true`

### Database Setup

1. Create a Neon database at https://neon.tech
2. Copy the connection string
3. Run migrations against production:
   ```bash
   DATABASE_URL="your-production-url" pnpm db:push
   ```

## Features

### Public Site
- Job listings with search and filtering
- Detailed job pages
- Application form with file upload
- Responsive design

### Ops Dashboard
- Secure authentication
- Job management (create, edit, publish, close)
- Application review and status tracking
- Internal notes on applications
- CSV export of applications
- Dashboard with statistics

## License

Private - All rights reserved
