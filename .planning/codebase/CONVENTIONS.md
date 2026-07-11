# Code Quality & Conventions
_Last updated: 2026-07-11_

## Overview

The Sendra Gold project comprises three sub-projects with distinct tech stacks and associated conventions. The backend (`sendra-backend`) is a Bagisto 2.4.x / Laravel 12 monorepo enforced by Laravel Pint and documented contribution guidelines. The storefront (`sendra-storefront`) is a Next.js 16 app with ESLint strict TypeScript rules. The franchise portal (`sendra-gold-franchise`) is a Vite/React/TypeScript SPA with no dedicated linter beyond TypeScript's compiler.

---

## 1. sendra-backend (Laravel/PHP)

### 1.1 Code Style & Formatting

**Tool:** Laravel Pint (`vendor/bin/pint`)
**Config file:** `sendra-backend/pint.json`

```json
{
    "preset": "laravel"
}
```

The `laravel` preset enforces:
- PSR-12 base standard extended with Laravel-specific rules
- Single-quoted strings preferred
- Space after keywords (`if (`, `foreach (`, etc.)
- Ordered imports (grouped: stdlib, vendor, internal)
- Trailing commas in function calls / arrays
- Short closure arrow functions where applicable

**EditorConfig:** `sendra-backend/.editorconfig`

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

**Pint commands:**
```bash
vendor/bin/pint              # Fix all files
vendor/bin/pint --dirty      # Fix changed files only
vendor/bin/pint --test       # Check only (used in CI)
```

### 1.2 PHP Standards

As documented in `CONTRIBUTING.md`:
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

All core functionality lives under `packages/Webkul/` using **PascalCase** package names (40 packages total):

```
packages/Webkul/
├── Admin/          ← Admin panel
├── Shop/           ← Customer storefront (Blade)
├── Core/           ← Shared helpers/models/jobs
├── Product/        ← PascalCase, singular concept
├── CartRule/       ← Compound words, no separator
├── CatalogRule/
├── DataGrid/
├── DataTransfer/
├── MagicAI/
├── SocialLogin/
├── EUWithdrawal/   ← Acronym then word
├── FPC/            ← All-caps acronym allowed
├── GDPR/
├── RMA/
└── CMS/
```

**Internal package structure** (every package follows this layout):
```
packages/Webkul/<Package>/src/
├── Config/           # system.php, admin-menu.php, acl.php
├── Contracts/        # Interfaces for each model
├── Database/
│   ├── Migrations/
│   ├── Factories/
│   └── Seeders/
├── DataGrids/        # Extends Webkul\DataGrid\DataGrid
├── Http/
│   ├── Controllers/
│   │   ├── Admin/
│   │   └── Shop/
│   ├── Middleware/
│   └── Requests/     # Form Request classes
├── Jobs/
├── Listeners/
├── Models/           # Eloquent models + Proxy classes
├── Observers/
├── Providers/
│   ├── <Name>ServiceProvider.php
│   └── ModuleServiceProvider.php
├── Repositories/
├── Resources/
│   ├── assets/       # Vite-compiled JS/CSS
│   ├── lang/         # 21 locale directories
│   └── views/        # Blade templates
├── Routes/
│   ├── admin-routes.php
│   └── shop-routes.php
└── Type/             # (Product package only) product type classes
```

### 1.5 PHPDoc / Comment Patterns

From `CONTRIBUTING.md`, the required PHPDoc format:

```php
/**
 * Register a service with CoreServiceProvider.
 *
 * @param  string|array  $loader
 * @param  \Closure|string|null  $concrete
 * @param  bool  $shared
 * @return void
 * @throws \Exception
 */
protected function registerFacades($loader, $concrete = null, $shared = false)
{
    //
}
```

Rules:
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

From `AGENTS.md`:
1. `vendor/bin/pint --dirty` — no style violations before commit
2. `php artisan test --compact` — affected tests must pass
3. `php artisan bagisto:translations:check` — all 21 locale files must be updated if keys change
4. No `env()` calls outside `config/` files
5. New models require: Contract + Model + Proxy + Repository (4 files minimum)
6. New packages must be registered in both `bootstrap/providers.php` AND `config/concord.php`

### 1.8 Git Workflow

From `CONTRIBUTING.md`:

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

---

## 2. sendra-storefront (Next.js)

### 2.1 Code Style & Formatting

**Tool:** ESLint 9 with Next.js config
**Config file:** `sendra-storefront/eslint.config.mjs`

Extends:
- `eslint-config-next/core-web-vitals` — Next.js performance & accessibility rules
- `eslint-config-next/typescript` — TypeScript-aware Next.js rules

**Custom rules applied to `src/**/*.{js,jsx,ts,tsx}`:**

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

**Ignored paths:** `.next/**`, `out/**`, `build/**`, `next-env.d.ts`

**ESLint commands:**
```bash
npm run lint        # eslint .
npm run lint:fix    # next lint --fix
```

### 2.2 TypeScript Configuration

From `tsconfig.json`:

| Option | Value |
|---|---|
| Target | ES2017 |
| Strict mode | **true** |
| Module | ESNext |
| Module resolution | bundler |
| JSX | react-jsx |
| Incremental compilation | yes |

**Path aliases:**
```
@components/* → ./src/components/*
@utils/*      → ./src/utils/*
@/*           → ./src/*
@lib/*        → ./lib/*
@graphql/*    → ./graphql/*
@types/*      → ./types/*
@store/*      → ./store/*
@provider/*   → ./provider/*
```

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

The storefront uses **GraphQL** (Apollo Client `^3.14`) to communicate with the backend:

```
src/graphql/
├── cart/       ← Cart-related queries & mutations
├── catalog/    ← Product/category queries
├── checkout/   ← Checkout flow mutations
├── customer/   ← Auth, account queries
├── theme/      ← Theme configuration queries
├── types/      ← Shared GraphQL type definitions
└── index.ts    ← Apollo Client setup
```

No REST API calls from the storefront — all data access is through GraphQL.

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

---

## 3. sendra-gold-franchise (Vite/React/TypeScript)

### 3.1 Code Style & Formatting

**No ESLint config present.** The `lint` script in `package.json` is:
```bash
"lint": "tsc --noEmit"
```

> **⚠ Technical Debt:** No ESLint or Prettier configured. "Linting" is TypeScript type-checking only — no code style enforcement exists for this sub-project.

### 3.2 TypeScript Configuration

From `tsconfig.json`:

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

**Path alias:** `@/*` → `./*` (root-relative)

> **⚠ Note:** No `strict: true` — looser type checking than the storefront.

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

```
src/
├── App.tsx             ← Root component with PlatformProvider
├── main.tsx            ← Vite entry point
├── types.ts            ← All domain TypeScript interfaces (single file)
├── index.css           ← Global styles + Tailwind directives
├── components/
│   ├── AdminPortal.tsx    ← ~55KB monolithic file
│   ├── CustomerPortal.tsx ← ~69KB monolithic file
│   ├── StaffPortal.tsx    ← ~67KB monolithic file
│   └── Header.tsx
├── context/
│   └── PlatformContext    ← Global state via React Context API
├── data/               ← Static mock/seed data
└── lib/                ← Utility functions
```

> **⚠ Technical Debt:** The three main portal components are extremely large monolithic files (55–69KB each) with no decomposition into sub-components.

### 3.5 Comment Patterns

All files start with a license header:
```ts
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
```

Inline comments: `// comment` style in TypeScript; `{/* comment */}` in JSX.

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

---

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

All three projects use `.env` with `.env.example` templates. Backend rule: `env()` calls only permitted inside `config/` files.
