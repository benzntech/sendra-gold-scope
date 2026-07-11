<!-- GSD:project-start source:PROJECT.md -->

## Project

**Sendra Gold**

Sendra Gold is a premium, fully branded online jewellery e-commerce platform and business ecosystem. It features a Next.js customer-facing storefront, a modular Laravel/Bagisto backend API, and a Vite-based Franchise and Channel Partner portal. The platform handles high-volume catalog search, retail sales, master franchise turnover tracking, channel partner commissions, and old gold purchasing with zero original platform branding leakage.

**Core Value:** Provide a seamless, gold-backed business and shopping ecosystem that enables trusted master franchise operations, channel partner referral tracking, and secure consumer jewellery transactions.

### Constraints

- **Stack**: Must use PHP 8.3/Laravel 12, Next.js 16/TypeScript, and Vite/React.
- **Security**: Strict encryption/signing for channel partner referral data and transactional records.
- **Localization**: Target region is India; currency is INR (₹).

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Overview

| Sub-project | Role | Primary Language | Framework |
|---|---|---|---|
| `sendra-backend/` | E-commerce API & Admin | PHP 8.3 | Laravel 12 (Bagisto) |
| `sendra-storefront/` | Customer Storefront | TypeScript | Next.js 16 |
| `sendra-gold-franchise/` | Franchise Staff Portal | TypeScript | Vite 6 + React 19 |

## 1. sendra-backend — Laravel/Bagisto API

### Language & Runtime

- **PHP** `^8.3` (strict minimum)
- **PHP Extensions required:** `calendar`, `curl`, `intl`, `mbstring`, `openssl`, `pdo`, `pdo_mysql`, `tokenizer`
- **Composer** `v2` (package manager)
- **Node.js / npm** — used for front-end asset building (Vite)

### Framework

- **Laravel** `^12.0` — primary MVC framework
- **Bagisto** (open-source) — e-commerce layer built on Laravel; the project is a fork/extension of `bagisto/bagisto`

### Key Webkul Modules (packages/Webkul/)

| Module | Purpose |
|---|---|
| Admin | Admin panel UI and controllers |
| Attribute | Product attribute management |
| CMS | Content management |
| CartRule / CatalogRule | Promotional rules engine |
| Category / Product | Catalog management |
| Checkout / Sales | Order lifecycle |
| Customer | Customer accounts |
| DataGrid | Admin data table components |
| DataTransfer | Import/export |
| GDPR / EUWithdrawal | Regulatory compliance |
| ImageCache | Image optimization |
| Installer | CLI installer (`artisan bagisto:install`) |
| Inventory | Stock management |
| MagicAI | AI-driven features |
| Marketing | Campaigns & newsletters |
| Notification | Event-based notifications |
| PayU / Paypal / PhonePe / Razorpay / Stripe | Payment gateways |
| RMA | Returns & refunds |
| Shipping | Shipping methods |
| Shop | Storefront Blade UI |
| Sitemap | SEO sitemap generation |
| SocialLogin / SocialShare | OAuth & social sharing |
| Tax | Tax rules |
| Theme | Theme engine |

### Core Production Dependencies (composer.json)

| Package | Version | Purpose |
|---|---|---|
| `laravel/framework` | `^12.0` | Core MVC |
| `laravel/sanctum` | `^4.0` | API token auth |
| `laravel/socialite` | `^5.0` | OAuth social login |
| `laravel/cashier` | `^16.0` | Stripe subscription billing |
| `laravel/octane` | `^2.3` | High-performance server (Swoole/RoadRunner) |
| `laravel/ai` | `^0.2.2` | Multi-provider AI abstraction |
| `laravel/tinker` | `^2.10` | REPL |
| `laravel/ui` | `^4.0` | Auth scaffolding |
| `stripe/stripe-php` | `^17.3` | Stripe SDK |
| `razorpay/razorpay` | `^2.9` | Razorpay SDK |
| `paypal/paypal-server-sdk` | `^2.0` | PayPal SDK |
| `pusher/pusher-php-server` | `^7.0` | Real-time broadcasting |
| `predis/predis` | `^2.2` | Redis client |
| `elasticsearch/elasticsearch` | `^8.10` | Elasticsearch client |
| `guzzlehttp/guzzle` | `^7.0.1` | HTTP client |
| `intervention/image` | `^2.4\|^3.0` | Image processing |
| `barryvdh/laravel-dompdf` | `^2.0\|^3.0` | PDF generation |
| `mpdf/mpdf` | `^8.2` | PDF generation (alternative) |
| `maatwebsite/excel` | `^3.1.46` | Excel import/export |
| `spatie/laravel-responsecache` | `^7.4` | HTTP response caching |
| `spatie/laravel-sitemap` | `^7.3` | Sitemap XML generation |
| `pragmarx/google2fa` | `^8.0` | 2FA (TOTP) |
| `simplesoftwareio/simple-qrcode` | `^4.2` | QR code generation |
| `nesbot/carbon` | `^3.0` | Date/time handling |
| `kalnoy/nestedset` | `^6.0` | Nested set (category trees) |
| `konekt/concord` | `^1.16` | Laravel module system |
| `astrotomic/laravel-translatable` | `^11.16` | Multi-language models |
| `khaled.alshamaa/ar-php` | `^6.0.0` | Arabic language support |
| `stevebauman/purify` | `^6.3` | HTML sanitization |
| `enshrined/svg-sanitize` | `^0.22.0` | SVG sanitization |
| `prettus/l5-repository` | `^2.6` | Repository pattern |
| `diglactic/laravel-breadcrumbs` | `^10.0` | Breadcrumb navigation |

### Dev Dependencies (sendra-backend)

| Package | Version | Purpose |
|---|---|---|
| `pestphp/pest` | `^3.0` | Test framework |
| `pestphp/pest-plugin-laravel` | `^3.0` | Laravel Pest plugin |
| `phpunit/phpunit` | `^11.0` | Unit testing (underlying) |
| `laravel/pint` | `^1.19` | PHP code style fixer (PSR-12) |
| `barryvdh/laravel-debugbar` | `^3.8` | Debug toolbar |
| `laravel/boost` | `^2.1` | Dev utilities |
| `fakerphp/faker` | `^1.23` | Fake data generation |
| `mockery/mockery` | `^1.6` | Mocking |
| `nunomaduro/collision` | `^8.0` | Better CLI error reporting |
| `bagisto/laravel-datafaker` | `2.3.*` | Bagisto-specific seeders |
| `@playwright/test` | `^1.58.1` | E2E browser tests (Node) |
| `laravel-vite-plugin` | `^1.0` | Vite integration for assets |

### Backend Asset Build

- **Vite** `^6.4.2` — bundles admin/shop front-end assets
- **axios** `^1.7.9` — HTTP from Vite-built JS
- Build scripts: `npm run dev` / `npm run build` (in `sendra-backend/`)

## 2. sendra-storefront — Next.js Storefront

### Language & Runtime

- **TypeScript** `^5` (strict)
- **Node.js** (runtime; Docker base: `node:22-alpine`)

### Framework

- **Next.js** `16.0.10` — React SSR/SSG framework (App Router)
- **React** `19.2.0` / **React DOM** `19.2.0`
- Output mode: `standalone` (for Docker deployment)

### Key Production Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | `16.0.10` | SSR framework |
| `react` / `react-dom` | `19.2.0` | UI library |
| `@apollo/client` | `^3.14.0` | GraphQL client |
| `graphql` | `^16.12.0` | GraphQL runtime |
| `next-auth` | `^4.24.13` | Authentication (session management) |
| `@reduxjs/toolkit` | `^2.10.1` | State management |
| `react-redux` | `^9.2.0` | Redux bindings |
| `react-hook-form` | `^7.66.1` | Form handling |
| `@heroui/react` | `^2.8.6` | UI component library |
| `@heroui/accordion` | `^2.2.25` | Accordion component |
| `@heroui/drawer` | `^2.2.25` | Drawer component |
| `@heroui/select` | `^2.4.29` | Select component |
| `@heroicons/react` | `^2.2.0` | Icon set |
| `lucide-react` | `^0.563.0` | Icon set |
| `framer-motion` | `^12.23.24` | Animation library |
| `next-themes` | `^0.4.6` | Dark/light theme support |
| `clsx` | `^2.1.1` | Conditional class names |

### Dev Dependencies (sendra-storefront)

| Package | Version | Purpose |
|---|---|---|
| `typescript` | `^5` | Type checking |
| `tailwindcss` | `^4` | Utility CSS |
| `@tailwindcss/postcss` | `^4` | PostCSS integration |
| `eslint` | `^9` | Linter |
| `eslint-config-next` | `16.0.10` | Next.js ESLint rules |
| `ts-node` | `^10.9.2` | TypeScript runner |
| `@types/node` | `^20` | Node type definitions |
| `@types/react` | `^19` | React type definitions |

### ESLint Configuration

- Extends `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- Enforces `prefer-const`, `no-var`, unused variable detection
- File: `eslint.config.mjs`

### Build Scripts

### Next.js Config Highlights

- `reactStrictMode: true`
- `output: 'standalone'`
- `experimental.serverActions.bodySizeLimit: "2mb"`
- `compress: true`
- File: `next.config.ts`

## 3. sendra-gold-franchise — Vite/TypeScript Franchise Portal

### Language & Runtime

- **TypeScript** `~5.8.2`
- **Node.js** (runtime)
- Module type: `ESM` (`"type": "module"`)

### Framework

- **Vite** `^6.2.3` — build tool and dev server
- **React** `^19.0.1` / **React DOM** `^19.0.1`
- **Express** `^4.21.2` — minimal HTTP server (API proxy / server layer)

### Key Production Dependencies

| Package | Version | Purpose |
|---|---|---|
| `vite` | `^6.2.3` | Build tool / dev server |
| `react` / `react-dom` | `^19.0.1` | UI library |
| `@vitejs/plugin-react` | `^5.0.4` | React Fast Refresh plugin |
| `@google/genai` | `^2.4.0` | Google Gemini AI SDK |
| `@tailwindcss/vite` | `^4.1.14` | Tailwind CSS Vite plugin |
| `tailwindcss` | `^4.1.14` | Utility CSS |
| `lucide-react` | `^0.546.0` | Icon set |
| `motion` | `^12.23.24` | Animation library |
| `express` | `^4.21.2` | Node.js HTTP server |
| `dotenv` | `^17.2.3` | Env variable loading |

### Dev Dependencies (sendra-gold-franchise)

| Package | Version | Purpose |
|---|---|---|
| `typescript` | `~5.8.2` | Type checking |
| `esbuild` | `^0.25.0` | Fast JS bundler |
| `tsx` | `^4.21.0` | TypeScript execution |
| `autoprefixer` | `^10.4.21` | CSS vendor prefix automation |
| `@types/node` | `^22.14.0` | Node type definitions |
| `@types/express` | `^4.17.21` | Express type definitions |

### Build Scripts

### Vite Configuration Highlights

- Plugins: `@vitejs/plugin-react` + `@tailwindcss/vite`
- Path alias: `@` → project root
- HMR disabled when `DISABLE_HMR=true` (AI Studio cloud environment detection)
- File: `vite.config.ts`

## Infrastructure & DevOps

### Docker

#### sendra-backend

- **Dockerfile**: Base `php:8.3-fpm`, installs Composer + Node/npm + PHP extensions, runs `npm run build`, exposes port `8000`
- **docker-compose.yml** (Laravel Sail-based):

| Service | Image | Port(s) |
|---|---|---|
| `laravel.test` | `sail-8.3/app` | 80, Vite port |
| `mysql` | `mysql/mysql-server:8.0` | 3306 |
| `redis` | `redis:alpine` | 6379 |
| `elasticsearch` | `elasticsearch:7.17.0` | 9200, 9300 |
| `kibana` | `kibana:7.17.0` | 5601 |
| `mailpit` | `axllent/mailpit:latest` | 1025, 8025 |

- Production Docker targets: `docker/production/` (separate production Dockerfile)

#### sendra-storefront

- **Dockerfile**: Multi-stage build (`node:22-alpine`)

### CI/CD — GitHub Actions (sendra-backend)

| Workflow | Trigger | Description |
|---|---|---|
| `pest_tests.yml` | push / PR | Pest unit & feature tests (PHP 8.3 + MySQL 8.0) |
| `pint_tests.yml` | push / PR | Code style check via `laravel/pint --test` |
| `admin_playwright_tests.yml` | push / PR | E2E Playwright tests (Chromium, 10 shards, Node 22.13.1) |
| `shop_playwright_tests.yml` | push / PR | E2E shop tests (same pattern) |
| `docker_publish.yml` | `v*` tag / manual | Multi-arch (amd64 + arm64) Docker image → Docker Hub `webkul/bagisto` |
| `translation_tests.yml` | push / PR | Language file validation |

## Data Storage Architecture

| Store | Technology | Sub-project |
|---|---|---|
| Primary DB | MySQL 8.0 | sendra-backend |
| Cache | File (default); also Redis, Memcached, DynamoDB (configured) | sendra-backend |
| Sessions | Database (default); also file, cookie, Redis | sendra-backend |
| Job Queue | Sync (default); also Database, Redis, SQS, Beanstalkd | sendra-backend |
| Search | Elasticsearch 7.17 | sendra-backend |
| File Storage | Local `public` disk (default); also AWS S3 | sendra-backend |
| Client State | Redux Toolkit (RTK) | sendra-storefront |
| Local State | React Context API + `localStorage` | sendra-gold-franchise |

## Quick Reference Summary

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Overview

## 1. sendra-backend (Laravel/PHP)

### 1.1 Code Style & Formatting

- PSR-12 base standard extended with Laravel-specific rules
- Single-quoted strings preferred
- Space after keywords (`if (`, `foreach (`, etc.)
- Ordered imports (grouped: stdlib, vendor, internal)
- Trailing commas in function calls / arrays
- Short closure arrow functions where applicable

| Setting | Value |
|---|---|
| Charset | UTF-8 |
| Line endings | LF |
| Indent style | spaces |
| Indent size (default) | 4 |
| Indent size (YAML) | 2 |
| Indent size (docker-compose.yml) | 4 |
| Final newline | yes |
| Trailing whitespace trimming | yes (disabled for `.md`) |

### 1.2 PHP Standards

- **PSR-2** for coding standards
- **PSR-4** for autoloading
- PHP **8.3+** minimum
- No `env()` calls outside `config/` files (enforced by validation checklist)

### 1.3 Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| PHP Namespace | `Webkul\<PackageName>` | `Webkul\Product` |
| Class name | PascalCase, singular | `ProductRepository` |
| Model | Singular PascalCase | `Product`, `Category` |
| Repository | `<Model>Repository` | `ProductRepository` |
| Controller (Admin) | `<Model>Controller` in `Http/Controllers/Admin/` | `CategoryController` |
| Controller (Shop) | `<Model>Controller` in `Http/Controllers/Shop/` | `CategoryController` |
| Service Provider | `<Package>ServiceProvider` | `ProductServiceProvider` |
| Module Provider | `ModuleServiceProvider` | (fixed name, one per package) |
| Routes files | `admin-routes.php`, `shop-routes.php` | per-package |
| DB columns | `snake_case` | `customer_first_name`, `base_grand_total` |
| Events | PascalCase noun phrase | `OrderCreated`, `CartUpdated` |
| Test files | `<Entity>Test.php` suffix | `CategoryTest.php`, `OrdersTest.php` |

### 1.4 Directory & Package Naming Patterns

### 1.5 PHPDoc / Comment Patterns

- `@param` followed by **two spaces**, the type, **two more spaces**, then the variable name
- `@return void` always present even when nothing is returned
- `@throws` when exceptions may be raised
- Summary line as first line of doc block

### 1.6 Architecture & Design Patterns

| Pattern | Implementation |
|---|---|
| **Repository Pattern** | All DB access via repositories extending `Webkul\Core\Eloquent\Repository` (Prettus L5). Never direct model queries in controllers. |
| **Proxy Pattern** | Models have Proxy classes (e.g., `ProductProxy`) enabling model substitution. Always use proxies for cross-package type hints. |
| **Concord Module System** | Models registered in `ModuleServiceProvider`, wired via `config/concord.php`. Three-component system: Contract + Model + Proxy. |
| **Event-Driven** | Framework fires events at lifecycle points. Extend via listeners, not by modifying core packages. |
| **Dual Route Files** | Admin routes use `['web', 'admin']` middleware + `config('app.admin_url')` prefix. Shop routes use `['web', 'locale', 'theme', 'currency']` middleware. |

### 1.7 Key Rules (Validation Checklist)

### 1.8 Git Workflow

| Branch Type | Target Branch |
|---|---|
| Bug fixes | Latest staging/development branch |
| Minor backwards-compatible features | Latest stable branch |
| Major new features | `master` branch |

- Bug reports encouraged as pull requests with a **negative test** demonstrating the bug
- Compiled assets (`public/themes/*/build/`) must **not** be committed — generated by maintainers only
- PR template: `.github/PULL_REQUEST_TEMPLATE.md`

### 1.9 API Design Conventions

- REST API endpoints follow Bagisto's existing route naming (e.g., `admin.catalog.categories.index`)
- Named routes used throughout (not hardcoded URLs)
- Admin routes prefixed by `config('app.admin_url')` (configurable, default `admin`)
- JSON responses from API endpoints: standard Laravel JSON response with `data`, `meta`, `links` structure (Bagisto default API Platform)
- Separate `api.php` route files per package where applicable

### 1.10 Localization Requirements

- **21 locales** must be maintained: `ar, bn, ca, de, en, es, fa, fr, he, hi_IN, id, it, ja, nl, pl, pt_BR, ru, sin, tr, uk, zh_CN`
- Adding/removing any translation key requires updating all 21 locale files in the package's `Resources/lang/` directory
- CI enforces via `translation_tests.yml` → `php artisan bagisto:translations:check`

## 2. sendra-storefront (Next.js)

### 2.1 Code Style & Formatting

- `eslint-config-next/core-web-vitals` — Next.js performance & accessibility rules
- `eslint-config-next/typescript` — TypeScript-aware Next.js rules

| Rule | Severity | Notes |
|---|---|---|
| `@typescript-eslint/no-unused-vars` | error | Ignores vars/args/errors prefixed with `_` |
| `no-unused-vars` | off | Superseded by TypeScript rule |
| `no-console` | warn | `console.warn` and `console.error` allowed |
| `@typescript-eslint/no-explicit-any` | **off** | `any` is permitted |
| `@typescript-eslint/no-non-null-assertion` | warn | `!` assertions flagged but not blocked |
| `react-hooks/exhaustive-deps` | **off** | Dependency array not enforced |
| `react/no-unescaped-entities` | warn | — |
| `@typescript-eslint/no-empty-interface` | warn | — |
| `prefer-const` | error | `let` only when reassigned |
| `no-var` | error | No `var` declarations |

### 2.2 TypeScript Configuration

| Option | Value |
|---|---|
| Target | ES2017 |
| Strict mode | **true** |
| Module | ESNext |
| Module resolution | bundler |
| JSX | react-jsx |
| Incremental compilation | yes |

### 2.3 Naming Conventions (Storefront)

| Entity | Convention | Example |
|---|---|---|
| Component files | PascalCase `.tsx` | `ProductCard.tsx` |
| Pages (App Router) | `page.tsx` / `layout.tsx` | `app/(public)/page.tsx` |
| Route groups | Parentheses | `(checkout)`, `(public)` |
| GraphQL directories | lowercase | `cart/`, `catalog/` |
| Store/utility dirs | lowercase | `store/`, `utils/`, `lib/` |
| Hooks | `use` prefix (convention) | `useCart`, `useAuth` |

### 2.4 API Communication Pattern

### 2.5 State Management

- **Redux Toolkit** (`@reduxjs/toolkit ^2.10`) + `react-redux ^9.2` for global state
- **React Hook Form** (`^7.66`) for form handling
- **next-auth `^4.24`** for authentication sessions
- **next-themes `^0.4.6`** for dark/light theme

### 2.6 Notable Dependencies

| Package | Version |
|---|---|
| Next.js | 16.0.10 |
| React | 19.2.0 |
| TypeScript | ^5 |
| Tailwind CSS | ^4 |
| HeroUI | ^2.8.6 |
| Framer Motion | ^12.23 |
| Apollo Client | ^3.14 |

## 3. sendra-gold-franchise (Vite/React/TypeScript)

### 3.1 Code Style & Formatting

### 3.2 TypeScript Configuration

| Option | Value |
|---|---|
| Target | ES2022 |
| Module | ESNext |
| Module resolution | bundler |
| `allowJs` | true |
| `isolatedModules` | true |
| `noEmit` | true |
| `experimentalDecorators` | true |
| Strict mode | **NOT enabled** |
| JSX | react-jsx |

### 3.3 Naming Conventions (Franchise Portal)

| Entity | Convention | Example |
|---|---|---|
| Component files | PascalCase `.tsx` | `AdminPortal.tsx`, `CustomerPortal.tsx` |
| Context files | PascalCase, `Context` suffix | `PlatformContext` |
| Type files | lowercase `.ts` | `types.ts` |
| TypeScript interfaces | PascalCase | `Branch`, `StaffUser`, `GoldRates`, `Order`, `BuybackTicket` |
| TypeScript type aliases | PascalCase | `UserRole`, `ProductCategory` |
| Interface properties | camelCase | `branchId`, `makingCharge`, `goldRateApplied` |
| Status enum literals | `snake_case` strings | `"appointment_booked"`, `"kyc_pending"` |

### 3.4 File Organization

### 3.5 Comment Patterns

### 3.6 Notable Dependencies

| Package | Version |
|---|---|
| Vite | ^6.2.3 |
| React | ^19.0.1 |
| TypeScript | ~5.8.2 |
| Tailwind CSS | ^4.1.14 |
| `@google/genai` | ^2.4.0 (Google AI SDK) |
| `motion` | ^12.23.24 |
| Express | ^4.21.2 (server-side) |
| lucide-react | ^0.546.0 |

## 4. Cross-Project Summary

### 4.1 Technology Stack Comparison

| Concern | Backend | Storefront | Franchise |
|---|---|---|---|
| Language | PHP 8.3+ | TypeScript 5 | TypeScript ~5.8 |
| Framework | Laravel 12 (Bagisto 2.4) | Next.js 16 | Vite 6 / React 19 |
| CSS | Tailwind CSS 3 (Blade) | Tailwind CSS 4 | Tailwind CSS 4 |
| Linter | Laravel Pint (laravel preset) | ESLint 9 + Next.js rules | `tsc --noEmit` only |
| API style | REST + GraphQL server | GraphQL consumer | Mocked/no API |
| Strict typing | PSR-2 enforced | `strict: true` | No strict mode |

### 4.2 Documentation Quality

| Project | Status | Files Present |
|---|---|---|
| sendra-backend | ✅ Excellent | `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `UPGRADE.md`, `SECURITY.md` |
| sendra-storefront | ⚠ Minimal | `README.md`, `changelog.md` |
| sendra-gold-franchise | ❌ Sparse | `README.md` (542 bytes, no technical content) |

### 4.3 Environment Variables

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## Overview

| Sub-project | Tech Stack | Role |
|---|---|---|
| `sendra-backend/` | Laravel 12 / PHP 8.3+ (Bagisto 2.4.x) | Monolithic e-commerce backend & API server |
| `sendra-storefront/` | Next.js 16 / React 19 / TypeScript | Headless customer-facing storefront (GraphQL client) |
| `sendra-gold-franchise/` | Vite 6 / React 19 / TypeScript | Standalone franchise portal SPA (offline-capable) |

## 1. System Architecture Overview

```

```

### Sub-Project Relationships

- **`sendra-backend` → `sendra-storefront`**: The storefront is a fully headless Next.js app. It calls the Bagisto GraphQL API (exposed via the Bagisto Headless Extension, API v1.0.3) for all data — products, categories, cart, checkout, customer auth. It proxies client-side GraphQL calls through a Next.js API route (`/api/graphql`) to avoid CORS and hide the storefront key.
- **`sendra-backend` → `sendra-gold-franchise`**: The franchise portal is a **locally-stateful SPA** — all data currently lives in `localStorage` with seeded initial data. It references the backend only through `APP_URL` env var (and `GEMINI_API_KEY` for Gemini AI calls). No live API integration is implemented yet.
- **`sendra-storefront` ↔ `sendra-gold-franchise`**: No direct code sharing. Separate applications with independent type definitions covering overlapping domain concepts.

## 2. Backend Architecture (`sendra-backend`)

### 2.1 Platform Foundation

- Laravel 12 / PHP 8.3+
- MySQL 8 (primary datastore)
- Redis (caching, sessions, queues)
- Elasticsearch 7.17 (product search)
- Laravel Sanctum (API token auth)
- Laravel Octane (optional high-performance server)
- Vite 5 (admin/shop frontend assets)
- Vue 3 (admin UI components within Blade)
- Tailwind CSS 3

### 2.2 Modular Package System (Concord)

```

```

### 2.3 Key Design Patterns

#### Repository Pattern

- `Contracts/` — PHP interface (e.g., `Webkul\Product\Contracts\Product`)
- `Models/` — Eloquent model implementation
- `Repositories/` — Repository extending `Webkul\Core\Eloquent\Repository`

#### Proxy Pattern (Concord Model Substitution)

#### Event-Driven Architecture

#### EAV (Entity-Attribute-Value) for Products

#### DataGrid System

### 2.4 Routing Architecture

| Route Group | Middleware | Prefix | Source |
|---|---|---|---|
| Admin web routes | `['web', 'admin']` | `config('app.admin_url')` (default: `admin`) | `Admin/src/Routes/*.php` |
| Shop web routes | `['web', 'locale', 'theme', 'currency']` | `/` | `Shop/src/Routes/*.php` |
| Shop API routes | `['web', 'locale', 'theme', 'currency']` | `/api` | `Shop/src/Routes/api.php` |

- `GET /api/categories` — Category listing + tree
- `GET /api/products` — Product listing
- `POST /api/checkout/cart` — Add to cart
- `POST /api/checkout/onepage/orders` — Place order
- `POST /api/customer/login` — Customer authentication
- `GET /api/customer/wishlist` — Wishlist (auth required)
- `GET /api/customer/addresses` — Addresses (auth required)

### 2.5 Authentication & Authorization

- Session-based via `admin` middleware group
- Optional 2FA (TOTP via `pragmarx/google2fa`)
- ACL system in `Core/Acl.php` controlling menu visibility and resource access
- Session-based for Blade storefront (session driver: `database`)
- Token-based (Laravel Sanctum) for the headless GraphQL API
- Social login via `SocialLogin` package (Laravel Socialite)
- Storefront key (`X-STOREFRONT-KEY` header) for Next.js SSR calls

### 2.6 Infrastructure (Docker / Development)

- `laravel.test` — PHP 8.3 application server
- `mysql` — MySQL 8.0
- `redis` — Redis (Alpine)
- `elasticsearch` — Elasticsearch 7.17.0
- `kibana` — Kibana 7.17.0
- `mailpit` — SMTP mail catcher

## 3. Storefront Architecture (`sendra-storefront`)

### 3.1 Platform & Rendering Strategy

| Strategy | Used For | Implementation |
|---|---|---|
| **ISR** (Incremental Static Regeneration) | Home page, product listings | `export const revalidate = 3600` |
| **SSR** (Server-Side Rendering) | Dynamic pages, cart, checkout | Async server components |
| **CSR** (Client-Side Rendering) | Interactive cart mutations, auth-protected pages | Client components with Apollo |

### 3.2 Data Layer — GraphQL + Apollo

```

```

- `src/lib/apollo-client.ts` — `createApolloClient()`. SSR: uses `X-STOREFRONT-KEY` + direct `GRAPHQL_URL`. CSR: routes through `/api/graphql` proxy.
- `src/lib/graphql-fetch.ts` — `graphqlRequest()`: wraps Apollo with `unstable_cache` for ISR. Supports `CacheLifeOption` presets (`seconds`=10s, `minutes`=60s, `hours`=3600s, `days`=86400s, `weeks`=604800s).
- `src/app/api/graphql/` — Next.js API route proxying GraphQL (hides backend URL + storefront key from browser)
- `catalog/queries` — Product + category queries
- `catalog/mutations` — Product mutations
- `catalog/fragments` — Reusable GraphQL fragments
- `cart/mutations` — Cart add/update/remove
- `checkout/queries` — Shipping methods, payment methods
- `checkout/mutations` — Place order
- `theme/queries` — Home page theme customization

### 3.3 Authentication (NextAuth.js)

- **NextAuth.js v4** handles customer session management
- Session extended with `accessToken` (`src/types/next-auth.d.ts`)
- `proxy.ts` — Next.js middleware redirecting authenticated users away from login/register
- SSR: uses `BAGISTO_STOREFRONT_KEY` env variable
- CSR: Apollo reads `session.user.accessToken` (Bagisto Bearer token), falls back to guest cart token from localStorage

### 3.4 State Management

| Slice | State | Purpose |
|---|---|---|
| `cartDetail` | `cart`, `billingAddress`, `shippingAddress` | Cart items and checkout address state |
| `user` | user session info | Logged-in user state |

```

```

### 3.5 Routing (Next.js App Router)

```

```

## 4. Franchise Portal Architecture (`sendra-gold-franchise`)

### 4.1 Platform

### 4.2 Application Architecture — Role-Based Portal

```

```

### 4.3 Role Model

| Role | Access |
|---|---|
| `customer` | Browse products, cart, orders, wishlist, book buyback appointments |
| `executive` | Customer ops + KYC upload, gold testing, ticket management |
| `manager` | Executive ops + approve/reject buyback tickets |
| `admin` | Full access: branch management, staff, gold rate overrides, audit logs |

### 4.4 State Management — Single Context + localStorage

- Auth simulation (role, staffId, branchId)
- Connectivity (isOnline, offlineQueue)
- Branch master data
- Gold rates (24K/22K/18K buy/sell per gram, 2-min auto-refresh ticker)
- Products, cart, wishlist, orders
- Buyback tickets (full workflow state machine)
- Immutable audit log

### 4.5 Business Domain (Gold Jewellery Specific)

- `GoldRates` — 24K/22K/18K buy/sell rates with `isOverride` flag
- `Product` — weight (grams), makingCharge, category (`Jewellery` | `Coins` | `Bars`)
- `BuybackTicket` — Workflow: `appointment_booked → kyc_pending → testing_pending → approval_pending → approved/rejected → completed`
- `KYCDocuments` — Aadhaar, PAN, customer photo with encryption marker
- `AuditLogEntry` — Immutable action audit trail

### 4.6 KYC Security (Simulation)

- `encryptKYCData()` — Base64 + `SECURE_ENC_AES256::` marker (NOT real AES)
- `decryptKYCData()` — Reverses transformation
- `maskSensitiveValue()` — Display masking for Aadhaar/PAN

## 5. Cross-Project Communication Patterns

### 5.1 Storefront → Backend (GraphQL over HTTPS)

```

```

### 5.2 Franchise → Backend (Planned)

- `APP_URL` env var points to backend; no API calls implemented yet
- `GEMINI_API_KEY` enables direct Gemini AI calls from client

## 6. Authentication Architecture Summary

| Layer | Mechanism | Token Type |
|---|---|---|
| Admin panel | Laravel session + optional 2FA | Session cookie |
| Blade storefront | Laravel session | Session cookie |
| Headless storefront (SSR) | Bagisto Storefront Key | `X-STOREFRONT-KEY` header |
| Headless storefront (CSR) | NextAuth.js ↔ Bagisto Bearer | `Authorization: Bearer` |
| Guest shopping (CSR) | Cart token in localStorage | `Authorization: Bearer` (guest) |
| Franchise portal | Role simulation via localStorage | `sg_role` localStorage key |

## 7. Key Design Observations

### Backend

- **Modular monolith**: All 40 packages deploy together, organized as independent modules with strict boundaries (repositories, contracts, proxies)
- **Dual rendering**: Backend serves both Blade views (Admin + traditional Shop) AND acts as headless API for the Next.js frontend — same Laravel application serves both rendering modes
- **Path repositories**: `composer.json` uses `"type": "path"` — package changes are symlinked, no `composer update` needed for development
- **21 locales**: All translation files must exist for all 21 locales (enforced in CI via `bagisto:translations:check`)

### Storefront

- **API proxy pattern**: `/api/graphql` Next.js route hides Bagisto endpoint and storefront key from the browser
- **Dual Apollo mode**: SSR uses `network-only` (fresh data); CSR uses `cache-first`
- **ISR for performance**: Targets 100/100 Core Web Vitals score with layered caching

### Franchise Portal

- **Offline-first**: Full functionality without connectivity via localStorage
- **Monolithic portal components**: `AdminPortal.tsx` (55KB), `CustomerPortal.tsx` (69KB), `StaffPortal.tsx` (67KB) — each contains all UI for that role. Major refactoring needed for maintainability.
- **No shared types with backend**: Type definitions in `src/types.ts` are independent; schema drift is a risk
- **No live backend integration**: Currently a functional prototype/demo application

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.agents/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
