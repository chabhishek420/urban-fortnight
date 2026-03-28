# Testing Patterns

**Analysis Date:** 2026-03-28

## Test Framework

**Runner:**
- **Framework:** Vitest v1.1.3
- **Config:** `vitest.config.ts`
- **Globals:** Enabled (describe, it, expect, beforeEach, vi available globally)

**Run Commands:**
```bash
bun test              # Run all tests
bun test --run       # Run once (non-watch mode)
bun test --coverage  # Run with coverage
```

## Test File Organization

**Location:**
- Tests co-located in `tests/` directory at project root
- Mirrors `src/` structure: `tests/unit/<domain>/<file>.test.ts`

**Naming:**
- Pattern: `*.test.ts` (e.g., `filter-engine.test.ts`, `campaign-repository.test.ts`)
- Alternative: `*.spec.ts` also supported

**Structure:**
```
tests/
└── unit/
    ├── filters/
    │   ├── filter-engine.test.ts
    │   ├── filter-interface.test.ts
    │   ├── geo-filters.test.ts
    │   └── ...
    ├── stages/
    │   ├── build-raw-click-stage.test.ts
    │   └── ...
    ├── repository/
    │   ├── campaign-repository.test.ts
    │   └── ...
    ├── actions/
    │   ├── http-redirect-action.test.ts
    │   └── ...
    └── ...
```

## Test Structure

### Suite Organization

Use `describe` blocks to group related tests:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { FilterEngine, checkFilters } from '../../src/traffic/filter/filter-engine';

describe('FilterEngine', () => {
  let engine: FilterEngine;
  let rawClick: RawClick;
  let logger: { add: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    rawClick = new RawClick({ sub_id: 'test' });
    logger = { add: vi.fn() };
    
    engine = new FilterEngine({
      serverRequest: createMockServerRequest(),
      stream: createMockStream(),
      rawClick,
      logger
    });
  });

  describe('registerFilter', () => {
    it('should register filter implementations', () => {
      const filter = new PassingFilter();
      engine.registerFilter('test_filter', filter);
      
      expect(engine.getFilter('test_filter')).toBe(filter);
    });
  });

  describe('isPass', () => {
    it('should pass when no filters', () => {
      const result = engine.isPass([]);
      expect(result).toBe(true);
    });
  });
});
```

### Setup Pattern

- Use `beforeEach` for per-test setup
- Create fresh instances for each test
- Initialize mocks in setup

```typescript
beforeEach(() => {
  filter = new TestFilter();
});
```

### Assertion Pattern

Use Vitest/Jest expect API:

```typescript
// Basic equality
expect(filter.getKey()).toBe('test_filter');

// Truthiness
expect(result).toBe(true);
expect(engine.getFilter('unknown')).toBeUndefined();

// Array operations
expect(messages).toContain('test message');

// Type checks
expect(typeof repository.findByToken).toBe('function');

// Object properties
expect(definition.tableName).toBe('campaigns');
expect(definition.fields.get('id')?.readonly).toBe(true);
```

## Mocking

### Vitest Mocks

Use `vi.fn()` for function mocks:

```typescript
import { vi } from 'vitest';

let logger: { add: ReturnType<typeof vi.fn> };

beforeEach(() => {
  logger = { add: vi.fn() };
});

// Usage
expect(logger.add).toHaveBeenCalled();
```

### Creating Mock Implementations

For interfaces, create concrete test implementations:

```typescript
// Mock filter that always passes
class PassingFilter implements AbstractFilter {
  private _key: string;
  
  constructor(key: string = 'passing_filter') {
    this._key = key;
  }
  
  getKey(): string { return this._key; }
  getGroup(): string { return 'test'; }
  isPass(_filter: StreamFilter, _rawClick: RawClick): boolean { return true; }
  setServerRequest(): void {}
  setLogger(): void {}
}

// Mock filter that always blocks
class BlockingFilter implements AbstractFilter {
  getKey(): string { return 'blocking_filter'; }
  getGroup(): string { return 'test'; }
  isPass(): boolean { return false; }
  setServerRequest(): void {}
  setLogger(): void {}
}
```

### Mock Data Factories

Create helper functions for consistent test data:

```typescript
// Mock stream filter data
function createMockStreamFilter(name: string, payload: any = {}): StreamFilter {
  return {
    getName: () => name,
    getPayload: () => payload,
    getMode: () => 'accept'
  } as StreamFilter;
}

// Mock stream
function createMockStream(isFilterOr: boolean = false) {
  return {
    getId: () => 1,
    getName: () => 'Test Stream',
    isFilterOr: () => isFilterOr
  } as any;
}

// Mock server request
function createMockServerRequest() {
  return {
    getIp: () => '127.0.0.1',
    getUserAgent: () => 'Test',
    getUri: () => new URL('http://test.local/')
  } as any;
}
```

### Type Casting

Use `as any` for partial mocks:

```typescript
const mockRequest = { getIp: () => '127.0.0.1' } as unknown as ServerRequest;

// Or for simpler cases
stream = {
  getId: () => 1,
  isFilterOr: () => false
} as any;
```

## Fixtures and Test Data

### Entity Creation

Use class constructors for domain entities:

```typescript
// Raw click with sub_id
const rawClick = new RawClick({ sub_id: 'test' });

// Empty raw click
const rawClick = new RawClick();
```

### Options Objects

Pass configuration via options objects:

```typescript
engine = new FilterEngine({
  serverRequest: createMockServerRequest(),
  stream: createMockStream(),
  rawClick,
  logger
});
```

## Coverage

**Requirements:** 
- Not explicitly enforced in vitest config
- Coverage reporting available

**View Coverage:**
```bash
bun test --coverage
```

**Configuration** (from `vitest.config.ts`):
```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  include: ['src/**/*.ts'],
  exclude: [
    'src/app/**',
    'src/**/*.d.ts',
    'src/**/index.ts',
    'src/config/**',
    'src/test/**'
  ]
}
```

**Excluded from coverage:**
- App Router pages (`src/app/**`)
- Type definitions (`src/**/*.d.ts`)
- Barrel exports (`src/**/index.ts`)
- Configuration (`src/config/**`)
- Test utilities (`src/test/**`)

## Test Types

### Unit Tests

- Test individual classes and functions in isolation
- Use mocks for dependencies
- Focus on single responsibility

**Example:** Testing `AbstractFilter`:
```typescript
describe('AbstractFilter', () => {
  let filter: TestFilter;

  beforeEach(() => {
    filter = new TestFilter();
  });

  describe('getKey', () => {
    it('should return filter key', () => {
      expect(filter.getKey()).toBe('test_filter');
    });
  });

  describe('setLogger', () => {
    it('should store logger', () => {
      const logger = { add: (_msg: string) => {} };
      filter.setLogger(logger);
      expect(filter).toBeDefined();
    });
  });
});
```

### Integration Tests

- Test multiple components together
- Use real implementations where appropriate
- Test repository definitions, query methods

**Example:** Testing repository definition:
```typescript
describe('CampaignRepository', () => {
  describe('getDefinition', () => {
    it('should return correct table name', () => {
      const definition = repository.getDefinition();
      expect(definition.tableName).toBe('campaigns');
    });

    it('should have id field defined', () => {
      const definition = repository.getDefinition();
      expect(definition.fields.has('id')).toBe(true);
      expect(definition.fields.get('id')?.type).toBe('number');
      expect(definition.fields.get('id')?.readonly).toBe(true);
    });
  });
});
```

### No E2E Tests

- E2E tests not detected in this codebase
- API testing done via test-click endpoint (`/api/test-click`)

## Common Patterns

### Testing Async Functions

For async repository methods:

```typescript
// Repository methods return Promise<T | null>
async findByToken(token: string): Promise<Campaign | null> {
  return this.findFirst({ where: { token } });
}

// Test verifies method exists and signature
it('should have findByToken method', () => {
  expect(typeof repository.findByToken).toBe('function');
});
```

### Testing Error Conditions

Use try-catch with `rejects` or test guard clauses:

```typescript
// For methods that throw
it('should throw when payload not set', () => {
  expect(() => {
    action.getPayload();
  }).toThrow('Payload not set');
});
```

### Testing Enums

Verify enum values and types:

```typescript
describe('FilterGroup', () => {
  it('should have GEO group', () => {
    expect(FilterGroup.GEO).toBe('filters.groups.geo');
  });

  it('should be usable as type', () => {
    const group: FilterGroupValue = FilterGroup.GEO;
    expect(group).toBe('filters.groups.geo');
  });
});
```

### Testing Optional Properties

Test both present and absent cases:

```typescript
// Logger optional - should work with default
engine = new FilterEngine({
  serverRequest,
  stream,
  rawClick
  // logger omitted - uses default
});
```

## Test Timeouts

**Configuration:**
```typescript
testTimeout: 30000,    // 30 seconds per test
hookTimeout: 10000     // 10 seconds for setup/teardown
```

---

*Testing analysis: 2026-03-28*
