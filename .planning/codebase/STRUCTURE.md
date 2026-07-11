# STRUCTURE
_Last updated: 2026-07-11_

## Overview
This document maps the physical structure of the "Sendra Gold" project codebase, detailing directories, key files, entry points, and configuration setups for each of the three major sub-projects:
1. `sendra-backend/` (Laravel PHP API)
2. `sendra-storefront/` (Next.js Storefront)
3. `sendra-gold-franchise/` (Vite/TypeScript Portal)

---

## 1. sendra-backend (Laravel Core Backend)

### Directory Tree
```
sendra-backend/
├── app/                      # Application core code
│   ├── Http/                 # HTTP layer (Controllers, Middleware, Requests)
│   └── Providers/            # Service Providers
├── bootstrap/                # Application bootstrapping & cache
├── config/                   # Laravel configurations
├── database/                 # Migrations, seeders, factories
├── lang/                     # Localization resources
├── packages/                 # Modular custom packages (Webkul/*)
│   └── Webkul/               # Package namespace
│       ├── Admin/            # Admin package
│       ├── Shop/             # Shop package
│       ├── Core/             # Core utility package
│       └── ... (37+ packages)
├── public/                   # Publicly accessible web entry (index.php, assets)
├── resources/                # Blade views, raw assets (JS, CSS)
├── routes/                   # Routing declarations (web.php, console.php)
├── storage/                  # App files, cache, logs
└── tests/                    # Backend testing suites (Pest, PHPUnit)
```

### Key Files & Entry Points
*   **Web Entry:** `public/index.php` bootstraps the framework.
*   **Console Entry:** `artisan` handles CLI commands.
*   **Kernel & Bootstrap Configuration:** `bootstrap/app.php` configures routing, middleware, and exception handling.
*   **Configuration Files:** Located in `config/` (e.g. `app.php`, `database.php`, `cors.php`, `ai.php`, `services.php`).
*   **Modular Webkul Packages:** Custom logic is segmented under `packages/Webkul/` (e.g. `Admin`, `Shop`, `Core`, payment modules like `PayU`, `PhonePe`, `Razorpay`, `Stripe`). Each package acts as a micro-Laravel module with its own `src/`, `composer.json`, routes, views, and migrations.

---

## 2. sendra-storefront (Next.js Frontend Storefront)

### Directory Tree
```
sendra-storefront/
├── @types/                   # TypeScript ambient declarations (next-auth, graphql)
├── public/                   # Public assets (images, favicon)
└── src/                      # Source directory
    ├── app/                  # Next.js App Router (Layouts, pages, route handlers)
    │   ├── (checkout)/       # Checkout layouts & page grouping
    │   ├── (public)/         # Main public shop routes (product, search, profile)
    │   ├── api/              # API route handlers (auth, graphql proxy, revalidation)
    │   └── globals.css       # Global styling entry
    ├── components/           # Reusable UI components
    ├── graphql/              # GraphQL queries, mutations, and code-generated files
    ├── lib/                  # Library initializations (e.g. Apollo Client)
    ├── providers/            # React context providers (Redux, Auth, Apollo)
    ├── store/                # Redux Toolkit global state store
    ├── types/                # Core domain TypeScript types
    └── utils/                # Helper utilities & proxy helpers
```

### Key Files & Entry Points
*   **Next.js Entry:** Starts via `src/app/layout.tsx` and `src/app/(public)/page.tsx`.
*   **GraphQL API Proxy:** `src/proxy.ts` and `src/app/api/graphql/route.ts` act as proxy endpoints to shield backend details.
*   **Main Configuration:** `next.config.ts` controls bundler configuration, rewrites, and optimization options.
*   **Tooling Configs:** `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`.

---

## 3. sendra-gold-franchise (Vite/TypeScript Franchise Portal)

### Directory Tree
```
sendra-gold-franchise/
├── assets/                   # Static application assets
└── src/                      # Source directory
    ├── components/           # Portal dashboards (Customer, Staff, Admin)
    ├── context/              # Context providers (PlatformContext)
    ├── data/                 # Static mock data / initial data sets
    ├── lib/                  # Core library functions (encryption utils)
    ├── App.tsx               # Primary application view routing & controller
    ├── index.css             # Main styling entry
    ├── main.tsx              # Application mount point (React root entry)
    └── types.ts              # Global type definitions
```

### Key Files & Entry Points
*   **HTML Entry:** `index.html` at root loads the module entry `src/main.tsx`.
*   **React Entry:** `src/main.tsx` mounts the application.
*   **View Orchestrator:** `src/App.tsx` routes users to specific dashboards based on selected portal view (Customer, Staff, Admin).
*   **Main Dashboards:**
    *   `src/components/CustomerPortal.tsx`
    *   `src/components/AdminPortal.tsx`
    *   `src/components/StaffPortal.tsx`
*   **Configuration Files:** `tsconfig.json`, `vite.config.ts`, and metadata in `metadata.json`.
