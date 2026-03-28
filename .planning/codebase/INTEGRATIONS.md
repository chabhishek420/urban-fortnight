# External Integrations

**Analysis Date:** 2026-03-28

## APIs & External Services

**Postback/Tracking Callbacks:**
- Traffic Source Postbacks - Outbound conversion notifications
  - Configured in `TrafficSource` model via `postbackUrl` field
  - Supported statuses: `["sale", "lead", "rejected", "rebill"]`
  - Implementation: `src/traffic/dispatcher/postback-dispatcher.ts`

- Affiliate Network Postbacks - Conversion tracking
  - Configured in `AffiliateNetwork` model via `postbackUrl` field
  - Implementation: `src/traffic/dispatcher/postback-dispatcher.ts`

**Click API:**
- External click tracking API endpoint
  - Implementation: `src/traffic/dispatcher/click-api-dispatcher.ts`

## Data Storage

**Primary Database:**
- **Provider:** Prisma ORM with SQLite (default), MySQL, PostgreSQL support
  - Connection: `DATABASE_URL` env var
  - Schema: `prisma/schema.prisma`
  - Client: `@prisma/client`

**Database Models:**
- `Campaign` - Campaign configuration
- `Stream` - Traffic streams
- `Offer` - Affiliate offers
- `Landing` - Landing pages
- `Click` - Click tracking records
- `Conversion` - Conversion data
- `Visitor` - Visitor profiles
- `Session` - Visitor sessions
- `TrafficSource` - Traffic source configuration
- `AffiliateNetwork` - Affiliate network config
- `Domain` - Domain management

**Caching:**
- **Redis** - Optional caching layer
  - Package: `ioredis` 5.3.2
  - Config: `src/config/redis.ts`
  - Env vars: `REDIS_URL`, `REDIS_ENABLED`, `REDIS_HOST`, `REDIS_PORT`, etc.
  - Key prefix: `keitaro:`

**File Storage:**
- SQLite database file: `./data/keitaro.db` (default)
- Static files: `./public/` directory

## Geo-IP & Device Detection

**IP Geolocation:**
- **IP2Location** - IP to location mapping
  - Package: `ip2location-nodejs` 9.6.1
  - Used for: Country, region, city lookup

- **MaxMind** - GeoIP2 database
  - Package: `maxmind` 4.3.22
  - Used for: IP-based geolocation

**Device Detection:**
- **Device Detector JS** - User agent parsing
  - Package: `device-detector-js` 3.0.3
  - Used for: Device type, OS, browser detection
  - Fields tracked: device type, model, OS, browser, language

## Authentication & Identity

**User Authentication:**
- Custom implementation with password hashing
- Database models: `User`, `UserPasswordHash`, `UserPreference`, `Acl`
- Session management via `Session` model with expiry

**Session Storage:**
- Database-backed sessions (SQLite/MySQL/PostgreSQL)
- Optional: Redis for session caching

## Monitoring & Observability

**Logging:**
- **Pino** - JSON logging framework
  - Package: `pino` 10.3.1
  - Config: Log level via `LOG_LEVEL` env var
  - Levels: trace, debug, info, warn, error, fatal

**Request Logging:**
- Fastify plugin integration for HTTP request logging

## CI/CD & Deployment

**Build System:**
- Next.js build pipeline
- Prisma code generation

**Development Commands:**
```bash
bun run dev          # Development server
bun run build        # Production build
bun run lint         # Code linting
bun test             # Run tests
bun run db:push      # Push schema to database
bun run db:generate  # Generate Prisma client
```

## Environment Configuration

**Required env vars:**
- `DATABASE_URL` - Database connection string

**Optional env vars:**
- `REDIS_URL` - Redis connection (caching)
- `NODE_ENV` - Environment (development/production/testing)
- `PORT` - Server port
- `SECRET_KEY` - Application secret
- `LOG_LEVEL` - Logging level

**Configuration Sources:**
- Environment variables parsed via Zod schemas
- Config modules: `src/config/app.ts`, `src/config/database.ts`, `src/config/redis.ts`

## Webhooks & Callbacks

**Outgoing Webhooks:**
- Traffic source postbacks - Conversion notifications to affiliate networks
- Affiliate network postbacks - Conversion data forwarding

**Incoming Endpoints:**
- `GET /click` - Main click tracking endpoint
- `POST /click` - Alternative click submission
- `POST /postback` - Conversion callback endpoint

**API Routes:**
- `src/app/api/test-click/route.ts` - Test click processing
- `src/app/click/route.ts` - Click handler

## External Data Sources

**MaxMind GeoIP Database:**
- Optional offline GeoIP database
- Used for IP-based geolocation when available

**Traffic Source Templates:**
- Pre-defined parameter templates stored in database
- Configurable via `TrafficSource.templateName` field

---

*Integration audit: 2026-03-28*
