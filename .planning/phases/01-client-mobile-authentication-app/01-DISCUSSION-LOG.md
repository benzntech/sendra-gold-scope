# Phase 1: Client Mobile Authentication & App - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-11
**Phase:** 01-client-mobile-authentication-app
**Areas discussed:** OTP Authentication, Client Mobile App Structure, Backend Auth Support, Franchise Mobile Configurations

---

## OTP Authentication

| Option | Description | Selected |
|--------|-------------|----------|
| Option A | Actual SMS/OTP Integration (requires SMS gateway details) | |
| Option B | Mock OTP flow for Phase 1 (instant verification for development) | ✓ |

**User's choice:** Option B (Mock OTP flow for Phase 1).
**Notes:** Decided to use simulated validation for quick feedback during early development.

---

## Client Mobile App Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Option A | PWA (Progressive Web App) approach (Manifest, Service Worker, and direct Next.js responsive views) | |
| Option B | Scaffolding a Capacitor/Cordova wrapper project around the Next.js build | |
| Custom | Use Flutter Open Source app from bagisto/opensource-ecommerce-mobile-app | ✓ |

**User's choice:** Custom - Use Flutter Open Source app.
**Notes:** Cloned `https://github.com/bagisto/opensource-ecommerce-mobile-app` into `sendra-mobile-app` directory to build the client-side customer mobile e-commerce client on top.

---

## Backend Auth Support

| Option | Description | Selected |
|--------|-------------|----------|
| Option A | Custom GraphQL endpoints/mutations in Bagisto (Laravel backend) for mobile number and referral code check | ✓ |
| Option B | Dedicated REST API endpoints in Laravel backend specifically for the mobile app authentication | |

**User's choice:** Option A.
**Notes:** Custom GraphQL mutations match the established storefront and API architecture.

---

## Franchise Mobile Configurations

| Option | Description | Selected |
|--------|-------------|----------|
| Option A | Strictly focus on storefront PWA configurations in Phase 1 | |
| Option B | Configure PWA/mobile capabilities for the franchise Vite app mobile app | ✓ |

**User's choice:** Option B.
**Notes:** PWA and mobile responsive configurations will be configured for the franchise portal Vite project.

---

## the agent's Discretion
- Input form design and validation logic.
- Simulated verification code screen layout.

## Deferred Ideas
- Production SMS gateway integration.
- Native build generation (.apk/.ipa files).

---

*Phase: 01-client-mobile-authentication-app*
*Discussion log generated: 2026-07-11*
