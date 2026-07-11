# CONCERNS
_Last updated: 2026-07-11_

## Overview

The Sendra Gold platform is an **early-stage MVP** with significant unresolved risks across all three sub-projects. The overall risk level is **HIGH**. The most critical concerns are:

- **Production secrets (admin credentials, SSH access) are stored in plaintext in the project scope document**, committed to the repo.
- The **franchise portal is a frontend-only demo** using `localStorage` as its database — no real backend, no real authentication, and fake encryption of sensitive KYC data.
- **No HTTPS** on either the storefront or the admin panel; both run over plain HTTP on a public EC2 IP.
- Significant missing features relative to the stated project scope (payments, checkout, mobile app, gold plan, KYC management).
- The backend is an off-the-shelf Bagisto install with minimal customization — virtually all product data was imported via raw SQL from a third-party competitor's API.

---

## Security Concerns

### 🔴 CRITICAL — Plaintext Credentials in Repository

**File:** `sendra-gold-project-scope.txt` (lines 17–18)

```
Admin:  http://13.140.136.162:8000/admin/login (admin@example.com / admin123)
SSH:    root@13.140.136.162 (default key, no PEM)
```

- Admin password `admin123` is the Bagisto default — it was never changed.
- Root SSH access is documented with the public IP address and described as using a "default key, no PEM."
- Both the EC2 IP, admin credentials, and SSH context are committed in a plaintext file at the repository root.
- **Risk:** Full server takeover and admin panel takeover are trivially possible for anyone with repo access.

### 🔴 CRITICAL — Franchise Portal: Fake Encryption of Real KYC Data

**File:** `sendra-gold-franchise/src/lib/encryption.ts`

```typescript
export function encryptKYCData(plainText: string): string {
  // In V1 production, this uses AES-256-GCM. We show a strict cryptographic mask:
  const encoded = btoa(unescape(encodeURIComponent(plainText)));
  return `SECURE_ENC_AES256::${encoded}::SHA256_HMAC`;
}
```

This function claims "AES-256-GCM" in the comment but actually performs **plain Base64 encoding** — trivially reversible. The app footer claims:

> "All private customer KYC records (UIDAI & Income Tax) encrypted 256-bit at rest."

This claim is **false**. Aadhaar numbers, PAN numbers, and customer photos are only Base64-encoded, not encrypted. This is a **UIDAI/DPDP Act compliance violation** if real customer data is ever entered.

### 🔴 CRITICAL — Franchise Portal: No Real Authentication

**File:** `sendra-gold-franchise/src/context/PlatformContext.tsx` (lines 96–104)

```typescript
const [currentRole, setCurrentRole] = useState<UserRole>(() => {
  return (localStorage.getItem("sg_role") as UserRole) || "customer";
});
```

Role selection (customer / executive / manager / admin) is stored in `localStorage` with no server-side validation. Any user can call `localStorage.setItem("sg_role", "admin")` in browser DevTools to gain admin access. No password or credential check exists.

### 🔴 CRITICAL — No HTTPS on Production

Both services run over plain HTTP:
- Storefront: `http://13.140.136.162:3001`
- Backend: `http://13.140.136.162:8000`

All customer data (login tokens, session cookies, cart data, checkout forms) is transmitted in cleartext. HTTPS setup is listed as "What's Left" in the scope doc.

### 🟠 HIGH — MySQL Exposed on Non-Standard Port with Empty Password Allowed

**File:** `sendra-backend/docker-compose.yml` (line 40)

```yaml
MYSQL_ALLOW_EMPTY_PASSWORD: 1
```

The development Docker Compose allows empty MySQL passwords. The database is mapped to port 3307 on the host. If the EC2 security group allows inbound on 3307, the database is directly accessible from the internet with no credentials.

### 🟠 HIGH — API Platform Config Patches Committed as Workarounds

**Files:** `sendra-backend/fix-api-config.php`, `sendra-backend/api-platform-fixed.php`

`fix-api-config.php` generates a PHP config file at runtime using `file_put_contents()` — a debugging patch sitting in the application root. `api-platform-fixed.php` is a hardcoded config dump with absolute Docker container paths (`/var/www/html/vendor/...`). These are unremoved debugging artifacts not part of any deployment pipeline.

### 🟠 HIGH — GraphQL Endpoint Fully Public — No Rate Limiting

**File:** `sendra-storefront/src/app/api/graphql/route.ts`

The Next.js GraphQL proxy has no rate limiting, IP throttling, query depth limiting, or request size limiting. This exposes all 43,527 products to bulk scraping and enables denial-of-service via query flooding.

### 🟠 HIGH — Revalidation Endpoint Returns HTTP 200 on Auth Failure

**File:** `sendra-storefront/src/utils/bagisto/index.ts` (lines 384–386)

```typescript
if (!secret || secret !== process.env.BAGISTO_REVALIDATION_SECRET) {
  return NextResponse.json({ status: 200 });  // Returns 200 on auth failure!
}
```

A failed authentication silently returns HTTP 200 instead of 401/403, masking security failures in logs and monitoring.

### 🟡 MEDIUM — Obfuscated Fingerprint String Injected into Page DOM

**File:** `sendra-storefront/src/app/layout.tsx` (line 12)

```typescript
const __lr = String.fromCharCode(100,115,118,45,50,48,50,53,46,48,52,46,49,57,45,55,101,50,57);
```

Decodes to `dsv-2025.04.19-7e29` — a version/tracking identifier injected as a hidden `<span>` into every page. The same pattern is in `helper.ts`. Likely a Bagisto storefront fingerprint inserted deliberately but obfuscated to prevent removal. Its purpose is undocumented.

### 🟡 MEDIUM — `next-auth` v4 Approaching End-of-Life

`next-auth` v4 is used while Auth.js v5 is the current stable release. JWT sessions can be forged if `NEXTAUTH_SECRET` was set to a weak/default value on the EC2 instance.

### 🟡 MEDIUM — APP_DEBUG=true in .env.example

**File:** `sendra-backend/.env.example` (line 4)

`APP_DEBUG=true` in the example file raises the risk the live deployment was never changed. Laravel in debug mode exposes full stack traces, SQL queries, and environment variables in error responses.

### 🟡 MEDIUM — Auto-Verification Bypasses Email Confirmation + Forced Newsletter

**File:** `sendra-storefront/src/utils/bagisto/index.ts` (lines 248–250)

```typescript
isVerified: "1",
isSuspended: "0",
subscribedToNewsLetter: true,
```

All new customer registrations auto-verify without email confirmation and silently opt into the newsletter. This is a potential DPDP Act / GDPR consent issue.

---

## Performance Concerns

### 🟠 HIGH — 2,500 Products Missing from GraphQL (~6% invisible)

Per scope document:
```
Products in DB:               43,527
Products served via GraphQL:  ~41,027
```

~2,500 products exist in the database but are not queryable. The scope identifies this as a possible indexing/attribute family issue — unresolved and actively costing searchable inventory.

### 🟠 HIGH — Next.js Image Optimization Disabled

**File:** `sendra-storefront/next.config.ts` (lines 11–12)

```typescript
images: {
  unoptimized: true,
  remotePatterns: [],
}
```

`unoptimized: true` disables WebP conversion, compression, and responsive sizing. With 77,653 image files at ~1200px wide, product pages serve full-resolution JPEGs to all devices including mobile. No CDN is configured.

### 🟠 HIGH — No Redis Caching in Production

**File:** `sendra-backend/.env.example`

```
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

Both cache and queue use file/sync drivers. For a 43,527-product catalogue with GraphQL, this will not scale. Redis is in docker-compose but not wired up.

### 🟡 MEDIUM — Search Page N+1 Cursor-Seek Pattern

**File:** `sendra-storefront/src/app/(public)/search/page.tsx` (lines 141–152)

When navigating to page >1 without a cursor, the page makes two sequential GraphQL requests: one to find the cursor position, then one for the actual results. This compounds with page depth.

### 🟡 MEDIUM — Franchise Portal: 10+ useEffect Hooks Writing to localStorage on Every State Change

**File:** `sendra-gold-franchise/src/context/PlatformContext.tsx` (lines 160–205)

All platform state serializes to `localStorage` on every change via 10+ `useEffect` hooks. JSON serialization/parsing of audit logs and orders at scale will cause increasing UI lag. `localStorage` is also capped at ~5-10MB.

### 🟡 MEDIUM — Elasticsearch 7.17.0 in Docker Compose — EOL Since Aug 2024

**File:** `sendra-backend/docker-compose.yml` (line 70)

Elasticsearch 7.17.0 and Kibana 7.17.0 are end-of-life. No security patches since August 2024. Elasticsearch client in `composer.json` is `^8.10` — version mismatch between client and server.

### 🟡 MEDIUM — `about-us` Page 4.1s SSR Response Time

Per scope doc: `/about-us` takes 4.1 seconds. A static content page at 4.1s indicates unoptimized backend queries or Docker cold-start latency. Direct Core Web Vitals (LCP/TTFB) impact.

---

## Architecture Concerns

### 🟠 HIGH — Franchise Portal Completely Disconnected from Backend

`sendra-gold-franchise` operates entirely in-browser with no API connection to `sendra-backend`. It has no shared auth, no shared data model, and no backend persistence. The franchise model document describes a live multi-branch platform handling real ₹1 crore deposits and buyback transactions. The current implementation cannot safely handle real money or real KYC data.

The `.env.example` for the franchise portal contains only `GEMINI_API_KEY` and `APP_URL` — no backend endpoint is referenced anywhere in the source.

### 🟠 HIGH — All Product Data Scraped from Third-Party Competitor

The scope explicitly documents that all 43,527 products were scraped from `darjewellery.com`'s internal API and all 77,653 images downloaded from their CDN. This represents:
- Potential copyright and IP infringement
- Terms of Service violation against DAR Jewellery
- Legal exposure for a commercial Indian e-commerce platform

### 🟠 HIGH — `removeEdgesAndNodes` is a No-Op

**File:** `sendra-storefront/src/utils/bagisto/index.ts` (lines 183–185)

```typescript
export const removeEdgesAndNodes = <T>(array: Array<T>) => {
  return array?.map((edge) => edge);
};
```

This function maps each element to itself — it does nothing. Likely intended to unwrap Relay `edge.node` objects but never correctly implemented. Used throughout the codebase.

### 🟠 HIGH — Magento Environment Variable in Bagisto Storefront

**File:** `sendra-storefront/src/utils/constants.ts` (line 174)

```typescript
export const imageProtocol = (process.env.NEXT_SERVER_MAGENTO_PROTOCOL || "https");
```

A variable named `NEXT_SERVER_MAGENTO_PROTOCOL` exists in a Bagisto-based storefront — a clear carry-over from a Magento commerce template that was never cleaned up.

### 🟡 MEDIUM — No Shared Deployment Config Across Sub-Projects

Three separate Docker configurations with no root-level orchestration:
- `sendra-backend` — Laravel Sail docker-compose (dev-oriented, includes Kibana, Mailpit)
- `sendra-storefront` — standalone Dockerfile
- `sendra-gold-franchise` — no Dockerfile at all

Container names referenced in the scope (`bagisto-app`, `bagisto-storefront`) don't match the docker-compose service names. Deployment is fully manual via SSH.

### 🟡 MEDIUM — Inconsistent GraphQL Error Response Shape

The proxy returns `{ data: null, error: ... }` with HTTP 200 for Bagisto errors, but `{ message: "Network error", error: ... }` with HTTP 500 for fetch failures. Client code must check both the HTTP status and the response body shape.

### 🟡 MEDIUM — Dead Code: Empty `OPERATION_TO_ROUTE_MAP`

**File:** `sendra-storefront/src/utils/constants.ts` (lines 52–53)

```typescript
export const OPERATION_TO_ROUTE_MAP: Record<string, string> = {
};
```

Exported but never populated — a stub never implemented.

---

## Technical Debt

### Patch Scripts Left in Repository Root

| File | Issue |
|------|-------|
| `sendra-backend/fix-api-config.php` | Runtime config generator using `file_put_contents()`; debugging workaround, not a proper config publish command |
| `sendra-backend/api-platform-fixed.php` | Hardcoded absolute Docker paths (`/var/www/html/...`); environment-specific dump committed to repo |

### Hardcoded Content — No CMS Editable

| Component | Hardcoded Content |
|-----------|-------------------|
| `AnnouncementBar.tsx` | 3 promotional offers, phone number `+91 9952433386` |
| `QuickShopCircles.tsx` | 12 category links with hardcoded VA badge percentages |
| `FeaturedCollage.tsx` | 5 category tiles with hardcoded gradient CSS values |

Changing any promotional content or phone number requires a code deploy.

### Dead Navigation Links Visible to Users

**File:** `sendra-storefront/src/components/home/AnnouncementBar.tsx` (lines 44–45)

```tsx
<a href="#">Store Locator</a>
<a href="#">Need support?</a>
```

Both links point to `#` — dead placeholders visible on every page.

### Franchise Package Identity Not Updated

**File:** `sendra-gold-franchise/package.json` (line 2)

Package name is `"react-example"` — the AI Studio template default, never updated to `"sendra-gold-franchise"`.

### Environment Variable Naming Inconsistency (Storefront)

`helper.ts` validates for `BAGISTO_STORE_DOMAIN` but `.env.example` uses `NEXT_PUBLIC_BAGISTO_ENDPOINT`. Two different variable names for the same concept — `BAGISTO_STORE_DOMAIN` is likely never set, meaning the validation never fires.

### Duplicate Apache-2.0 License Headers

**File:** `sendra-gold-franchise/src/App.tsx` (lines 1–9)

The license block appears twice consecutively.

### `CHECKOUT` Constants Use Wrong Tag Names (Copy-Paste Error)

**File:** `sendra-storefront/src/utils/constants.ts` (lines 24–28)

```typescript
export const CHECKOUT = {
  shipping: "collections",  // Should be "shipping" or similar
  method: "products",       // Should be "method" or similar
  cart: "cart",
};
```

`CHECKOUT.shipping` and `CHECKOUT.method` reference `"collections"` and `"products"` tags respectively — likely copied from the `TAGS` constant and never corrected.

---

## Missing Features vs Scope

| Scope Requirement | Status | Notes |
|---|---|---|
| **Payment Gateway** (Razorpay / UPI / COD) | ❌ Not integrated | Razorpay package in `composer.json` but unconfigured; checkout untested end-to-end |
| **Cart & Checkout** (end-to-end verified) | ⚠️ Partial | GraphQL proxy handles cart mutations; full checkout flow unverified |
| **Product Detail Pages** | ⚠️ Unknown | SSR route exists; scope says "verify" — not confirmed working |
| **Domain & HTTPS** | ❌ Missing | Running on bare EC2 IP over HTTP; no custom domain |
| **Mobile Responsiveness QA** | ❌ Not done | Explicitly listed as "What's Left" in scope |
| **SEO** (meta tags, structured data, sitemap) | ❌ Not done | `robots.ts` exists; product schema and real-domain sitemap not implemented |
| **CDN for product images** | ❌ Missing | Images served from EC2 disk; no CDN configured |
| **Redis caching** | ❌ Missing | File cache driver in use |
| **Admin panel external access** | ❌ Blocked | Port 8000 firewalled; requires SSH tunnel |
| **2,500 missing products indexing** | ❌ Unresolved | Root cause not investigated |
| **iOS & Android App** (franchise model doc) | ❌ Not started | Mobile app described as core requirement in franchise model |
| **Gold Plan page** (`/gold-plan`) | ⚠️ Placeholder | Route returns 200 but actual plan content unknown |
| **Old Gold Purchase / Buyback backend** | ❌ Demo only | Franchise portal is a localStorage prototype with no backend |
| **Channel Partner T1/T2 commission tracking** | ❌ Not started | Described in franchise model; no implementation |
| **Branch expense recording** | ❌ Not started | Core requirement per franchise model |
| **Lead management & transaction tracking** | ❌ Not started | Described in franchise model as part of "Business Tablet & Software Support" |

---

## Dependency Risks

### Backend (Laravel / Bagisto)

| Package | Version | Risk |
|---------|---------|------|
| `laravel/framework` | `^12.0` | Recent upgrade; stable |
| `elasticsearch/elasticsearch` | `^8.10` | Client v8 but Docker Compose runs ES **7.17.0** (EOL Aug 2024) — version mismatch |
| `intervention/image` | `^2.4\|^3.0` | Accepts either major version — inconsistent API surface risk |
| `barryvdh/laravel-debugbar` | `^3.8` | Dev-only package — must confirm not loaded in production |
| `QUEUE_CONNECTION=sync` | n/a | Not a package but a critical operational risk — synchronous queue blocks HTTP responses |

### Storefront (Next.js)

| Package | Version | Risk |
|---------|---------|------|
| `next` | `16.0.10` | Pinned exact version; will need manual updates |
| `next-auth` | `^4.24.13` | v4 approaching end-of-life; v5 (Auth.js) is successor |
| `@apollo/client` | `^3.14.0` | Used client-side only; server uses raw `fetch` — dual GraphQL approach |
| `framer-motion` | `^12.23.24` | Heavy bundle size for animation library |
| `@heroui/react` | `^2.8.6` | Second UI system alongside Tailwind — maintenance burden |

### Franchise Portal (Vite/React)

| Package | Version | Risk |
|---------|---------|------|
| `@google/genai` | `^2.4.0` | Gemini SDK in `dependencies` but never imported in any source file — dead dependency |
| `express` | `^4.21.2` | In `dependencies` (not devDependencies) but no Express server exists in src — phantom dependency |
| `vite` | `^6.2.3` | Listed in both `dependencies` AND `devDependencies` — duplication |

---

## Operational Concerns

### No Production Logging or Monitoring

No error monitoring (Sentry, Bugsnag, etc.), no log aggregation, no uptime alerting, and no health-check endpoints. All failure investigation requires manual SSH access.

### Manual Deployment with No CI/CD

Per scope: "Code pushed to GitHub → pulled on EC2 → Docker rebuilt" — fully manual. No GitHub Actions pipeline, no automated tests before deploy, no rollback mechanism. The storefront previously ran a 10-day-old stale build before anyone noticed (Phase 9).

### Synchronous Queue Blocks HTTP Responses

`QUEUE_CONNECTION=sync` means email notifications and order processing run inside the HTTP request cycle, blocking responses and causing timeouts under load.

### No Backup Strategy Documented

43,527 products and all categories are in a Docker MySQL volume with no documented backup schedule. The container has been running continuously for 13+ days with no evidence of verified backups.

### Storage Path Bug Root Cause Not Fixed

Phase 7 fixed image paths by manually copying 37,261 directories. The import script that wrote to the wrong path (`storage/app/public/app/public/...` instead of `storage/app/public/...`) was not corrected. A re-import will reproduce the bug.

### Admin Panel Operationally Blocked

Port 8000 is not accessible externally per EC2 security group. Routine operations (managing products, processing orders, configuring payments) all require SSH tunnel — a critical daily operational bottleneck.

---

## Cross-Cutting Concerns

### Inconsistent Currency Configuration

| Sub-project | Currency Setting |
|-------------|-----------------|
| `sendra-backend/.env.example` | `APP_CURRENCY=USD` |
| `sendra-storefront/src/utils/bagisto/index.ts` | `"x-currency": "USD"` (hardcoded) |
| `sendra-gold-franchise/src/data/initialData.ts` | INR values (₹7,200/gram for 24K gold) |

INR is clearly the intended currency for an India-based gold retailer, but USD is configured everywhere in the production stack.

### Three Incompatible Authentication Systems

| Sub-project | Auth Mechanism |
|-------------|---------------|
| `sendra-backend` | Bagisto JWT + Laravel Sanctum + 2FA |
| `sendra-storefront` | `next-auth` v4 bridging to Bagisto JWT |
| `sendra-gold-franchise` | `localStorage` role string — no real auth |

No SSO or shared identity. Storefront customers cannot be referenced in the franchise portal.

### No Shared Type Definitions

Each sub-project defines types independently. The `Order` type in the storefront and `Order` in the franchise portal have different structures with no shared schema or API contract.

### Competitor Images Served Publicly from EC2

77,653 images originally from DAR Jewellery CDN are served unauthenticated from EC2 storage. If indexed by search engines or shared externally, this creates both IP infringement exposure and unexpected bandwidth costs.

### SEO Foundation Incomplete

- No structured data (`Product`, `Organization`, `BreadcrumbList` JSON-LD)
- No sitemap for the actual Sendra Gold domain
- `about-us` page at 4.1s TTR directly impacts Core Web Vitals
- `og:image` for search pages references `/search-og.jpg` — existence unverified

---

_Document generated by codebase analysis of `/Volumes/External/bensonmac/Documents/BensonProject/sendragold` on 2026-07-11._
