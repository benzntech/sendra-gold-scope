# ARCHITECTURE — Sendra Gold
_Last updated: 2026-07-11_

## Overview

Sendra Gold is a **multi-repo gold jewellery e-commerce and franchise management platform** composed of three independent but related sub-projects:

| Sub-project | Tech Stack | Role |
|---|---|---|
| `sendra-backend/` | Laravel 12 / PHP 8.3+ (Bagisto 2.4.x) | Monolithic e-commerce backend & API server |
| `sendra-storefront/` | Next.js 16 / React 19 / TypeScript | Headless customer-facing storefront (GraphQL client) |
| `sendra-gold-franchise/` | Vite 6 / React 19 / TypeScript | Standalone franchise portal SPA (offline-capable) |

The three sub-projects are **not a monorepo** — each has its own `package.json`/`composer.json`, `.git` repository, and independent deployment target. They communicate exclusively at runtime; there are no shared source packages or a workspace root build system.

---

## 1. System Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    SENDRA GOLD PLATFORM                      │
│                                                              │
│  ┌────────────────┐     GraphQL API     ┌────────────────┐  │
│  │  sendra-       │◄────────────────────│  sendra-       │  │
│  │  storefront    │  (Bagisto GraphQL   │  backend       │  │
│  │  (Next.js 16)  │   Extension)        │  (Laravel 12   │  │
│  └────────────────┘                     │   / Bagisto)   │  │
│                                         │                │  │
│  ┌────────────────┐    [Planned REST]   │  MySQL 8       │  │
│  │  sendra-gold-  │◄────────────────────│  Redis         │  │
│  │  franchise     │  (currently uses    │  Elasticsearch │  │
│  │  (Vite/React)  │   localStorage)     │  7.17          │  │
│  └────────────────┘                     └────────────────┘  │
│         │                                                    │
│    localStorage                                              │
│    (offline-first)                                           │
└──────────────────────────────────────────────────────────────┘
```

### Sub-Project Relationships

- **`sendra-backend` → `sendra-storefront`**: The storefront is a fully headless Next.js app. It calls the Bagisto GraphQL API (exposed via the Bagisto Headless Extension, API v1.0.3) for all data — products, categories, cart, checkout, customer auth. It proxies client-side GraphQL calls through a Next.js API route (`/api/graphql`) to avoid CORS and hide the storefront key.
- **`sendra-backend` → `sendra-gold-franchise`**: The franchise portal is a **locally-stateful SPA** — all data currently lives in `localStorage` with seeded initial data. It references the backend only through `APP_URL` env var (and `GEMINI_API_KEY` for Gemini AI calls). No live API integration is implemented yet.
- **`sendra-storefront` ↔ `sendra-gold-franchise`**: No direct code sharing. Separate applications with independent type definitions covering overlapping domain concepts.

---

## 2. Backend Architecture (`sendra-backend`)

### 2.1 Platform Foundation

Built on **Bagisto 2.4.x** — an open-source Laravel e-commerce framework. The root `app/` directory is a **thin Laravel shell** (only `Controller.php` and `Providers/`); all business logic lives in ~40 Webkul packages.

**Core stack:**
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

All core functionality lives in `packages/Webkul/` — **40 packages**, each a self-contained Laravel module:

```
packages/Webkul/
├── Admin/           # Admin panel (controllers, Blade views, DataGrids, reporting)
├── Shop/            # Customer storefront (Blade + API controllers)
├── Core/            # Helpers, models, exchange rates, ACL, menus, system config
├── Product/         # Product models, types, repositories, indexers
├── Sales/           # Orders, invoices, shipments, refunds
├── Checkout/        # Cart + checkout flow
├── Customer/        # Customer models, auth, captcha
├── Category/        # Category tree (nested-set via kalnoy/nestedset)
├── Attribute/       # EAV attribute system
├── Inventory/       # Stock management
├── Payment/         # Base payment classes (COD, MoneyTransfer)
├── Paypal/          # PayPal (paypal/paypal-server-sdk)
├── Stripe/          # Stripe (stripe/stripe-php ^17)
├── Razorpay/        # Razorpay integration
├── PayU/            # PayU integration
├── PhonePe/         # PhonePe integration
├── Shipping/        # Base shipping carriers
├── Tax/             # Tax calculation
├── CartRule/        # Cart promotion rules
├── CatalogRule/     # Catalog price rules
├── Marketing/       # SEO, URL rewrites, search terms, campaigns
├── CMS/             # CMS pages
├── DataGrid/        # Admin server-side data table component
├── DataTransfer/    # Import/export (maatwebsite/excel)
├── MagicAI/         # AI features (laravel/ai ^0.2.2)
├── Notification/    # Notifications
├── BookingProduct/  # Booking product type
├── RMA/             # Return merchandise authorization
├── GDPR/            # GDPR compliance
├── EUWithdrawal/    # EU withdrawal rights
├── SocialLogin/     # OAuth (laravel/socialite)
├── SocialShare/     # Social share buttons
├── FPC/             # Full-page cache (spatie/laravel-responsecache)
├── ImageCache/      # Image caching/resizing (intervention/image)
├── Sitemap/         # XML sitemap (spatie/laravel-sitemap)
├── Theme/           # Theme management
├── User/            # Admin user management
└── Installer/       # Installation wizard
```

**Package registration — dual system:**
1. `bootstrap/providers.php` — main `ServiceProvider` (routes, views, events, config)
2. `config/concord.php` — `ModuleServiceProvider` (Konekt Concord model/enum registration)

### 2.3 Key Design Patterns

#### Repository Pattern
All database access goes through **Prettus L5 repositories** (`prettus/l5-repository`). Controllers never query models directly. Each domain entity has:
- `Contracts/` — PHP interface (e.g., `Webkul\Product\Contracts\Product`)
- `Models/` — Eloquent model implementation
- `Repositories/` — Repository extending `Webkul\Core\Eloquent\Repository`

#### Proxy Pattern (Concord Model Substitution)
Every model has a `*Proxy` class (e.g., `ProductProxy`, `OrderProxy`) allowing model class substitution without modifying core packages. Proxies resolve through Concord's binding system.

#### Event-Driven Architecture
Laravel events fired at lifecycle hooks (product created, order placed, cart updated). Listeners in each package's `Listeners/` extend functionality non-invasively.

#### EAV (Entity-Attribute-Value) for Products
The `Attribute` package implements a full EAV system. `ProductAttributeValue` stores per-product attribute values. `ProductFlat` maintains a denormalized flat table for query performance.

#### DataGrid System
The `DataGrid` package provides server-side paginated/filterable/sortable table components. Controllers detect `request()->ajax()` and delegate to `datagrid(XxxDataGrid::class)->process()`.

### 2.4 Routing Architecture

The root `routes/web.php` is **minimal** (essentially empty). Each package registers its own routes via its ServiceProvider:

| Route Group | Middleware | Prefix | Source |
|---|---|---|---|
| Admin web routes | `['web', 'admin']` | `config('app.admin_url')` (default: `admin`) | `Admin/src/Routes/*.php` |
| Shop web routes | `['web', 'locale', 'theme', 'currency']` | `/` | `Shop/src/Routes/*.php` |
| Shop API routes | `['web', 'locale', 'theme', 'currency']` | `/api` | `Shop/src/Routes/api.php` |

**Admin route files:** `auth-routes.php`, `catalog-routes.php`, `cms-routes.php`, `configuration-routes.php`, `customers-routes.php`, `marketing-routes.php`, `notification-routes.php`, `reporting-routes.php`, `rest-routes.php`, `sales-routes.php`, `settings-routes.php`

**Shop REST API endpoints (partial):**
- `GET /api/categories` — Category listing + tree
- `GET /api/products` — Product listing
- `POST /api/checkout/cart` — Add to cart
- `POST /api/checkout/onepage/orders` — Place order
- `POST /api/customer/login` — Customer authentication
- `GET /api/customer/wishlist` — Wishlist (auth required)
- `GET /api/customer/addresses` — Addresses (auth required)

### 2.5 Authentication & Authorization

**Admin authentication:**
- Session-based via `admin` middleware group
- Optional 2FA (TOTP via `pragmarx/google2fa`)
- ACL system in `Core/Acl.php` controlling menu visibility and resource access

**Customer authentication:**
- Session-based for Blade storefront (session driver: `database`)
- Token-based (Laravel Sanctum) for the headless GraphQL API
- Social login via `SocialLogin` package (Laravel Socialite)
- Storefront key (`X-STOREFRONT-KEY` header) for Next.js SSR calls

### 2.6 Infrastructure (Docker / Development)

`docker-compose.yml` defines **Laravel Sail** services:
- `laravel.test` — PHP 8.3 application server
- `mysql` — MySQL 8.0
- `redis` — Redis (Alpine)
- `elasticsearch` — Elasticsearch 7.17.0
- `kibana` — Kibana 7.17.0
- `mailpit` — SMTP mail catcher

Full-page caching via `spatie/laravel-responsecache` (`RESPONSE_CACHE_ENABLED=true`).

---

## 3. Storefront Architecture (`sendra-storefront`)

### 3.1 Platform & Rendering Strategy

**Next.js 16**, React 19, TypeScript. Configured as `output: 'standalone'` for containerized deployment.

| Strategy | Used For | Implementation |
|---|---|---|
| **ISR** (Incremental Static Regeneration) | Home page, product listings | `export const revalidate = 3600` |
| **SSR** (Server-Side Rendering) | Dynamic pages, cart, checkout | Async server components |
| **CSR** (Client-Side Rendering) | Interactive cart mutations, auth-protected pages | Client components with Apollo |

### 3.2 Data Layer — GraphQL + Apollo

The storefront communicates **exclusively via GraphQL** to the Bagisto backend:

```
Server Component (SSR)          Client Component (CSR)
        |                               |
        v                               v
 graphqlRequest()             ApolloWrapper (client)
  (server-side)                        |
        |                              v
        v                    initializeApollo()
 Apollo InMemoryCache          (/api/graphql proxy)
  (network-only SSR)                   |
        |                              v
        v                     Bagisto Backend
 next/unstable_cache           (GraphQL endpoint)
  (Next.js data cache)
```

**Key GraphQL utilities:**
- `src/lib/apollo-client.ts` — `createApolloClient()`. SSR: uses `X-STOREFRONT-KEY` + direct `GRAPHQL_URL`. CSR: routes through `/api/graphql` proxy.
- `src/lib/graphql-fetch.ts` — `graphqlRequest()`: wraps Apollo with `unstable_cache` for ISR. Supports `CacheLifeOption` presets (`seconds`=10s, `minutes`=60s, `hours`=3600s, `days`=86400s, `weeks`=604800s).
- `src/app/api/graphql/` — Next.js API route proxying GraphQL (hides backend URL + storefront key from browser)

**GraphQL operation organization** (`src/graphql/`):
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

**Redux Toolkit** for client-side state:

| Slice | State | Purpose |
|---|---|---|
| `cartDetail` | `cart`, `billingAddress`, `shippingAddress` | Cart items and checkout address state |
| `user` | user session info | Logged-in user state |

**Provider stack:**
```
ThemeProvider → ReduxProvider → ToastProvider → ApolloWrapper → {children}
```

### 3.5 Routing (Next.js App Router)

```
src/app/
├── layout.tsx                  # Root layout (font, GlobalProviders, ErrorBoundary)
├── (public)/                   # Route group — main public store
│   ├── layout.tsx              # Public layout (header, footer)
│   ├── page.tsx                # Home page (ISR, revalidate: 3600s)
│   ├── [page]/                 # CMS / dynamic pages
│   ├── product/
│   │   └── [...urlProduct]/    # Product detail (catch-all slug)
│   ├── search/                 # Search results
│   ├── success/                # Order success
│   └── customer/
│       ├── login/
│       ├── register/
│       └── forget-password/
├── (checkout)/                 # Route group — checkout flow
│   └── checkout/               # Multi-step checkout
└── api/
    ├── auth/                   # NextAuth API routes
    ├── graphql/                # GraphQL proxy endpoint
    └── revalidate/             # ISR revalidation webhook
```

---

## 4. Franchise Portal Architecture (`sendra-gold-franchise`)

### 4.1 Platform

**Vite 6** + React 19 + TypeScript. Single-page application (SPA). Originally scaffolded from Google AI Studio (Apache-2.0 license).

### 4.2 Application Architecture — Role-Based Portal

```
App.tsx
└── PlatformProvider (React Context — single global state store)
    └── AppContent
        ├── Header          # Brand nav, role switcher
        ├── CustomerPortal  # role === "customer"  (69KB component)
        ├── StaffPortal     # role === "executive" | "manager"  (67KB)
        └── AdminPortal     # role === "admin"  (56KB)
```

### 4.3 Role Model

| Role | Access |
|---|---|
| `customer` | Browse products, cart, orders, wishlist, book buyback appointments |
| `executive` | Customer ops + KYC upload, gold testing, ticket management |
| `manager` | Executive ops + approve/reject buyback tickets |
| `admin` | Full access: branch management, staff, gold rate overrides, audit logs |

### 4.4 State Management — Single Context + localStorage

`PlatformContext` (`src/context/PlatformContext.tsx`) manages all application state. All state persisted to `localStorage` under `sg_*` keys. Initial data seeded from `src/data/initialData.ts`.

**State domains managed:**
- Auth simulation (role, staffId, branchId)
- Connectivity (isOnline, offlineQueue)
- Branch master data
- Gold rates (24K/22K/18K buy/sell per gram, 2-min auto-refresh ticker)
- Products, cart, wishlist, orders
- Buyback tickets (full workflow state machine)
- Immutable audit log

### 4.5 Business Domain (Gold Jewellery Specific)

Domain types (`src/types.ts`):
- `GoldRates` — 24K/22K/18K buy/sell rates with `isOverride` flag
- `Product` — weight (grams), makingCharge, category (`Jewellery` | `Coins` | `Bars`)
- `BuybackTicket` — Workflow: `appointment_booked → kyc_pending → testing_pending → approval_pending → approved/rejected → completed`
- `KYCDocuments` — Aadhaar, PAN, customer photo with encryption marker
- `AuditLogEntry` — Immutable action audit trail

### 4.6 KYC Security (Simulation)

`src/lib/encryption.ts` simulates KYC encryption:
- `encryptKYCData()` — Base64 + `SECURE_ENC_AES256::` marker (NOT real AES)
- `decryptKYCData()` — Reverses transformation
- `maskSensitiveValue()` — Display masking for Aadhaar/PAN

> **Technical Debt**: Encryption is a UI simulation using base64. Real AES-256-GCM (Web Crypto API or server-side) is required before handling actual KYC data.

---

## 5. Cross-Project Communication Patterns

### 5.1 Storefront → Backend (GraphQL over HTTPS)

```
Next.js SSR:  graphqlRequest() → Apollo → POST /graphql
              headers: X-STOREFRONT-KEY: pk_storefront_***

Next.js CSR:  ApolloClient → POST /api/graphql (Next.js proxy)
              headers: Authorization: Bearer <accessToken | guestToken>
                    → proxied to Bagisto GraphQL endpoint
```

### 5.2 Franchise → Backend (Planned)

- `APP_URL` env var points to backend; no API calls implemented yet
- `GEMINI_API_KEY` enables direct Gemini AI calls from client

---

## 6. Authentication Architecture Summary

| Layer | Mechanism | Token Type |
|---|---|---|
| Admin panel | Laravel session + optional 2FA | Session cookie |
| Blade storefront | Laravel session | Session cookie |
| Headless storefront (SSR) | Bagisto Storefront Key | `X-STOREFRONT-KEY` header |
| Headless storefront (CSR) | NextAuth.js ↔ Bagisto Bearer | `Authorization: Bearer` |
| Guest shopping (CSR) | Cart token in localStorage | `Authorization: Bearer` (guest) |
| Franchise portal | Role simulation via localStorage | `sg_role` localStorage key |

---

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
