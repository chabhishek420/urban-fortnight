# Technology Stack

**Analysis Date:** 2026-03-28

## Languages

**Primary:**
- TypeScript 5.3.3 - All source code in `src/` directory

**Secondary:**
- PHP 7.4 - Reference source in `keitaro_source/` (original implementation)

## Runtime

**Environment:**
- Node.js >=20.0.0

**Package Manager:**
- Bun (preferred) - Used for `bun install`, `bun run dev`, `bun test`
- npm compatibility - Package.json scripts work with npm/yarn

## Frameworks

**Core Web Framework:**
- Next.js 14.1.0 - App Router architecture
  - `src/app/` - Next.js pages and API routes
  - `src/server/` - Custom Fastify server integration

**API Server:**
- Fastify 5.8.4 - HTTP framework for API endpoints
  - `@fastify/cors` 11.2.0 - CORS support
  - `@fastify/cookie` 11.0.2 - Cookie handling
  - `@fastify/formbody` 8.0.2 - Body parsing
  - `@fastify/rate-limit` 10.3.0 - Rate limiting
  - `@fastify/static` 9.0.0 - Static file serving
  - `@fastify/swagger` 9.7.0 - API documentation
  - `@fastify/swagger-ui` 5.2.5 - Swagger UI

**Database:**
- Prisma 5.8.1 - ORM for database operations
  - Provider: SQLite (default), MySQL, PostgreSQL supported

**Testing:**
- Vitest 1.1.3 - Unit testing framework
  - Config: `vitest.config.ts`

**Frontend:**
- React 18.2.0 - UI library
- React DOM 18.2.0

**Linting/Formatting:**
- ESLint 8.56.0 - Code linting
- eslint-config-next 14.1.0 - Next.js ESLint config

## Key Dependencies

**Database & ORM:**
- `@prisma/client` 5.8.1 - Prisma database client

**Caching & Sessions:**
- `ioredis` 5.3.2 - Redis client (optional caching layer)

**Geo-IP & Device Detection:**
- `ip2location-nodejs` 9.6.1 - IP geolocation lookup
- `maxmind` 4.3.22 - GeoIP2 database reader
- `device-detector-js` 3.0.3 - Device/user-agent parsing

**Logging:**
- `pino` 10.3.1 - JSON logging framework

**Utilities:**
- `uuid` 9.0.1 - Unique ID generation
- `zod` 3.22.4 - Schema validation for config

## Configuration

**Environment Variables:**
The application uses comprehensive environment-based configuration via Zod schemas:

| Variable | Purpose | Default |
|----------|---------|---------|
| `DATABASE_URL` | Database connection string | `file:./db/custom.db` |
| `REDIS_URL` | Redis connection string | (disabled) |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `SECRET_KEY` | Application secret | (insecure default) |
| `LOG_LEVEL` | Logging verbosity | `info` |
| `CORS_ENABLED` | Enable CORS | `true` |
| `RATE_LIMIT_ENABLED` | Enable rate limiting | `true` |

**Database Config (`src/config/database.ts`):**
- Supports SQLite, MySQL, PostgreSQL
- Connection pooling configurable
- SSL support for production

**Redis Config (`src/config/redis.ts`):**
- Optional caching layer
- Connection pool management
- TLS support

**App Config (`src/config/app.ts`):**
- Environment detection
- Request/response settings
- Feature flags

**Build Config:**
- `tsconfig.json` - TypeScript configuration with strict mode
- `vitest.config.ts` - Test configuration with coverage
- `.eslintrc.json` - ESLint extends `next/core-web-vitals`

## Platform Requirements

**Development:**
- Node.js >=20.0.0
- Bun or npm for package management
- Prisma CLI for database operations

**Production:**
- Node.js >=20.0.0
- Database (SQLite/MySQL/PostgreSQL)
- Optional: Redis for caching
- Optional: MaxMind GeoIP database

---

*Stack analysis: 2026-03-28*
