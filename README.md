# Keitaro Ad-Tracker - TypeScript Translation

A TypeScript/Next.js implementation of the Keitaro ad-tracker, translated from PHP 7.4 source code.

## Quick Start

```bash
# Install dependencies
bun install

# Setup database
bun run db:push
bun run db:generate

# Run development server
bun run dev

# Run tests
bun test

# Lint code
bun run lint
```

## Architecture

```
Request → Router → Dispatcher → Pipeline → Stages → Response
                                    ↓
                            [BuildRawClick]
                            [FindCampaign]
                            [ChooseStream] ← Filter Evaluation
                            [ExecuteAction]
                            [StoreClick]
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/test-click/     # Test endpoint
│   ├── page.tsx            # Home page
│   └── status/             # Status page
├── core/                   # Framework abstractions
│   ├── pipeline/           # Stage interface
│   ├── repository/         # Repository pattern
│   ├── dispatcher/         # Dispatcher interface
│   └── model/              # Abstract model
├── traffic/                # Traffic processing domain
│   ├── actions/            # 18 action types
│   ├── pipeline/           # 23 pipeline stages
│   ├── filter/             # 27 filter implementations
│   ├── repository/         # Cached repositories
│   ├── model/              # Domain entities
│   ├── dispatcher/         # Request dispatchers
│   └── context/            # Request contexts
├── config/                 # Configuration
└── lib/                    # Utilities
```

## Key Components

### Pipeline Stages (23 total)
| Stage | Purpose |
|-------|---------|
| BuildRawClickStage | Extract IP, UA, referrer, keywords |
| FindCampaignStage | Locate campaign by domain/alias |
| BotHandlingStage | Route bot traffic |
| ChooseStreamStage | Select stream with filter evaluation |
| ExecuteActionStage | Execute redirect/action |
| StoreRawClicksStage | Persist to database |

### Filter Types (27 total)
- **Geo**: Country, Region, City, IP, ISP, Operator
- **Device**: DeviceType, OS, Browser, Language
- **Traffic**: Referrer, Parameter, Keyword, Source
- **Schedule**: Schedule, Interval, Limit
- **Quality**: Bot, Proxy, Uniqueness

### Action Types (18 total)
HTTP_REDIRECT, META, DOUBLE_META, JS, IFRAME, FRAME, SHOW_HTML, SHOW_TEXT, DO_NOTHING, STATUS_404, TO_CAMPAIGN, etc.

## API Endpoints

```
GET  /                        # Home page
GET  /status                  # System status
GET  /api/test-click          # Test click processing
    ?campaign=<alias>         # Campaign alias
```

## Test Endpoint Example

```bash
curl "http://localhost:3000/api/test-click?campaign=test-campaign"
```

Response:
```json
{
  "success": true,
  "campaign": { "id": 1, "name": "Test Campaign" },
  "stream": { "id": 1, "name": "Main Stream" },
  "action": "http_redirect",
  "redirectUrl": "https://offer.example.com/?subid=...",
  "response": {
    "status": 302,
    "headers": {
      "Location": ["https://offer.example.com/?subid=..."],
      "Set-Cookie": ["u_stream_1=..."]
    }
  }
}
```

## Configuration

Environment variables (`.env`):
```
DATABASE_URL="file:./db/custom.db"
```

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Database**: Prisma ORM + SQLite
- **Testing**: Vitest
- **Linting**: ESLint + next/core-web-vitals

## Development Commands

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run lint         # Run ESLint
bun test             # Run Vitest tests
bun run db:push      # Push schema to database
bun run db:generate  # Generate Prisma client
bun run db:studio    # Open Prisma Studio
```

## Status

| Component | Status |
|-----------|--------|
| Pipeline | ✅ Operational |
| Filters | ✅ 27/27 implemented |
| Actions | ✅ 18/18 implemented |
| Repositories | ✅ 12 implemented |
| Tests | ✅ 1154/1187 passing |

## Source Reference

Original PHP source located in `keitaro_source/` for reference:
- `application/Traffic/` - Core traffic processing
- `application/Component/StreamFilters/` - Filter implementations
- `application/Core/` - Framework core
