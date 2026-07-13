# Roadmap: Sendra Gold

## Overview

This roadmap details the implementation strategy for the Sendra Gold platform. It starts with setting up the default whitelabel code of Bagisto, storefront styling, and container renaming, followed by client authentication, portals mapping, old gold appraisal, administrative dashboards, and native mobile wrappers.

## Phases

- [x] **Phase 1: Whitelabel Setup, Styling & Naming** - Sync luxury gold theme, and rename "bagisto" to "sendra" in docker, git, and configuration files. No new functional features.
- [ ] **Phase 2: Client Web Authentication** - Implement phone number + referral ID verification for customer web storefront.
- [ ] **Phase 3: Franchise & Channel Partner Portals** - Ledger mapping, expense tracking, and T1/T2 commission referral overrides.
- [ ] **Phase 4: Old Gold Purchase System** - Custom appraisal checkpoints, purity calculator, and receipt generation workflows.
- [ ] **Phase 5: Unified Admin Control & Dashboard** - Centralized management interface for approval of payouts, expenses, and transaction logs.
- [ ] **Phase 6: Client Mobile App Wrapper** - Scaffold Flutter mobile app using cloned repo and set up Android/iOS wrappers.

## Phase Details

### Phase 1: Whitelabel Setup, Styling & Naming

**Goal**: Set up default whitelabel settings, align storefront design elements with the franchise gold theme, and rename all system configurations.
**Depends on**: Nothing
**Requirements**: None (pre-requisite setup)
**Success Criteria**:

  1. Storefront branding colors (gold `#C5A059`, etc.) match the franchise design.
  2. All occurrences of "bagisto" in docker-compose, configs, and repository names are changed to "sendra".

**Plans**: 1 plan

Plans:

- [x] 01-01: Synchronize branding colors and rename container/git references.

### Phase 01.1: fix the admin panel (Laravel error: Route [shop.home.index] not defined in bottom.blade.php:13 — admin login returns 500) (INSERTED)

**Goal:** [Urgent work - to be planned]
**Requirements**: TBD
**Depends on:** Phase 1
**Plans:** 0 plans

Plans:

- [ ] TBD (run /gsd-plan-phase 01.1 to break down)

### Phase 2: Client Web Authentication

**Goal**: Implement a referral gate for customer accounts and update next-auth flows.
**Depends on**: Phase 1
**Requirements**: [APP-01, APP-02]
**Success Criteria**:

  1. User cannot register or enter the app without entering a valid referral ID.
  2. Next-Auth credentials provider handles simulated OTP login.

**Plans**: 1 plan

Plans:

- [ ] 02-01: Build customer registration referral validations and mock OTP login integrations.

### Phase 3: Franchise & Channel Partner Portals

**Goal**: Launch the partner dashboard tracking ₹1 Cr / ₹1 Lakh security deposits, ledgers, and overrides.
**Depends on**: Phase 2
**Requirements**: [FRAN-01, FRAN-02, FRAN-03, FRAN-04, CP-01, CP-02, CP-03, CP-04]
**Success Criteria**:

  1. Admin can register franchisee branches and associate them with operational ledger entries.
  2. Promoters can view their T1 and T2 tier structures and calculate override payouts.
  3. Fixed monthly revenue shares (1%) are calculated automatically based on security deposits.

**Plans**: 2 plans

Plans:

- [ ] 03-01: Implement Franchisee branch tracking, turnover recording, and expense ledgers.
- [ ] 03-02: Implement Channel Partner network portal, tier mappings, and T1/T2 commission override rules.

### Phase 4: Old Gold Purchase System

**Goal**: Build the old gold purchase entry and appraisal verification flow.
**Depends on**: Phase 3
**Requirements**: [GOLD-01, GOLD-02, GOLD-03]
**Success Criteria**:

  1. Appraisers can document gold purity (Karat) and evaluate weight against current gold market feed.
  2. Transaction checklist is fully filled before purchase receipt is generated.

**Plans**: 1 plan

Plans:

- [ ] 04-01: Build old gold purchase wizard, appraisal verification checklists, and billing receipt generation.

### Phase 5: Unified Admin Control & Dashboard

**Goal**: Deploy the central administrative dashboard for overall visibility and approval actions.
**Depends on**: Phase 4
**Requirements**: [ADM-01, ADM-02, ADM-03]
**Success Criteria**:

  1. System administrators can approve or reject branch expense ledger entries.
  2. Payouts and override commissions are shown in real-time dashboards.
  3. Old gold transaction evaluations can be reviewed and approved before disbursement.

**Plans**: 1 plan

Plans:

- [ ] 05-01: Create consolidated admin control tables, charts, and transaction approval flows.

### Phase 6: Client Mobile App Wrapper

**Goal**: Scaffolding the Flutter mobile app using the cloned repository base.
**Depends on**: Phase 5
**Requirements**: [APP-03]
**Success Criteria**:

  1. Mobile app builds and launches on simulators/devices, connecting successfully to the backend API.
  2. Offline capabilities and PWA settings are verified.

**Plans**: 1 plan

Plans:

- [ ] 06-01: Configure sendra-mobile-app Flutter settings and deploy native client wrappers.

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Whitelabel Setup, Styling & Naming | 1/1 | Completed | 2026-07-11 |
| 2. Client Web Authentication | 0/1 | Not started | - |
| 3. Franchise & Channel Partner Portals | 0/2 | Not started | - |
| 4. Old Gold Purchase System | 0/1 | Not started | - |
| 5. Unified Admin Control & Dashboard | 0/1 | Not started | - |
| 6. Client Mobile App Wrapper | 0/1 | Not started | - |
