# Coding Conventions

**Analysis Date:** 2026-03-28

## Naming Patterns

### Files

- **Classes:** `PascalCase.ts` (e.g., `FilterEngine.ts`, `CampaignRepository.ts`)
- **Interfaces:** `PascalCase.ts` with `-interface` suffix for base interfaces (e.g., `filter-interface.ts`)
- **Test files:** `*.test.ts` suffix (e.g., `filter-engine.test.ts`)
- **Index files:** `index.ts` for barrel exports

### Functions

- **Methods:** `camelCase` (e.g., `getKey()`, `isPass()`, `findByToken()`)
- **Utility functions:** `camelCase` (e.g., `checkFilters()`)
- **Private methods:** `_camelCase` with underscore prefix (e.g., `_registerFilter()`)

### Variables

- **Properties:** `camelCase` (e.g., `serverRequest`, `rawClick`)
- **Private fields:** `_camelCase` with underscore prefix (e.g., `_serverRequest`, `_filterRegistry`)
- **Constants:** `UPPER_SNAKE_CASE` for enum values (e.g., `FilterGroup.GEO`)

### Types

- **Interfaces:** `PascalCase` (e.g., `FilterInterface`, `CampaignFindOptions`)
- **Type aliases:** `PascalCase` (e.g., `FilterGroupValue`)
- **Enums:** `PascalCase` with `PascalCase` members (e.g., `ActionType.REDIRECT`)

## Code Style

### TypeScript Configuration

Strict mode is enforced via `tsconfig.json`:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true
}
```

### Formatting

- **Tool:** ESLint with `next/core-web-vitals` config
- **Run:** `bun run lint`

### Import Organization

**Order:**
1. Type imports (using `import type`)
2. External library imports
3. Internal module imports (using path aliases)
4. Relative imports

**Path Aliases:**
```json
{
  "@core/*": "src/core/*",
  "@traffic/*": "src/traffic/*",
  "@/*": "src/*"
}
```

**Example:**
```typescript
import type { StreamFilter } from '../model/stream-filter';
import type { AbstractFilter } from './filter-interface';
import { FilterEngine, checkFilters } from './filter-engine';
```

### Class Structure

**Properties:**
- Use `_camelCase` for private fields
- Use `protected` for fields accessed by subclasses
- Initialize in constructor or at declaration

**Methods:**
- Return types always explicit
- Use arrow functions for callbacks
- Getters use `get` prefix (e.g., `getKey()`)

**Example from `src/traffic/filter/filter-engine.ts`:**
```typescript
export class FilterEngine {
  private _serverRequest: ServerRequest;
  private _stream: BaseStream;
  private _rawClick: RawClick;
  private _logger: { add(message: string): void };
  private _filterRegistry: Map<string, AbstractFilter> = new Map();

  constructor(options: FilterEngineOptions) {
    this._serverRequest = options.serverRequest;
    this._stream = options.stream;
    this._rawClick = options.rawClick;
    this._logger = options.logger ?? { add: () => {} };
  }

  public isPass(filters: StreamFilter[]): boolean {
    // implementation
  }
}
```

## Error Handling

### Exceptions

Custom exceptions extend `Error` with stage context:

```typescript
export class StageException extends Error {
  constructor(message: string, public readonly stageName?: string) {
    super(message);
    this.name = 'StageException';
  }
}

export class CampaignNotFoundException extends StageException {
  constructor(message: string = 'Campaign not found') {
    super(message, 'FindCampaignStage');
    this.name = 'CampaignNotFoundException';
  }
}
```

### Guard Clauses

Use early returns for validation:

```typescript
public isPass(filters: StreamFilter[]): boolean {
  if (filters.length === 0) {
    this._logger.add('Stream contains no filters. Passed.');
    return true;
  }
  // main logic
}
```

### Null Checks

Use optional chaining and nullish coalescing:

```typescript
const payload = filterData.getPayload() as Record<string, unknown> | null;
const msg = payload?.name
  ? `Accepts by filter "${filterData.getName()}" by parameter name: "${payload.name}"`
  : `Accepts by filter "${filterData.getName()}". Passed.`;
```

## Logging

### Pattern

Use injected logger interface:

```typescript
interface Logger {
  add(message: string): void;
}

// Usage in FilterEngine
private _logger: { add(message: string): void };

protected log(message: string): void {
  if (this._logger) {
    this._logger.add(message);
  }
}
```

### Convention

- Stage logs include stage name: `[${this.name}] ${message}`
- Filter logs include filter name: `Blocks by filter "${filterData.getName()}"`
- Use descriptive messages for debugging

## Comments

### JSDoc

All public classes and methods should have JSDoc:

```typescript
/**
 * Filter Engine class
 */
export class FilterEngine {
  /**
   * Check if all filters pass
   */
  public isPass(filters: StreamFilter[]): boolean {
    // implementation
  }
}
```

### Inline Comments

Use for:
- Non-obvious logic
- Workarounds referencing source PHP code
- TODO markers for incomplete features

```typescript
// TODO: Implement macro processing for offer macros
// See keitaro_source/application/Traffic/Actions/AbstractAction.php
```

## Function Design

### Size

- Keep functions under 50 lines
- Extract complex logic to private methods
- Use composition for reusable behavior

### Parameters

- Use options objects for 3+ parameters
- Type all parameters explicitly
- Avoid `any` type

```typescript
// Good
export interface FilterEngineOptions {
  serverRequest: ServerRequest;
  stream: BaseStream;
  rawClick: RawClick;
  logger?: { add(message: string): void };
}

// Constructor
constructor(options: FilterEngineOptions) {
  this._serverRequest = options.serverRequest;
}
```

### Return Values

- Always specify return types
- Use `Promise<T>` for async methods
- Use union types for conditional returns

```typescript
async findByToken(token: string): Promise<Campaign | null> {
  return this.findFirst({ where: { token } });
}
```

## Module Design

### Exports

- Named exports for all public APIs
- Barrel files (`index.ts`) for convenient imports

**Example `src/traffic/filter/index.ts`:**
```typescript
export { FilterEngine, checkFilters } from './filter-engine';
export { AbstractFilter, FilterGroup, FilterGroupValue } from './filter-interface';
export type { FilterInterface } from './filter-interface';
```

### Interface Segregation

- Define interfaces close to their usage
- Export interfaces for external implementation
- Use composition over inheritance where possible

## Database Patterns

### Repository Pattern

Repositories extend `BaseRepository<T>`:

```typescript
export class CampaignRepository extends BaseRepository<Campaign> {
  getDefinition(): RepositoryEntityDefinition {
    return {
      tableName: 'campaigns',
      entityName: 'campaign',
      fields: new Map([
        ['id', { name: 'id', type: 'number', readonly: true }],
        ['name', { name: 'name', type: 'string' }],
        // ...
      ]),
      modelClass: Campaign
    };
  }

  async findByToken(token: string): Promise<Campaign | null> {
    return this.findFirst({ where: { token } });
  }
}
```

### Entity Models

Use getter/setter pattern:

```typescript
export class Campaign extends EntityModel {
  getName(): string | null { /* ... */ }
  setName(name: string): void { /* ... */ }
}
```

---

*Convention analysis: 2026-03-28*
