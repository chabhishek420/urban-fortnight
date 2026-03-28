# Fix Import Paths

## Problem

Imports use `.js` extensions which work for TypeScript but break Next.js webpack:
```typescript
import { Payload } from '../pipeline/payload.js';  // Broken
import { Payload } from '../pipeline/payload';      // Works
```

## Scope

- **Files affected**: All TypeScript files in `src/`
- **Import statements**: 396 total

## Plan

1. Remove `.js` extensions from all imports in `src/`
2. Keep `.js` extensions only in files that are actually JavaScript
3. Run tests to verify no regressions
4. Run build to verify Next.js compatibility

## Commands

```bash
# Find all imports with .js
grep -r "from '.*\.js'" src/ --files-with-matches

# Fix imports (macOS sed)
find src -name "*.ts" -exec sed -i '' "s/from '\(.*\)\.js'/from '\1'/g" {} \;

# Fix imports (Linux sed)
find src -name "*.ts" -exec sed -i "s/from '\(.*\)\.js'/from '\1'/g" {} \;
```

## Validation

1. `bun test --run` - All tests pass
2. `bun run build` - Build succeeds
3. Check for any broken imports manually
