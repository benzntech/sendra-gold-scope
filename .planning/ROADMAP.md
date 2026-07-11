# Roadmap: Sendra Gold

## Overview

This roadmap details the implementation strategy for the Sendra Gold platform. It starts with client authentication and mobile capabilities, expands to branch/partner portal mapping, builds the custom old gold appraisal engine, and finishes with a unified dashboard for system administrators.

## Phases

- [ ] **Phase 1: Client Mobile Authentication & App** - Mobile number + referral verification and responsive storefront client wrapper configurations.
- [ ] **Phase 2: Franchise & Channel Partner Portals** - Ledger mapping, expense tracking, and T1/T2 commission referral overrides.
- [ ] **Phase 3: Old Gold Purchase System** - Custom appraisal checkpoints, purity calculator, and receipt generation workflows.
- [ ] **Phase 4: Unified Admin Control & Dashboard** - Centralized management interface for approval of payouts, expenses, and transaction logs.

## Phase Details

### Phase 1: Client Mobile Authentication & App
**Goal**: Deliver a secure registration flow requiring referral code mapping and wrap storefront views for seamless mobile layout.
**Depends on**: Nothing
**Requirements**: [APP-01, APP-02, APP-03]
**Success Criteria**:
  1. User cannot register or enter the app without entering a valid referral ID.
  2. Login via mobile number parses and matches verification state correctly.
  3. Customer storefront displays properly in mobile responsive layouts.
**Plans**: 1 plan

Plans:
- [ ] 01-01: Implement mobile registration, referral gates, and PWA configurations.

### Phase 2: Franchise & Channel Partner Portals
**Goal**: Launch the partner dashboard tracking ₹1 Cr / ₹1 Lakh security deposits, operational ledgers, and overrides.
**Depends on**: Phase 1
**Requirements**: [FRAN-01, FRAN-02, FRAN-03, FRAN-04, CP-01, CP-02, CP-03, CP-04]
**Success Criteria**:
  1. Admin can register franchisee branches and associate them with operational ledger entries.
  2. Promoters can view their T1 and T2 tier structures and calculate override payouts.
  3. Fixed monthly revenue shares (1%) are calculated automatically based on security deposits.
**Plans**: 2 plans

Plans:
- [ ] 02-01: Implement Franchisee branch tracking, turnover recording, and expense ledgers.
- [ ] 02-02: Implement Channel Partner network portal, tier mappings, and T1/T2 commission override rules.

### Phase 3: Old Gold Purchase System
**Goal**: Build the old gold purchase entry and appraisal verification flow.
**Depends on**: Phase 2
**Requirements**: [GOLD-01, GOLD-02, GOLD-03]
**Success Criteria**:
  1. Appraisers can document gold purity (Karat) and evaluate weight against current gold market feed.
  2. Transaction checklist is fully filled before purchase receipt is generated.
**Plans**: 1 plan

Plans:
- [ ] 03-01: Build old gold purchase wizard, appraisal verification checklists, and billing receipt generation.

### Phase 4: Unified Admin Control & Dashboard
**Goal**: Deploy the central administrative dashboard for overall visibility and approval actions.
**Depends on**: Phase 3
**Requirements**: [ADM-01, ADM-02, ADM-03]
**Success Criteria**:
  1. System administrators can approve or reject branch expense ledger entries.
  2. Payouts and override commissions are shown in real-time dashboards.
  3. Old gold transaction evaluations can be reviewed and approved before disbursement.
**Plans**: 1 plan

Plans:
- [ ] 04-01: Create consolidated admin control tables, charts, and transaction approval flows.

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Client Mobile Authentication & App | 0/1 | Not started | - |
| 2. Franchise & Channel Partner Portals | 0/2 | Not started | - |
| 3. Old Gold Purchase System | 0/1 | Not started | - |
| 4. Unified Admin Control & Dashboard | 0/1 | Not started | - |
