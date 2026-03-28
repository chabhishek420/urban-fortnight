# Codebase Structure

**Analysis Date:** 2026-03-28

## Directory Layout

```
keitaro-trsl/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── click/              # Click tracking route
│   │   ├── api/test-click/     # Test endpoint
│   │   ├── status/             # Status page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── core/                   # Framework abstractions
│   │   ├── application/        # Application singleton
│   │   ├── context/            # Context interface
│   │   ├── db/                 # Database utilities
│   │   ├── dispatcher/         # Dispatcher interface
│   │   ├── entity/             # Entity interfaces
│   │   ├── kernel/             # Application kernel
│   │   ├── model/              # Abstract models
│   │   ├── pipeline/           # Pipeline interface
│   │   ├── repository/         # Base repository
│   │   └── router/             # Traffic router
│   ├── traffic/                # Traffic processing domain
│   │   ├── actions/            # 18 action types
│   │   ├── context/            # 12 context implementations
│   │   ├── dispatcher/          # 10 dispatcher implementations
│   │   ├── filter/             # 27 filter implementations
│   │   ├── logging/            # Traffic logging
│   │   ├── model/              # Domain entities
│   │   ├── pipeline/           # Pipeline + 23 stages
│   │   ├── repository/         # Cached repositories
│   │   ├── request/            # ServerRequest
│   │   ├── response/           # Response builders
│   │   └── service/            # Business services
│   ├── config/                 # Configuration
│   ├── lib/                    # Utilities
│   ├── server/                 # Fastify server
│   └── index.ts                # Main exports
├── tests/                      # Test files
├── prisma/                     # Database schema
├── db/                         # SQLite database
├── keitaro_source/             # Original PHP reference
├── .next/                      # Next.js build output
├── package.json
├── tsconfig.json
└── README.md
```

## Directory Purposes

### src/app/
- **Purpose:** Next.js App Router endpoints
- **Contains:** Route handlers (click, api, status)
- **Key files:** `src/app/click/route.ts`, `src/app/api/test-click/route.ts`

### src/core/
- **Purpose:** Framework-agnostic abstractions
- **Contains:** Kernel, Context, Dispatcher, Repository, Pipeline interfaces
- **Key files:** `src/core/kernel/kernel.ts`, `src/core/application/application.ts`

### src/traffic/
- **Purpose:** Core ad-tracking domain logic
- **Contains:** All traffic processing: contexts, dispatchers, filters, actions, stages
- **Key files:** `src/traffic/context/click-context.ts`, `src/traffic/dispatcher/click-dispatcher.ts`

### src/traffic/context/
- **Purpose:** Request context implementations
- **Contains:** 12 context classes for different traffic types
- **Files:** `click-context.ts`, `postback-context.ts`, `ktrk-context.ts`, etc.

### src/traffic/dispatcher/
- **Purpose:** Request processing logic
- **Contains:** 10 dispatcher implementations
- **Files:** `click-dispatcher.ts`, `postback-dispatcher.ts`, etc.

### src/traffic/filter/
- **Purpose:** Stream filtering logic
- **Contains:** 27 filter implementations in categories
- **Files:** `geo-filters.ts`, `device-filters.ts`, `bot-filter.ts`, etc.

### src/traffic/actions/
- **Purpose:** Response action implementations
- **Contains:** 18 action types (redirects, iframes, etc.)
- **Files:** `http-redirect-action.ts`, `iframe-action.ts`, `meta-action.ts`, etc.

### src/traffic/pipeline/
- **Purpose:** Pipeline orchestration
- **Contains:** Pipeline orchestrator + stage factory
- **Key files:** `src/traffic/pipeline/pipeline.ts`, `src/traffic/pipeline/stages.ts`

### src/traffic/pipeline/stage/
- **Purpose:** Pipeline stage implementations
- **Contains:** 23 first-level + 18 second-level stages
- **Files:** `build-raw-click-stage.ts`, `find-campaign-stage.ts`, `choose-stream-stage.ts`, etc.

### src/traffic/repository/
- **Purpose:** Data access with caching
- **Contains:** Cached repositories for all entities
- **Files:** `campaign-repository.ts`, `offer-repository.ts`, `cached-campaign-repository.ts`, etc.

### src/traffic/model/
- **Purpose:** Domain entity definitions
- **Contains:** TypeScript classes for all domain objects
- **Files:** `campaign.ts`, `offer.ts`, `landing.ts`, `raw-click.ts`, etc.

### src/config/
- **Purpose:** Configuration management
- **Contains:** App, Database, Redis configs
- **Files:** `src/config/app.ts`, `src/config/database.ts`, `src/config/redis.ts`

### src/server/
- **Purpose:** Fastify server setup
- **Contains:** Server factory, routes, plugins
- **Files:** `src/server/app.ts`, `src/server/routes.ts`, `src/server/plugins.ts`

## Key File Locations

**Entry Points:**
- `src/app/click/route.ts` - Main click tracking HTTP endpoint
- `src/app/api/test-click/route.ts` - Test/debug endpoint
- `src/server/app.ts` - Fastify server factory

**Configuration:**
- `src/config/index.ts` - Config aggregation
- `src/config/app.ts` - App settings
- `src/config/database.ts` - Database config
- `src/config/redis.ts` - Redis config

**Core Logic:**
- `src/core/kernel/kernel.ts` - Request lifecycle kernel
- `src/core/application/application.ts` - Application singleton
- `src/core/router/traffic-router.ts` - Traffic routing

**Traffic Processing:**
- `src/traffic/context/click-context.ts` - Main click context
- `src/traffic/dispatcher/click-dispatcher.ts` - Main click dispatcher
- `src/traffic/pipeline/pipeline.ts` - Pipeline orchestrator
- `src/traffic/pipeline/stages.ts` - Stage factory

**Data Access:**
- `src/traffic/repository/campaign-repository.ts` - Campaign data access
- `src/traffic/repository/cached-campaign-repository.ts` - Cached campaigns

**Testing:**
- `tests/` - Test files (unit tests with Vitest)

## Naming Conventions

**Files:**
- PascalCase for classes: `ClickContext.ts`, `CampaignRepository.ts`
- kebab-case for general files: `traffic-log-entry.ts`
- Descriptive suffixes: `-interface.ts`, `-factory.ts`, `-service.ts`

**Directories:**
- Plural for collections: `actions/`, `filters/`, `models/`
- Singular for domain areas: `context/`, `dispatcher/`, `pipeline/`

**Classes:**
- PascalCase: `class ClickDispatcher`, `class Pipeline`
- Suffix patterns: `Context`, `Dispatcher`, `Repository`, `Service`, `Stage`, `Filter`, `Action`

**Functions:**
- camelCase: `createApp()`, `getFirstLevelStages()`
- Descriptive names: `findRealIp()`, `isLicenseExpired()`

**Interfaces:**
- PascalCase with `Interface` suffix: `ContextInterface`, `DispatcherInterface`
- Also exported without suffix in barrel files

**Types:**
- PascalCase: `ServerRequestOptions`, `PayloadOptions`
- Suffix patterns: `Value` for union types

## Where to Add New Code

**New Context (new traffic type):**
- Implementation: `src/traffic/context/new-context.ts`
- Dispatcher: `src/traffic/dispatcher/new-dispatcher.ts`
- Export from: `src/traffic/context/index.ts`
- Register in: `src/core/router/traffic-router.ts`

**New Filter:**
- Implementation: `src/traffic/filter/new-filter.ts`
- Extend: `AbstractFilter` class
- Export from: `src/traffic/filter/index.ts`

**New Action:**
- Implementation: `src/traffic/actions/new-action.ts`
- Extend: `AbstractAction` class
- Register in: `src/traffic/actions/action-factory.ts`

**New Pipeline Stage:**
- Implementation: `src/traffic/pipeline/stage/new-stage.ts`
- Implement: `StageInterface`
- Register in: `src/traffic/pipeline/stages.ts`

**New Repository:**
- Implementation: `src/traffic/repository/new-repository.ts`
- Extend: `BaseRepository` or `CachedRepository`
- Export from: `src/traffic/repository/index.ts`

**New Model:**
- Implementation: `src/traffic/model/new-model.ts`
- Location: Domain model directory
- Export from: `src/traffic/index.ts`

**New Configuration:**
- Add to: `src/config/new-config.ts`
- Export from: `src/config/index.ts`

## Special Directories

### keitaro_source/
- **Purpose:** Original PHP source code for reference
- **Contains:** PHP implementation of Keitaro tracker
- **Generated:** No (committed)
- **Committed:** Yes

### .next/
- **Purpose:** Next.js build output
- **Generated:** Yes (on build)
- **Committed:** Yes (in repo)

### db/
- **Purpose:** SQLite database files
- **Contains:** `custom.db`
- **Generated:** Yes (on migrate)
- **Committed:** Yes

### tests/
- **Purpose:** Unit tests
- **Contains:** Vitest test files
- **Generated:** No
- **Committed:** Yes

### prisma/
- **Purpose:** Database schema
- **Contains:** `schema.prisma`
- **Generated:** No (committed)
- **Committed:** Yes

---

*Structure analysis: 2026-03-28*
