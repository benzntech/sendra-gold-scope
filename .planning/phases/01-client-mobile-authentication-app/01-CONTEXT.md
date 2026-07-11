# Phase 1: Whitelabel Setup, Styling & Naming - Context

**Gathered:** 2026-07-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up the default whitelabel settings of Bagisto, sync storefront branding colors with the franchise portal theme, and rename system/docker/git references from "bagisto" to "sendra". No new functional features are implemented in this phase.

</domain>

<decisions>
## Implementation Decisions

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

### the agent's Discretion
- Code refactoring required to update namespace and configuration files safely.
- Location of theme variables in CSS configs.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope & Requirements
- `sendra-gold-project-scope.txt` — Project overview, current state, and requirements.
- `.planning/REQUIREMENTS.md` — Scoped list of v1 requirements.
- `.planning/codebase/STACK.md` — Complete tech stack map.
- `.planning/codebase/STRUCTURE.md` — Complete directory structure map.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `sendra-storefront/src/app/globals.css` — Global styles location.
- `sendra-gold-franchise/src/index.css` — Source of color codes.

### Established Patterns
- Laravel Docker configuration.

### Integration Points
- Docker compose definitions and shell configurations.

</code_context>

<deferred>
## Deferred Ideas

- Client Web Authentication (Mobile Number + Referral ID verification) — Moved to Phase 2.
- Franchise & Channel Partner Portals — Moved to Phase 3.
- Customer Mobile App Wrapper (Flutter/native) — Moved to Phase 6.

</deferred>

---

*Phase: 01-whitelabel-setup-styling-naming*
*Context gathered: 2026-07-11*
