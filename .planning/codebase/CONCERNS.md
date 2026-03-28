# Codebase Concerns

**Analysis Date:** 2026-03-28

## Tech Debt

### Incomplete Pipeline Stages

**Issue:** Multiple pipeline stages have repository integration TODOs, meaning they won't function correctly in production.

**Files:**
- `src/traffic/pipeline/stage/find-campaign-stage.ts` - Domain repository not integrated
- `src/traffic/pipeline/stage/domain-redirect-stage.ts` - Domain repository not integrated
- `src/traffic/pipeline/stage/find-affiliate-network-stage.ts` - Affiliate network repository not implemented
- `src/traffic/pipeline/stage/choose-offer-stage.ts` - Stream offer association, offer repository not integrated
- `src/traffic/pipeline/stage/choose-landing-stage.ts` - Stream landing/offer association repos not integrated
- `src/traffic/pipeline/stage/choose-stream-stage.ts` - Entity binding service not implemented
- `src/traffic/pipeline/stage/generate-token-stage.ts` - Stream offer repository not integrated
- `src/traffic/pipeline/stage/update-hit-limit-stage.ts` - Hit limit service not implemented, stream filter repository not integrated
- `src/traffic/pipeline/stage/check-default-campaign-stage.ts` - Campaign repository not fully integrated

**Impact:** These stages will return null/default values, causing incorrect campaign routing, stream selection, and offer/landing assignment.

**Fix approach:** Implement the missing repository methods and services. Most require creating new repository methods in `src/traffic/repository/`.

### Incomplete API Routes

**Issue:** Server routes return empty stubs for most CRUD and tracking operations.

**Files:**
- `src/server/routes.ts` - 12+ TODO markers for unimplemented routes

**Impact:** No admin panel functionality, no campaign management, no conversion tracking.

**Fix approach:** Implement route handlers using existing repositories and services.

### In-Memory Stubs in Production Code

**Issue:** `src/traffic/actions/remote-action.ts` contains in-memory stubs (`Map<string, string>`) for testing that persist across requests.

**Files:**
- `src/traffic/actions/remote-action.ts` (lines 17-18, 116-118, 187-190)

**Impact:** Memory leak potential, test code in production, inconsistent behavior.

**Fix approach:** Extract stubs to a test helper or use proper dependency injection with mock services.

---

## Known Bugs

### Test Failures - 12 Tests Failing

**1. ChooseStreamStage Tests - Database Not Initialized**

**Symptoms:** `TypeError: undefined is not an object (evaluating 'getDb().streamFilter.findMany')`

**Files:**
- `src/traffic/repository/stream-filter-repository.ts`
- `tests/unit/stages/choose-stream-stage.test.ts`

**Trigger:** Running choose-stream-stage tests

**Workaround:** Tests need proper database mocking or test database setup

---

**2. ClickDispatcher Test - Missing Method**

**Symptoms:** `TypeError: request.getClientIp is not a function`

**Files:**
- `src/traffic/pipeline/stage/build-raw-click-stage.ts` (line 103)
- `tests/unit/dispatcher/click-dispatcher.test.ts`

**Trigger:** Running click-dispatcher integration test

**Workaround:** Add mock for `getClientIp()` on ServerRequest mock

---

## Security Considerations

### Weak Default Secret Key

**Risk:** Default secret key in config is hardcoded and weak.

**Files:**
- `src/config/app.ts` (line 67)

**Current mitigation:** None - uses default fallback

**Recommendations:**
- Remove default fallback, require explicit SECRET_KEY env var
- Add validation to reject short keys (<32 chars)
- Add warning in logs if using default key

---

### Unauthenticated Admin Routes

**Risk:** Admin routes (`/admin/*`) have no authentication checks.

**Files:**
- `src/server/routes.ts` (lines 123-168)

**Current mitigation:** None

**Recommendations:**
- Implement session-based authentication
- Add auth middleware to admin routes
- Protect sensitive operations (campaign delete, settings change)

---

### Password Handling

**Risk:** Database schema stores password hashes separately but login implementation is placeholder.

**Files:**
- `prisma/schema.prisma` (UserPasswordHash model)
- `src/server/routes.ts` (login endpoint)

**Current mitigation:** Login is not implemented

**Recommendations:**
- Implement proper password hashing (bcrypt/argon2)
- Add password validation
- Implement session management

---

## Performance Bottlenecks

### No Query Optimization for Large Datasets

**Problem:** Repositories use basic Prisma queries without pagination or optimization.

**Files:**
- `src/traffic/repository/*.ts`

**Cause:** No caching beyond basic in-memory cache, no query optimization

**Improvement path:**
- Add connection pooling configuration
- Implement query result pagination
- Add database indexes for common query patterns

---

### Filter Evaluation Performance

**Problem:** Stream filters are evaluated sequentially for each request.

**Files:**
- `src/traffic/filter/check-filters.ts`

**Cause:** No parallelization, no early-exit optimization

**Improvement path:**
- Implement short-circuit evaluation
- Cache filter results per stream

---

## Fragile Areas

### Repository Caching

**Files:** `src/traffic/repository/cached-*-repository.ts`

**Why fragile:** Cache invalidation is simple (TTL-based), could serve stale data. No cache warming on startup.

**Safe modification:** Add cache invalidation on write operations

**Test coverage:** Basic cache tests exist but edge cases untested

---

### Pipeline Stage Ordering

**Files:** `src/traffic/pipeline/pipeline.ts`

**Why fragile:** Stage execution order is critical. If earlier stages fail or return null, later stages may receive invalid data.

**Safe modification:** Never reorder stages without full integration testing

**Test coverage:** Unit tests exist but don't cover all stage interaction scenarios

---

## Scaling Limits

### SQLite Database

**Current capacity:** Single-node, file-based database

**Limit:** Poor concurrent write performance, file locking issues under high load

**Scaling path:** Migrate to PostgreSQL for production use, implement read replicas

---

### In-Memory Caching

**Current capacity:** Limited by single-node RAM

**Limit:** No distributed caching (Redis not integrated despite ioredis dependency)

**Scaling path:** Implement Redis caching layer using existing ioredis dependency

---

## Dependencies at Risk

### ip2location-nodejs

**Risk:** Package not actively maintained (last update 2023)

**Impact:** Geo-filters relying on IP lookup may become inaccurate

**Migration plan:** Consider alternative geo-IP services (MaxMind GeoIP2, ipapi)

---

### device-detector-js

**Risk:** Heavy dependency for user-agent parsing

**Impact:** Slows down request processing

**Migration plan:** Consider lighter alternatives or caching parsed results

---

## Missing Critical Features

### Campaign Management API

**Problem:** No working endpoints to create/update/delete campaigns

**Blocks:** Full admin panel functionality

---

### Conversion Tracking

**Problem:** No working conversion postback endpoint

**Blocks:** Revenue tracking, affiliate network integration

---

### Token/Click Lookup

**Problem:** Gateway redirect relies on incomplete token handling

**Blocks:** Tracking returning visitors, attribution

---

## Test Coverage Gaps

### Untested Pipeline Stages

**What's not tested:**
- DomainRedirectStage
- FindAffiliateNetworkStage  
- UpdateCampaignUniquenessSessionStage
- SaveUniquenessSessionStage

**Files:** `src/traffic/pipeline/stage/*.ts`

**Risk:** Bugs in these stages won't be caught until production

**Priority:** High

---

### Untested Dispatchers

**What's not tested:**
- GatewayRedirectDispatcher
- RobotsDispatcher
- KtrkDispatcher

**Files:** `src/traffic/dispatcher/*.ts`

**Risk:** Alternative entry points untested

**Priority:** Medium

---

### Integration Tests

**What's not tested:**
- End-to-end click flow
- Database transactions
- Error recovery

**Risk:** Components work in isolation but fail when integrated

**Priority:** High

---

*Concerns audit: 2026-03-28*
