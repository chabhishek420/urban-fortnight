# Architecture

**Analysis Date:** 2026-03-28

## Pattern Overview

**Overall:** Request-Context-Dispatcher-Pipeline-Stage Pattern

**Key Characteristics:**
- **Kernel-driven request lifecycle**: Bootstrap → Modify → Dispatch → Shutdown
- **Context-based request handling**: Different URL patterns map to different contexts
- **Pipeline-based processing**: Sequential stages transform click data
- **Repository pattern for data access**: Cached repositories for campaigns, offers, landings, streams
- **Strategy pattern for filters/actions**: Pluggable filter and action implementations

## Layers

### HTTP Layer (Next.js/Fastify)
- **Purpose:** Handle incoming HTTP requests and route to appropriate handlers
- **Location:** `src/app/click/route.ts`, `src/server/app.ts`
- **Contains:** Next.js route handlers, Fastify server setup
- **Depends on:** Traffic Router
- **Used by:** External HTTP clients

### Router Layer
- **Purpose:** Match incoming requests to appropriate contexts based on URL patterns
- **Location:** `src/core/router/traffic-router.ts`
- **Contains:** `TrafficRouter` class with pattern-based routing
- **Depends on:** Context implementations
- **Used by:** HTTP layer

### Context Layer
- **Purpose:** Define request processing strategy for different traffic types
- **Location:** `src/traffic/context/*.ts`
- **Contains:** 12 context implementations (ClickContext, PostbackContext, etc.)
- **Depends on:** Dispatcher interfaces
- **Used by:** Router layer

**Key Contexts:**
- `ClickContext` - Main click processing
- `ClickApiContext` - API-based click tracking
- `PostbackContext` - Postback handling
- `KtrkContext` - JSONP tracking
- `KClientJSContext` - JavaScript client tracking

### Dispatcher Layer
- **Purpose:** Execute actual request processing logic
- **Location:** `src/traffic/dispatcher/*.ts`
- **Contains:** 10 dispatcher implementations
- **Depends on:** Pipeline, StageInterface
- **Used by:** Context layer

**Key Dispatchers:**
- `ClickDispatcher` - Main click processing via pipeline

### Pipeline Layer
- **Purpose:** Orchestrate sequential stage execution
- **Location:** `src/traffic/pipeline/pipeline.ts`, `src/traffic/pipeline/stages.ts`
- **Contains:** Pipeline orchestrator, stage factory
- **Depends on:** StageInterface implementations
- **Used by:** Dispatcher layer

### Stage Layer
- **Purpose:** Implement specific processing steps
- **Location:** `src/traffic/pipeline/stage/*.ts`
- **Contains:** 23 first-level stages, 18 second-level stages
- **Depends on:** Models, Repositories, Services
- **Used by:** Pipeline layer

### Repository Layer
- **Purpose:** Data access with caching
- **Location:** `src/traffic/repository/*.ts`, `src/core/repository/*.ts`
- **Contains:** Cached repositories for all domain entities
- **Depends on:** Prisma client, Redis
- **Used by:** Stage layer

### Model Layer
- **Purpose:** Domain entity definitions
- **Location:** `src/traffic/model/*.ts`, `src/core/model/*.ts`
- **Contains:** Campaign, Offer, Landing, Stream, RawClick, etc.
- **Depends on:** None (pure data structures)
- **Used by:** All layers

### Service Layer
- **Purpose:** Business logic operations
- **Location:** `src/traffic/service/*.ts`
- **Contains:** RawClickService, VisitorService, UrlService, ConfigService
- **Depends on:** Repositories, Models
- **Used by:** Stage layer

### Filter Layer
- **Purpose:** Traffic filtering and qualification
- **Location:** `src/traffic/filter/*.ts`
- **Contains:** 27 filter implementations (geo, device, traffic, schedule, quality)
- **Depends on:** StreamFilter model, RawClick
- **Used by:** ChooseStreamStage

### Action Layer
- **Purpose:** Execute final response actions
- **Location:** `src/traffic/actions/*.ts`
- **Contains:** 18 action types (redirect, iframe, meta, etc.)
- **Depends on:** Response, ActionPayload
- **Used by:** ExecuteActionStage

### Kernel Layer (Core)
- **Purpose:** Application lifecycle management
- **Location:** `src/core/kernel/kernel.ts`
- **Contains:** Kernel class with hooks for lifecycle events
- **Depends on:** Context, Dispatcher
- **Used by:** Application layer

### Application Layer (Core)
- **Purpose:** Singleton application state and configuration
- **Location:** `src/core/application/application.ts`
- **Contains:** Application singleton, service container, event system
- **Depends on:** Config
- **Used by:** Server initialization

### Config Layer
- **Purpose:** Configuration management
- **Location:** `src/config/*.ts`
- **Contains:** App, Database, Redis configuration
- **Depends on:** Environment variables
- **Used by:** All layers

## Data Flow

**Main Click Flow:**

1. **HTTP Request** → `src/app/click/route.ts`
   - Next.js receives request
   - Creates `ServerRequest` from NextRequest

2. **Routing** → `TrafficRouter.match()`
   - Matches URL pattern to appropriate context
   - Returns context + modified request

3. **Context Bootstrap** → `Context.bootstrap()`
   - Initializes logging, tracking
   - Returns dispatcher

4. **Request Modification** → `Context.modifyRequest()`
   - Resolves real IP address
   - Normalizes request data

5. **Dispatcher Execution** → `Dispatcher.dispatch()`
   - Creates pipeline payload
   - Runs pipeline stages

6. **Pipeline Processing** → `Pipeline.process()`
   - Executes 23 sequential stages
   - Each stage transforms payload
   - Stages can abort for campaign forwarding

7. **Action Execution** → `ExecuteActionStage`
   - Executes redirect/iframe/meta/etc.
   - Returns final HTTP response

8. **Storage** → `StoreRawClicksStage`
   - Persists click to database

9. **Response** → Next.js `NextResponse`
   - Returns to client

## Key Abstractions

### ServerRequest
- Purpose: Normalized HTTP request representation
- Examples: `src/traffic/request/server-request.ts`
- Pattern: Value object wrapping HTTP details

### Response
- Purpose: Normalized HTTP response
- Examples: `src/traffic/response/response.ts`
- Pattern: Builder pattern for constructing responses

### Payload
- Purpose: Carries state through pipeline stages
- Examples: `src/traffic/pipeline/payload.ts`
- Pattern: Context object accumulating processing results

### StageInterface
- Purpose: Pipeline stage contract
- Examples: `src/core/pipeline/stage-interface.ts`
- Pattern: Strategy interface with `process()` method

### FilterInterface
- Purpose: Traffic filter contract
- Examples: `src/traffic/filter/filter-interface.ts`
- Pattern: Strategy interface with `isPass()` method

### ActionInterface
- Purpose: Response action contract
- Examples: `src/traffic/actions/abstract-action.ts`
- Pattern: Strategy interface with `execute()` method

### RepositoryInterface
- Purpose: Data access contract
- Examples: `src/core/repository/repository-interface.ts`
- Pattern: Repository pattern with caching

## Entry Points

### HTTP Entry Point
- Location: `src/app/click/route.ts`
- Triggers: Any HTTP GET/POST to `/click/*`
- Responsibilities: Request normalization, routing, response building

### API Test Entry Point
- Location: `src/app/api/test-click/route.ts`
- Triggers: GET/POST to `/api/test-click`
- Responsibilities: Test click processing, return debug info

### Server Entry Point
- Location: `src/server/app.ts`
- Triggers: Application startup
- Responsibilities: Fastify setup, route registration, plugin loading

### Kernel Entry Point
- Location: `src/core/kernel/kernel.ts`
- Triggers: Every request via context
- Responsibilities: Lifecycle management (bootstrap → modify → dispatch → shutdown)

## Error Handling

**Strategy:** Layered error handling with context-specific responses

**Patterns:**
- `StageException` - Pipeline stage failures (in `src/core/pipeline/stage-interface.ts`)
- `PipelineException` - Pipeline orchestration failures (in `src/traffic/pipeline/pipeline.ts`)
- `CampaignNotFoundException` - Campaign lookup failures
- `SendToCampaignException` - Campaign forwarding triggers

**Error Flow:**
1. Stage throws exception → Pipeline catches → Aborts or continues
2. Kernel catches all errors → Calls context.handleException() → Returns error response
3. Fastify error handler → Logs error → Returns JSON error response

## Cross-Cutting Concerns

**Logging:** Pino logger via Fastify (`src/server/app.ts`)

**Validation:** Zod for request validation (in `package.json`)

**Authentication:** Not implemented in core (license check placeholder in `ClickDispatcher`)

**Caching:** Redis-backed repositories (`src/traffic/repository/cached-*.ts`)

**Database:** Prisma ORM with SQLite (`src/lib/db.ts`, `src/config/database.ts`)

---

*Architecture analysis: 2026-03-28*
