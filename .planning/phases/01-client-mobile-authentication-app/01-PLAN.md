# Plan: Phase 1 (Whitelabel Setup, Styling & Naming)

This plan outlines the steps to align the branding of the storefront with the luxury gold theme and to perform the naming updates to replace "bagisto" references with "sendra".

## Objectives

1. **Luxury Gold Theme Styling**:
   - Align storefront branding colors with the franchise portal design palette in [globals.css](file:///Volumes/External/bensonmac/Documents/BensonProject/sendragold/sendra-storefront/src/app/globals.css).
   - Set up custom `--color-gold`, `--color-gold-hover`, `--color-gold-light`, `--color-gold-dark` variables.
   - Map amber tailwind variables (`--color-amber-*`) to the gold color values to maintain template styling compatibility.

2. **Container & Config Whitelabeling**:
   - Rename Docker container/service references in [docker-compose.yml](file:///Volumes/External/bensonmac/Documents/BensonProject/sendragold/sendra-storefront/docker-compose.yml) from `bagisto-storefront` to `sendra-storefront`.
   - Update config files and environment template files (`.env.example`) to reference `Sendra` instead of `Bagisto`.

## Scope & Boundaries

- No new functional features or components are built in this phase.
- Only styling configuration, variables, docker compose configurations, and env configurations are modified.

## Tasks

### Step 1: Branding and Styling Alignment
- Edit [globals.css](file:///Volumes/External/bensonmac/Documents/BensonProject/sendragold/sendra-storefront/src/app/globals.css) to add variables for the gold palette under the `@theme` block.
- Map `--color-amber-50` to `--color-amber-950` to use the gold values to ensure existing components rendering amber colors reflect the gold theme automatically.

### Step 2: Docker and Configuration Renaming
- Rename `container_name: bagisto-storefront` to `sendra-storefront` in [docker-compose.yml](file:///Volumes/External/bensonmac/Documents/BensonProject/sendragold/sendra-storefront/docker-compose.yml).
- Update `APP_NAME` in [sendra-backend/.env.example](file:///Volumes/External/bensonmac/Documents/BensonProject/sendragold/sendra-backend/.env.example) to `Sendra`.
- Update `.env.example` under [sendra-storefront/.env.example](file:///Volumes/External/bensonmac/Documents/BensonProject/sendragold/sendra-storefront/.env.example) to reference Sendra APIs or configuration labels where applicable.

## Verification & UAT Plan

1. **Styling Verification**:
   - Inspect the storefront's `globals.css` to confirm that all specified luxury gold variables match the color hexes defined in the franchise portal (`#C5A059`, `#B48E47`, `#FAEDD6`, `#917233`).
   - Verify amber mapping variables are added and correct.
2. **Configuration Verification**:
   - Verify `docker-compose.yml` uses the container name `sendra-storefront`.
   - Verify `.env.example` in both repositories has been updated to reflect the new whitelabel settings.
