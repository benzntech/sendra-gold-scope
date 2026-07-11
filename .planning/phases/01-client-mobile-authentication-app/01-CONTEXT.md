# Phase 1: Client Web Auth, UI Styling & Naming - Context

**Gathered:** 2026-07-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Secure customer registration and login on the web storefront requiring a Mobile Number and Referral ID. Integrates mock OTP verification for development. Aligns customer storefront UI design and colors with the franchise portal theme, configures PWA support for the franchise Vite app, and renames system/docker/git references from "bagisto" to "sendra". The customer mobile app wrapper is deferred to Phase 5.

</domain>

<decisions>
## Implementation Decisions

### Authentication Flow & Input Gate (Web Storefront)
- Login/registration requires two fields: `Mobile Number` (authenticated via OTP) and `Referral ID` (required validation to log in or register).
- Device OTP authentication will use a Mock OTP verification handler for Phase 1 (OTP is simulated, validation succeeds instantly upon submission for development).
- Next-Auth credentials provider configuration on the Next.js storefront will be updated to handle the custom flow.

### Backend Integrations (Bagisto Laravel)
- Implement custom GraphQL queries/mutations in the Bagisto backend to validate:
  1. If a mobile number is already registered.
  2. If the referral ID is valid (exists in the system as a Master Franchisee or Channel Partner ID).
- Modify/create Laravel models, repositories, and migrations to track referrals and mobile authentication tokens.

### UI Styling & Color Palette Alignment
- Update the customer e-commerce store frontend (`sendra-storefront`) CSS and configurations to match the luxury gold color palette of the franchise portal (`sendra-gold-franchise`):
  - Gold: `#C5A059`
  - Gold Hover: `#B48E47`
  - Gold Light: `#FAEDD6`
  - Gold Dark: `#917233`
  - Fonts: Inter, Outfit

### Server & Git Renaming
- Update all occurrences of the name "bagisto" on the remote server configuration (Docker setup, container names, etc.) to "sendra".
- Rename github repository references and configuration details from "bagisto" to "sendra".

### PWA Configurations
- PWA/mobile responsive settings (viewport configuration, icons, manifest files) will be added to the franchise Vite app (`sendra-gold-franchise`).

### the agent's Discretion
- Design and layout of the Mobile Number & Referral ID registration input form fields.
- Simulated SMS delivery and verification layout.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope & Requirements
- `sendra-gold-project-scope.txt` — Project overview, current state, and requirements.
- `project Final Draft.docx` — Detailed business terms for Master Franchisees and Channel Partners.
- `.planning/REQUIREMENTS.md` — Scoped list of v1 requirements.
- `.planning/codebase/STACK.md` — Complete tech stack map.
- `.planning/codebase/STRUCTURE.md` — Complete directory structure map.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `sendra-storefront/src/components/customer/LoginForm.tsx` — Reference layout for forms.
- `sendra-storefront/src/utils/auth.ts` — Current Next-Auth CredentialsProvider configuration.

### Established Patterns
- Laravel modular development inside `packages/Webkul/` for adding custom features.
- Redux Toolkit for storefront state sync.

### Integration Points
- Custom Laravel migrations for tracking user mobile details and referral associations.
- Vite 6 PWA plugin integration inside `sendra-gold-franchise/vite.config.ts`.

</code_context>

<deferred>
## Deferred Ideas

- Customer Mobile App Wrapper (Flutter/native) — Moved to Phase 5.
- SMS Gateway Integration (Twilio/PhonePe OTP) — Deferred until gateway credentials are provided.
- Native builds generation (.apk, .ipa) — Deferred to later deployment phases.

</deferred>

---

*Phase: 01-client-web-auth-styling-naming*
*Context gathered: 2026-07-11*
