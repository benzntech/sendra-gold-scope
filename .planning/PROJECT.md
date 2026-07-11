# Sendra Gold

## What This Is

Sendra Gold is a premium, fully branded online jewellery e-commerce platform and business ecosystem. It features a Next.js customer-facing storefront, a modular Laravel/Bagisto backend API, and a Vite-based Franchise and Channel Partner portal. The platform handles high-volume catalog search, retail sales, master franchise turnover tracking, channel partner commissions, and old gold purchasing with zero original platform branding leakage.

## Core Value

Provide a seamless, gold-backed business and shopping ecosystem that enables trusted master franchise operations, channel partner referral tracking, and secure consumer jewellery transactions.

## Business Context

- **Customer**: Retail jewellery shoppers, Master Franchise Partners (₹1 Cr deposit investors), and Channel Partners (₹1 Lakh deposit promoters).
- **Revenue model**: Direct jewellery e-commerce sales, master franchise refundable deposits with 1% monthly return & 0.5% turnover share, and channel partner programs with T1/T2 commission overrides.
- **Success metric**: 100% accuracy in franchise and channel partner business attribution, secure registration & referral authentication, and error-free old gold purchase processing.
- **Strategy notes**: Described in detail in [project Final Draft.docx](file:///Volumes/External/bensonmac/Documents/BensonProject/sendragold/project%20Final%20Draft.docx) and [sendra-gold-project-scope.txt](file:///Volumes/External/bensonmac/Documents/BensonProject/sendragold/sendra-gold-project-scope.txt).

## Requirements

### Validated

- ✓ **SYS-01**: Dual-container infrastructure running Bagisto 2.4 (Laravel 12) backend and Next.js 16 storefront on EC2.
- ✓ **SYS-02**: Reverse-engineered DAR API catalog extraction, importing 43,527 products across 203 hierarchical categories into MySQL.
- ✓ **UI-01**: Custom storefront theme styling with Dar-style homepage components (AnnouncementBar, CategorySidebar, QuickShopCircles, ExclusiveOffers, FeaturedCollage).
- ✓ **UI-02**: Search redirect fallback for category slugs to standard query parameters.
- ✓ **API-01**: GraphQL backend routing and browser proxy for client-side queries.

### Active

- [ ] **APP-01**: Client mobile applications (iOS & Android wrappers or PWA) for new users with mobile number + referral ID login requirement.
- [ ] **FRAN-01**: Franchisee/Branch business mapping module to record sales, business turnover, and operating expenses.
- [ ] **CP-01**: Promoter/Channel Partner registration, login, and dashboard to map referral trees and commissions.
- [ ] **CP-02**: Multi-tier commission attribution engine supporting T1 (0.3% direct commission) and T2 override (0.2% override commission).
- [ ] **GOLD-01**: Old Gold Purchase workflow with appraisal checkpoints, purity verification, and transaction receipts.
- [ ] **ADM-01**: Centralized Admin Dashboard to control all billing, branch mapping, channel partner commissions, and old gold appraisals.

### Out of Scope

- **CHAT-01**: Real-time customer chat — Defer to v2+ to limit initial scope.
- **OATH-01**: Third-party OAuth providers — Mobile number + OTP/Referral is the primary required authentication flow.

## Context

- The codebase already exists as a Laravel app, Next.js storefront, and Vite franchise dashboard.
- The existing franchise project (`sendra-gold-franchise`) has placeholders and mockup dashboards that need real integration.
- The project has imported over 43k products from `darjewellery.com`.

## Constraints

- **Stack**: Must use PHP 8.3/Laravel 12, Next.js 16/TypeScript, and Vite/React.
- **Security**: Strict encryption/signing for channel partner referral data and transactional records.
- **Localization**: Target region is India; currency is INR (₹).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Bagisto GraphQL | Relay-style pagination matches Next.js storefront schema well | ✓ Good |
| Invert control for Franchise | Vite franchise dashboard operates independently of storefront | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Update Context with current state

---
*Last updated: 2026-07-11 after initialization*
