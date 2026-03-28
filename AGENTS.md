# Agent Guidelines

This document defines how AI agents should work on this codebase.

## Project Overview

Keitaro TSL - A TypeScript port of the Keitaro ad-tracking system from PHP.

## Blast Radius Check

Before making changes, assess the blast radius:

- **Tiny change** (single file, isolated fix): Discuss briefly, then build
- **Medium change** (multiple files, new feature): Write a short plan in `docs/feature-name.md` before coding
- **Large/risky change** (architecture, core systems): Write a milestone plan before coding

## Code Style

- TypeScript throughout with strict typing
- ES6+ import/export syntax (no `.js` extensions in imports)
- Use existing components and hooks when possible
- shadcn/ui components preferred over custom implementations
- Use 'use client' and 'use server' for client and server side code

## After Every Feature

1. Add or update tests
2. Update docs
3. Run validation:
   ```bash
   bun run lint      # Check code quality
   bun test --run    # Run test suite
   bun run build     # Build the project
   ```
4. Give a plain-English validation report

## Key Directories

- `src/traffic/` - Core traffic processing (pipeline, filters, actions)
- `src/core/` - Base infrastructure (models, repositories, pipeline)
- `keitaro_source/` - Original PHP source code (reference only)
- `tests/` - Test files (unit tests)

## Pipeline Architecture

The click processing pipeline has 22 stages:

```
Request → CheckPrefetch → CheckParamAliases → DomainRedirect →
BuildRawClick → GenerateToken → FindCampaign → CheckDefaultCampaign →
CheckSendingToAnotherCampaign → BotHandling → ChooseStream →
[Uniqueness Stages] → ChooseLanding → ChooseOffer → FindAffiliateNetwork →
UpdateCosts → UpdatePayout → UpdateRawClick → UpdateHitLimit →
SetCookie → ExecuteAction → PrepareRawClickToStore → StoreRawClicks
```

## Test Coverage

- 981 total tests
- 27 filter classes (100% PHP coverage)
- Core pipeline stages tested

## Never

- Never pretend something passed if it was not actually run
- Never skip the validation step
- Never make large changes without a plan
