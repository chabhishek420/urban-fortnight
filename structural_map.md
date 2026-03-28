# Keitaro Ad-Tracker Structural Map

## Document Version: 1.0
## Source Version: 9.13.9
## Total Files: 3,119 PHP files

---

## 1. Entry Points

### 1.1 HTTP Entry Points

| File | Context | Purpose |
|------|---------|---------|
| `index.php` | TrafficRouter | Main traffic router - routes to appropriate context |
| `api.php` | ClickApiContext | Click API endpoint |
| `gateway.php` | GatewayRedirectContext | Gateway redirect handling |
| `server.php` | TrafficRouter | RoadRunner server entry |

### 1.2 CLI Entry Points

| File | Context | Purpose |
|------|---------|---------|
| `cron.php` | CronContext | Scheduled task execution |
| `bin/*` | CLI | Console commands |

---

## 2. Core Framework (application/Core/)

### 2.1 Kernel System

| File | Public Interface | Dependencies |
|------|-----------------|--------------|
| `Kernel/Kernel.php` | `run(ServerRequest, Context): Response` | Context, ServerRequest, Db |
| `Router/TrafficRouter.php` | `match(ServerRequest): TrafficRouterResult` | ServerRequest |
| `Router/TrafficRouterResult.php` | `serverRequest(), context()` | ServerRequest, Context |
| `Context/ContextInterface.php` | `bootstrap(), modifyRequest(), dispatcher(), shutdown(), handleException()` | ServerRequest |

### 2.2 Entity System

| File | Public Interface | Dependencies |
|------|-----------------|--------------|
| `Entity/Model/EntityModelInterface.php` | `get(), set(), getData(), getId()` | - |
| `Entity/Repository/EntityRepository.php` | `find(), findAll(), create(), update(), delete()` | Db |
| `Entity/Service/EntityService.php` | `create(), update(), delete()` | Repository |
| `Entity/Definition/EntityDefinition.php` | `fields(), tableName(), cacheKey()` | - |
| `Entity/State.php` | `ACTIVE, DISABLED, DELETED` constants | - |

### 2.3 Database Layer

| File | Public Interface | Dependencies |
|------|-----------------|--------------|
| `Db/Db.php` | `instance(), query(), disconnect()` | PDO |
| `KeitaroDb/GDBC/GDBCClient.php` | GDBC protocol client | - |
| `KeitaroDb/DBCA/DbReader.php` | Distributed DB reader | - |

### 2.4 Security

| File | Public Interface | Dependencies |
|------|-----------------|--------------|
| `Security/IpResolverService.php` | `resolveIp(Request): string` | Request |
| `Security/ServerFinderService.php` | `findServer(Request)` | Request |
| `Sandbox/Sandbox.php` | `execute(code, context)` | SandboxContext |

### 2.5 Logging

| File | Public Interface | Dependencies |
|------|-----------------|--------------|
| `Logging/KLogger.php` | `info(), error(), warning(), debug()` | - |
| `Logging/Service/PostbackLoggerService.php` | `logPostback()` | - |

---

## 3. Traffic Processing (application/Traffic/)

### 3.1 Pipeline System

**Pipeline.php**
```
Interface: start(Payload, TrafficLogEntry): Payload
Methods:
  - firstLevelStages(): Pipeline
  - secondLevelStages(): Pipeline
  - setStages(Stage[]): void
  - start(Payload, LogEntry): Payload
```

**StageInterface.php**
```
Interface: process(Payload, TrafficLogEntry): Payload
```

### 3.2 Pipeline Stages (First Level - Order Matters)

| Stage | Purpose | Artifacts |
|-------|---------|-----------|
| 1. DomainRedirectStage | Handle domain-level redirects | - |
| 2. CheckPrefetchStage | Check prefetch requests | - |
| 3. BuildRawClickStage | Build initial RawClick from request | - |
| 4. FindCampaignStage | Find campaign by token/alias | - |
| 5. CheckDefaultCampaignStage | Fall back to default campaign | - |
| 6. UpdateRawClickStage | Update click with campaign data | - |
| 7. CheckParamAliasesStage | Check parameter aliases | - |
| 8. UpdateCampaignUniquenessSessionStage | Update campaign uniqueness | - |
| 9. ChooseStreamStage | Select stream based on rules | - |
| 10. UpdateStreamUniquenessSessionStage | Update stream uniqueness | - |
| 11. ChooseLandingStage | Select landing page | - |
| 12. ChooseOfferStage | Select offer | - |
| 13. GenerateTokenStage | Generate visitor token | - |
| 14. FindAffiliateNetworkStage | Find affiliate network | - |
| 15. UpdateHitLimitStage | Update hit limit counters | - |
| 16. UpdateCostsStage | Calculate campaign costs | - |
| 17. UpdatePayoutStage | Calculate payouts | - |
| 18. SaveUniquenessSessionStage | Save uniqueness session | - |
| 19. SetCookieStage | Set tracking cookies | - |
| 20. ExecuteActionStage | Execute stream action | - |
| 21. PrepareRawClickToStoreStage | Prepare click for storage | - |
| 22. CheckSendingToAnotherCampaign | Handle campaign redirects | - |
| 23. StoreRawClicksStage | Store clicks in database | - |

### 3.3 Dispatchers

| Dispatcher | Purpose | Context Used |
|------------|---------|--------------|
| ClickDispatcher | Process regular clicks | ClickContext |
| ClickApiDispatcher | Process API clicks | ClickApiContext |
| GatewayRedirectDispatcher | Handle gateway redirects | GatewayRedirectContext |
| KClientJSDispatcher | Serve JS client | KClientJSContext |
| KtrkDispatcher | Handle JSONP tracking | KtrkContext |
| LandingOfferDispatcher | Handle landing/offer flow | LandingOfferContext |
| PostbackDispatcher | Process postbacks | PostbackContext |
| RobotsDispatcher | Serve robots.txt | RobotsContext |
| UpdateTokensDispatcher | Update visitor tokens | UpdateTokensContext |

### 3.4 Models

| Model | Table | Key Fields |
|-------|-------|------------|
| Campaign | keitaro_campaigns | id, alias, token, state, type, action_type, action_payload |
| BaseStream | keitaro_streams | id, campaign_id, type, action_type, weight, chance |
| Offer | keitaro_offers | id, affiliate_network_id, payout_value, url |
| Landing | keitaro_landings | id, action_type, action_payload, url |
| AffiliateNetwork | keitaro_affiliate_networks | id, postback_url, offer_param |
| Setting | keitaro_settings | key, value |

### 3.5 RawClick

**Traffic/RawClick.php** (assumed)
```
Fields:
  - visitor_id, sub_id
  - campaign_id, stream_id, landing_id, offer_id
  - ip, user_agent, referrer
  - country, region, city
  - device_type, os, browser
  - keyword, search_engine
  - sub_id_1..15
  - extra_param_1..10
  - cost, revenue
  - is_bot, is_proxy
  - datetime
```

### 3.6 Cached Data Repositories

| Repository | Purpose |
|------------|---------|
| CachedCampaignRepository | Campaign cache |
| CachedSettingsRepository | Settings cache |
| CachedStreamRepository | Stream cache |
| CachedDomainsRepository | Domains cache |

---

## 4. Component Modules (application/Component/)

### 4.1 Module Structure Pattern

Each module follows this structure:
```
ModuleName/
├── Controller/          # HTTP controllers
├── Repository/          # Data access
├── Service/             # Business logic
├── Serializer/          # JSON serialization
├── Validator/           # Input validation
├── Model/               # Domain models
├── Grid/                # Grid definitions
├── CronTask/            # Scheduled tasks
├── ConsoleCommand/      # CLI commands
├── DelayedCommand/      # Async commands
├── translations/        # i18n files
└── views/               # View templates
```

### 4.2 Key Modules

| Module | Purpose | Key Classes |
|--------|---------|-------------|
| Campaigns | Campaign management | CampaignRepository, CampaignService, CampaignValidator |
| Clicks | Click tracking | ClickRepository, ClickService |
| Conversions | Conversion tracking | ConversionRepository, ConversionService |
| Offers | Offer management | OfferRepository, OfferService |
| Landings | Landing page management | LandingRepository, LandingService |
| Streams | Stream management | StreamRepository, StreamService |
| StreamFilters | Filter rules | StreamFilterRepository, StreamFilterService |
| Postback | Postback processing | PostbackPipeline, ProcessPostbackCommand |
| BotDetection | Bot detection | BotDetectionService, BotsStorage |
| GeoDb | GeoIP databases | GeoDbService, GeoDbRepository |
| Domains | Domain management | DomainRepository, DomainService |
| Users | User management | UserRepository, UserService |
| Reports | Reporting | ReportService, ReportGridDefinition |
| Stats | Statistics | StatsSerializer, StatsCronTask |

### 4.3 Postback Processing Pipeline

| Stage | Purpose |
|-------|---------|
| BuildConversionStage | Create conversion record |
| UpdateClickParamsStage | Update click parameters |
| UpdateConversionParamsStage | Update conversion params |
| UpdateStatusesStage | Update conversion status |
| UpdateRevenueStage | Calculate revenue |
| UpdateCostsStage | Calculate costs |
| UpdateConversionCap | Check conversion limits |
| SyncConversionWithClickStage | Sync click/conversion |
| SendPostbacksStage | Fire external postbacks |
| SaveChangesStage | Persist changes |

---

## 5. Stream Actions (application/Traffic/Actions/)

### 5.1 Action Types

| Action | Purpose |
|--------|---------|
| HttpAction | HTTP redirect |
| FrameAction | iframe embed |
| TextAction | Return text content |
| NothingAction | No action (empty response) |
| RemoteContentAction | Fetch remote content |
| LandingsOfferAction | Landing → Offer flow |
| OffersAction | Direct offer selection |

### 5.2 Action Interface

```
interface ActionInterface {
    public function execute(Payload $payload, LogEntry $log): Response;
}
```

---

## 6. Macros (application/Traffic/Macros/)

### 6.1 Macro Types

| Macro | Purpose |
|-------|---------|
| ClickMacros | Click data macros ({subid}, {clickid}, etc.) |
| ConversionMacros | Conversion data macros |
| CampaignMacros | Campaign macros |

### 6.2 Common Macros

| Macro | Replaced With |
|-------|---------------|
| `{subid}` | Click sub_id |
| `{clickid}` | Click ID |
| `{campaign_id}` | Campaign ID |
| `{offer_id}` | Offer ID |
| `{landing_id}` | Landing ID |
| `{cost}` | Click cost |
| `{revenue}` | Conversion revenue |
| `{ip}` | Visitor IP |
| `{country}` | Country code |
| `{keyword}` | Keyword |
| `{referrer}` | Referrer URL |
| `{user_agent}` | User agent string |

---

## 7. Stream Filters (application/Component/StreamFilters/)

### 7.1 Filter Types

| Filter | Purpose |
|--------|---------|
| CountryFilter | Filter by country |
| RegionFilter | Filter by region |
| CityFilter | Filter by city |
| IpFilter | Filter by IP/range |
| KeywordFilter | Filter by keyword |
| UserAgentFilter | Filter by user agent |
| DeviceFilter | Filter by device type |
| OsFilter | Filter by OS |
| BrowserFilter | Filter by browser |
| LanguageFilter | Filter by language |
| RefererFilter | Filter by referrer |
| ScheduleFilter | Filter by time schedule |
| LimitFilter | Filter by hit limits |

### 7.2 Filter Modes

| Mode | Behavior |
|------|----------|
| `accept` | Accept if match |
| `reject` | Reject if match |

---

## 8. Bot Detection (application/Component/BotDetection/)

### 8.1 Detection Methods

| Method | Purpose |
|--------|---------|
| IP ranges | Check against known bot IPs |
| User Agent | Check against bot UA patterns |
| ASN | Check against bot ASNs |
| Behavior | Behavioral analysis |

---

## 9. GeoIP (application/Traffic/GeoDb/)

### 9.1 Supported Databases

| Database | Provider |
|----------|----------|
| MaxMind GeoIP2 | MaxMind |
| IP2Location | IP2Location |
| Sypex Geo | Sypex |
| ProIP | ProIP |

### 9.2 GeoDbService Interface

```
interface GeoDbServiceInterface {
    public function getCountry(string $ip): ?string;
    public function getRegion(string $ip): ?string;
    public function getCity(string $ip): ?string;
    public function getIsp(string $ip): ?string;
    public function getAsn(string $ip): ?int;
}
```

---

## 10. Third-Party Vendor Packages

| Package | Purpose | npm Replacement |
|---------|---------|-----------------|
| monolog/monolog | Logging | pino |
| piwik/device-detector | Device detection | device-detector-js |
| ip2location/ip2location-php | GeoIP | ip2location-nodejs |
| spiral/roadrunner | App server | fastify |
| laminas/laminas-diactoros | PSR-7 HTTP | @fastify/request |
| vlucas/valitron | Validation | zod |
| adodb/adodb-php | Database | prisma |
| doctrine/cache | Caching | keyv |
| mustangostang/spyc | YAML parsing | yaml |
| bjoern-goetschke/... | DBCA protocol | Custom impl |

---

## 11. Database Schema Summary

### 11.1 Core Tables

| Table | Primary Key | Key Indexes |
|-------|-------------|-------------|
| keitaro_campaigns | id | token, alias, state, group_id |
| keitaro_clicks | click_id | sub_id, campaign_id, datetime |
| keitaro_conversions_2 | conversion_id | sub_id, campaign_id |
| keitaro_offers | id | group_id, affiliate_network_id |
| keitaro_landings | id | group_id |
| keitaro_streams | id | campaign_id, state |
| keitaro_stream_filters | id | stream_id |
| keitaro_visitors | id | visitor_code |
| keitaro_users | id | login, type |

### 11.2 Reference Tables (keitaro_ref_*)

| Table | Purpose |
|-------|---------|
| ref_countries | Country codes |
| ref_regions | Region names |
| ref_cities | City names |
| ref_browsers | Browser names |
| ref_os | Operating systems |
| ref_device_types | Device types |
| ref_keywords | Keywords |
| ref_referrers | Referrer domains |
| ref_sources | Traffic sources |
| ref_ips | IP addresses |
| ref_user_agents | User agent strings |
| ref_sub_ids | Sub ID values |

---

## 12. Decoding Artifacts

### 12.1 Known Artifact Patterns

1. **IonCube Header** - Present in all decoded files:
```php
/*
 * @ https://EasyToYou.eu - IonCube v11 Decoder Online
 * @ PHP 7.2
 * @ Decoder version: 1.0.4
 * @ Release: 01/09/2021
 */
```

2. **Obfuscated Property Names** - Private properties with underscore prefix:
   - `$_fields`, `$_tableName`, `$_cacheKey`

3. **Missing Type Declarations** - PHP 7.4 types not present

4. **Possible Stub Implementations** - Need verification:
   - Empty catch blocks
   - Placeholder returns

### 12.2 Files Requiring Human Review

- Files with `// TODO` comments
- Files with placeholder returns
- Files with incomplete logic

---

## 13. Configuration Files

| File | Purpose |
|------|---------|
| Dockerfile | PHP 7.4-FPM + RoadRunner container |
| docker-compose.yml | MySQL 5.7 + App services |
| .htaccess | Apache rewrite rules |
| application/config/config.ini.sample | Sample config |
| application/config/clickhouse/dictionary.xml | ClickHouse config |

---

## Appendix A: Route Definitions

```php
$routes = [
    ['pattern' => '/admin_api\/(v[0-9]+)/i', 'context' => 'Admin\\Context\\AdminApiContext'],
    ['pattern' => '/\/([a-z0-9\-_]+)\/postback/i', 'context' => 'Traffic\\Context\\PostbackContext'],
    ['test' => fn($r) => $r->getParam('postback'), 'context' => 'Traffic\\Context\\PostbackContext'],
    ['test' => fn($r) => $r->getParam('_ping') === 'domain', 'context' => 'Traffic\\Context\\PingDomainContext'],
    ['test' => fn($r) => $r->getParam('_ping') === 'license', 'context' => 'Admin\\Context\\RefreshLicenseContext'],
    ['test' => fn($r) => $r->getParam('_update_tokens'), 'context' => 'Traffic\\Context\\UpdateTokensContext'],
    ['pattern' => '/click_api\/v([0-9])+\/?/i', 'context' => 'Traffic\\Context\\ClickApiContext'],
    ['pattern' => '/[\/]*api\.php$/', 'context' => 'Traffic\\Context\\ClickApiContext'],
    ['test' => fn($r) => $r->hasParam('_lp'), 'context' => 'Traffic\\Context\\LandingOfferContext'],
    ['test' => fn($r) => $r->getParam('return') === 'jsonp', 'context' => 'Traffic\\Context\\KtrkContext'],
    ['test' => fn($r) => $r->getParam('return') === 'js.client', 'context' => 'Traffic\\Context\\KClientJSContext'],
    ['pattern' => '/\/([a-z0-9\-_]+)\/?$/i', 'context' => 'Traffic\\Context\\ClickContext'],
    ['pattern' => '/^\/favicon\.ico/', 'context' => 'Traffic\\Context\\NotFoundContext'],
    ['pattern' => '/^\/robots\.txt/', 'context' => 'Traffic\\Context\\RobotsContext'],
    ['pattern' => '/^\/gateway\.php/', 'context' => 'Traffic\\Context\\GatewayRedirectContext'],
    ['context' => 'Traffic\\Context\\ClickContext'], // Default
];
```

---

## Appendix B: Pipeline Payload State

```
Payload State Machine:

Initial State:
  - serverRequest: Request
  - response: Response
  - rawClick: RawClick (empty)

After FindCampaignStage:
  - campaign: Campaign

After ChooseStreamStage:
  - stream: Stream

After ChooseLandingStage:
  - landing: Landing (optional)

After ChooseOfferStage:
  - offer: Offer (optional)

After ExecuteActionStage:
  - response: Response (final)

Final State:
  - response: Response (ready to send)
  - rawClicksToStore: RawClick[]
```
