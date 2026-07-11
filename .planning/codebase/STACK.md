# TECH STACK — Sendra Gold
_Last updated: 2026-07-11_

## Overview

The Sendra Gold project is composed of three independent sub-projects with distinct tech stacks:

| Sub-project | Role | Primary Language | Framework |
|---|---|---|---|
| `sendra-backend/` | E-commerce API & Admin | PHP 8.3 | Laravel 12 (Bagisto) |
| `sendra-storefront/` | Customer Storefront | TypeScript | Next.js 16 |
| `sendra-gold-franchise/` | Franchise Staff Portal | TypeScript | Vite 6 + React 19 |

---

## 1. sendra-backend — Laravel/Bagisto API

### Language & Runtime
- **PHP** `^8.3` (strict minimum)
- **PHP Extensions required:** `calendar`, `curl`, `intl`, `mbstring`, `openssl`, `pdo`, `pdo_mysql`, `tokenizer`
- **Composer** `v2` (package manager)
- **Node.js / npm** — used for front-end asset building (Vite)

### Framework
- **Laravel** `^12.0` — primary MVC framework
- **Bagisto** (open-source) — e-commerce layer built on Laravel; the project is a fork/extension of `bagisto/bagisto`
  - Modular architecture via Webkul packages (40 modules under `packages/Webkul/`)

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

---

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
```
"dev":     "next dev"
"build":   "NODE_ENV=production next build"
"start":   "next start"
"lint":    "eslint ."
"lint:fix":"next lint --fix"
```

### Next.js Config Highlights
- `reactStrictMode: true`
- `output: 'standalone'`
- `experimental.serverActions.bodySizeLimit: "2mb"`
- `compress: true`
- File: `next.config.ts`

---

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
```
"dev":     "vite --port=3000 --host=0.0.0.0"
"build":   "vite build"
"preview": "vite preview"
"clean":   "rm -rf dist server.js"
"lint":    "tsc --noEmit"
```
> **Note:** Linting is TypeScript `tsc --noEmit` only — no ESLint configured.

### Vite Configuration Highlights
- Plugins: `@vitejs/plugin-react` + `@tailwindcss/vite`
- Path alias: `@` → project root
- HMR disabled when `DISABLE_HMR=true` (AI Studio cloud environment detection)
- File: `vite.config.ts`

---

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
  - Stage 1 `builder`: `npm ci` + `npm run build`
  - Stage 2 `runner`: Copies `.next/standalone`, serves on port `3001`

### CI/CD — GitHub Actions (sendra-backend)

| Workflow | Trigger | Description |
|---|---|---|
| `pest_tests.yml` | push / PR | Pest unit & feature tests (PHP 8.3 + MySQL 8.0) |
| `pint_tests.yml` | push / PR | Code style check via `laravel/pint --test` |
| `admin_playwright_tests.yml` | push / PR | E2E Playwright tests (Chromium, 10 shards, Node 22.13.1) |
| `shop_playwright_tests.yml` | push / PR | E2E shop tests (same pattern) |
| `docker_publish.yml` | `v*` tag / manual | Multi-arch (amd64 + arm64) Docker image → Docker Hub `webkul/bagisto` |
| `translation_tests.yml` | push / PR | Language file validation |

> No CI/CD workflows found in `sendra-storefront/` or `sendra-gold-franchise/`.

---

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

---

## Quick Reference Summary

```
sendra-backend/
  PHP 8.3 · Laravel 12 · Bagisto (40 Webkul modules)
  MySQL 8 · Redis · Elasticsearch 7.17
  Docker Sail (dev) · Custom prod Dockerfile
  CI: Pest, Pint, Playwright, Docker publish (GitHub Actions)

sendra-storefront/
  TypeScript · Next.js 16 · React 19 (App Router, standalone)
  Apollo Client (GraphQL) · Redux Toolkit · next-auth
  Tailwind CSS v4 · HeroUI · Framer Motion
  Docker: node:22-alpine, multi-stage, port 3001

sendra-gold-franchise/
  TypeScript · Vite 6 · React 19 · Express.js
  Google Gemini AI SDK (@google/genai ^2.4)
  Tailwind CSS v4 · Lucide · Motion
  No CI/CD configured
```
