# Testing Infrastructure
_Last updated: 2026-07-11_

## Overview

Testing is concentrated in the `sendra-backend` sub-project, which has a mature, multi-layer test suite built on **Pest 3** (unit/feature) and **Playwright** (end-to-end). The `sendra-storefront` and `sendra-gold-franchise` sub-projects have **no test infrastructure** configured.

---

## 1. sendra-backend (Laravel/PHP)

### 1.1 Test Frameworks

| Framework | Version | Scope |
|---|---|---|
| **Pest 3** | `^3.0` (via `pestphp/pest`) | Unit and Feature tests (PHP) |
| **PHPUnit** | `^11.0` | Underlying runner for Pest |
| **Playwright** | Latest (Node.js) | End-to-end browser tests |
| **Faker** | `^1.23` (fakerphp/faker) | Fake data generation in factories |
| **bagisto/laravel-datafaker** | `2.3.*` | Bagisto-specific factory helpers |

Test runner commands:
```bash
# Via Pest directly
vendor/bin/pest                                          # Run all tests
vendor/bin/pest --colors=always                         # With colour output (CI)
vendor/bin/pest --testsuite="Admin Feature Test"        # Run a specific suite
vendor/bin/pest packages/Webkul/Admin/tests/Feature     # Run tests in a directory
vendor/bin/pest --filter="test name"                    # Run a single test by name

# Via Artisan
php artisan test --compact                              # Run all tests
php artisan test --compact --filter=testName            # Specific test
php artisan test --compact packages/Webkul/Admin/tests  # Package tests
```

### 1.2 Test Organization

Tests live **inside each package**, not in the root `tests/` directory. The root `tests/` contains only the Pest bootstrap:

```
tests/
├── Pest.php        ← Pest bootstrap: binds TestCase classes to package directories
└── TestCase.php    ← Base TestCase (uses DatabaseTransactions)
```

**Per-package test structure:**
```
packages/Webkul/<Package>/tests/
├── <Package>TestCase.php     ← Package-specific base test class
├── Concerns/
│   └── <Package>TestBench.php  ← Trait with helper methods (e.g. loginAsAdmin)
├── Feature/                  ← Feature (HTTP/integration) tests
│   ├── Catalog/
│   ├── Sales/
│   └── ...
├── Unit/                     ← Unit tests (where present)
└── e2e-pw/                   ← Playwright E2E tests (Admin/Shop packages only)
    ├── playwright.config.ts
    ├── setup.ts
    ├── tests/
    │   ├── auth.spec.ts
    │   ├── catalog/
    │   ├── sales.spec.ts
    │   └── ...
    ├── pages/                ← Page Object Models
    ├── utils/                ← Playwright helpers
    └── data/                 ← Test data/fixtures
```

### 1.3 PHPUnit Configuration

**File:** `sendra-backend/phpunit.xml`

Key settings:
- Bootstrap: `vendor/autoload.php`
- Colors enabled
- Source coverage includes both `app/` and `packages/`

**Test suites defined:**

| Suite Name | Type | Package |
|---|---|---|
| Admin Feature Test | Feature | `packages/Webkul/Admin/tests/Feature` |
| Core Unit Test | Unit | `packages/Webkul/Core/tests/Unit` |
| Customer Unit Test | Unit | `packages/Webkul/Customer/tests/Unit` |
| DataGrid Unit Test | Unit | `packages/Webkul/DataGrid/tests/Unit` |
| EUWithdrawal Feature Test | Feature | `packages/Webkul/EUWithdrawal/tests/Feature` |
| Installer Feature Test | Feature | `packages/Webkul/Installer/tests/Feature` |
| PayU Unit Test | Unit | `packages/Webkul/PayU/tests/Unit` |
| PayU Feature Test | Feature | `packages/Webkul/PayU/tests/Feature` |
| Razorpay Unit Test | Unit | `packages/Webkul/Razorpay/tests/Unit` |
| Razorpay Feature Test | Feature | `packages/Webkul/Razorpay/tests/Feature` |
| Shop Feature Test | Feature | `packages/Webkul/Shop/tests/Feature` |
| Stripe Unit Test | Unit | `packages/Webkul/Stripe/tests/Unit` |
| Stripe Feature Test | Feature | `packages/Webkul/Stripe/tests/Feature` |

**Testing environment variables (from `phpunit.xml`):**
```xml
APP_ENV=testing
APP_MAINTENANCE_DRIVER=file
BCRYPT_ROUNDS=4           ← Reduced for speed
CACHE_STORE=array
MAIL_MAILER=array
PULSE_ENABLED=false
QUEUE_CONNECTION=sync
SESSION_DRIVER=array
TELESCOPE_ENABLED=false
```

### 1.4 Types of Tests

#### Unit Tests

Present in: `Core`, `Customer`, `DataGrid`, `PayU`, `Razorpay`, `Stripe` packages.

Example unit test files (Core package):
- `packages/Webkul/Core/tests/Unit/CoreTest.php`
- `packages/Webkul/Core/tests/Unit/MenuTest.php`

#### Feature Tests (PHP/Pest)

Present in: `Admin` (49 files), `Shop` (22 files), `EUWithdrawal`, `Installer`, `PayU`, `Razorpay`, `Stripe`.

**Admin Feature Test coverage areas (49 test files):**
```
Feature/
├── Admin/
│   ├── ForgotPasswordTest.php
│   └── TwoFactorAuthenticationTest.php
├── Catalog/
│   ├── AttributeFamilyTest.php
│   ├── AttributeTest.php
│   ├── CategoryTest.php
│   └── Products/
│       ├── ProductTest.php
│       └── Types/
│           ├── BundleTest.php
│           ├── ConfigurableTest.php
│           ├── DownloadableTest.php
│           ├── GroupedTest.php
│           ├── SimpleTest.php
│           └── VirtualTest.php
├── Cms/CmsTest.php
├── Configuration/Customer/CaptchaConfigurationTest.php
├── Customers/
│   ├── CustomerGroupsTest.php
│   ├── CustomersTest.php
│   └── ReviewTest.php
├── Dashboard/DashboardTest.php
├── Marketing/
│   ├── Communications/
│   │   ├── CampaignsTest.php
│   │   ├── EmailTemplateTest.php
│   │   ├── EventsTest.php
│   │   └── NewsletterSubscriptionsTest.php
│   ├── Promotions/
│   │   ├── CartRuleTest.php
│   │   └── CatalogRuleTest.php
│   └── SearchAndSeo/
│       ├── SearchSynonymsTest.php
│       ├── SearchTermTest.php
│       ├── SitemapTest.php
│       └── UrlRewritesTest.php
├── Reporting/
│   ├── CustomersReportTest.php
│   ├── ProductReportTest.php
│   └── SalesReportTest.php
├── Sales/
│   ├── InvoiceTest.php
│   ├── Orders/OrdersTest.php
│   ├── OrdersTest.php
│   ├── RefundTest.php
│   ├── ShipmentTest.php
│   └── TransactionTest.php
└── Settings/
    ├── ChannelsTest.php
    ├── CurrenciesTest.php
    ├── DataTransferTest.php
    ├── ExchangeRatesTest.php
    ├── InventorySourcesTest.php
    ├── LocaleTest.php
    ├── RoleTest.php
    ├── TaxCategoriesTest.php
    ├── TaxRatesTest.php
    ├── ThemeTest.php
    └── UsersTest.php
```

**Shop Feature Test coverage areas (22 test files):**
```
Feature/
├── API/
│   ├── CatalogApiCacheTest.php
│   ├── CategoryProductTest.php
│   ├── MiniCartTest.php
│   ├── ProductCardResourceTest.php
│   └── ProductTest.php
├── CarouselTest.php
├── Checkout/
│   ├── CartTest.php
│   ├── CheckoutTest.php
│   ├── CouponUsageLimitTest.php
│   └── CustomizableOptionFileTest.php
├── Customers/
│   ├── AccountTest.php
│   ├── OrdersTest.php
│   └── WishlistTest.php
├── HomePageTest.php
├── LoginPageTest.php
├── Product/Prices/
│   ├── BundleTest.php
│   ├── ConfigurableTest.php
│   ├── DownloadableTest.php
│   ├── GroupedTest.php
│   ├── SimpleTest.php
│   └── VirtualTest.php
└── RegistrationPageTest.php
```

#### End-to-End Tests (Playwright)

Present in: `Admin` and `Shop` packages only.

**Admin E2E test files:**
```
packages/Webkul/Admin/tests/e2e-pw/tests/
├── auth.spec.ts
├── cms.spec.ts
├── sales.spec.ts
├── catalog/     ← Products, categories
├── configuration/
├── customers/
├── marketing/
└── settings/
```

**Playwright Configuration (`playwright.config.ts`):**

| Setting | Value |
|---|---|
| Test timeout | 60 seconds |
| Expect timeout | 20 seconds |
| Parallel | false |
| Workers | 1 (sequential) |
| Retries | 0 |
| Browser | Chromium only |
| Screenshot | on failure (full page) |
| Video | retain on failure |
| Trace | retain on failure |
| Report | list + HTML (`./playwright-report/`) |
| Base URL | `process.env.APP_URL` |
| Auth state | stored in `.state/admin-auth.json` |

**Running Playwright tests:**
```bash
# Admin E2E
cd packages/Webkul/Admin
npm install
npx playwright install --with-deps chromium
npx playwright test --config=tests/e2e-pw/playwright.config.ts

# Shop E2E
cd packages/Webkul/Shop
npm install
npx playwright install --with-deps chromium
npx playwright test --config=tests/e2e-pw/playwright.config.ts
```

Requires: running Laravel server (`php artisan serve`) + seeded database.

### 1.5 Test Utilities & Helpers

#### Base TestCase

`tests/TestCase.php` — All feature tests extend this via package-specific TestCase classes:
```php
abstract class TestCase extends BaseTestCase
{
    use DatabaseTransactions;  // ← Every test wraps DB in a transaction (auto-rollback)
}
```

#### Package TestCase Classes

Each tested package has its own TestCase that composes traits:
```php
// Example: AdminTestCase
class AdminTestCase extends TestCase
{
    use AdminTestBench, CoreAssertions;
}
```

#### Test Concern Traits

| Trait | Package | Purpose |
|---|---|---|
| `AdminTestBench` | Admin | `loginAsAdmin(?AdminContract)` helper |
| `CoreAssertions` | Core | 20+ assertion helpers for orders, carts, invoices, rules |

**`CoreAssertions` helper methods (555 lines):**
- `assertModelWise(array)` — assertDatabaseHas for multiple model types at once
- `assertPrice(float, float, ?int)` — decimal-aware price comparison
- `prepareOrder(Order)` — builds assertion array for orders (35+ fields)
- `prepareOrderUsingCart(Cart)` — order assertions sourced from cart
- `prepareOrderItem(OrderItem)` — order item assertion array
- `prepareCart(Cart)` — cart assertion array
- `prepareCartItem(CartItem)` — cart item assertion array
- `prepareCartPayment(CartPayment)` — payment assertion array
- `prepareCartShippingRate(CartShippingRate)` — shipping rate assertion
- `prepareAddress(mixed, ?string)` — address assertion array
- `prepareCartRule(CartRule)` — promotion rule assertion array
- `prepareCatalogRule(CatalogRule)` — catalog rule assertion array
- `prepareInvoice(Order, OrderItem)` — invoice assertion array

#### Pest Bindings (`tests/Pest.php`)

```php
uses(AdminTestCase::class)->in('../packages/Webkul/Admin/tests');
uses(CoreTestCase::class)->in('../packages/Webkul/Core/tests');
uses(CustomerTestCase::class)->in('../packages/Webkul/Customer/tests');
// ... 11 packages total bound
```

Custom expectation:
```php
expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});
```

#### Model Factories

**64+ factory classes** across 15+ packages. Every major domain entity has a Faker-backed factory:

| Package | Factory Examples |
|---|---|
| Customer | `CustomerFactory`, `CustomerAddressFactory`, `CustomerGroupFactory`, `CustomerWishlistFactory`, `CompareItemFactory` |
| Product | `ProductFactory`, `ProductAttributeValueFactory`, `ProductBundleOptionsFactory`, `ProductInventoryFactory`, `ProductReviewFactory` |
| Checkout | `CartFactory`, `CartItemFactory`, `CartAddressFactory`, `CartPaymentFactory`, `CartShippingRateFactory` |
| Category | `CategoryFactory`, `CategoryTranslationFactory` |
| Marketing | `CampaignFactory`, `EventFactory`, `SitemapFactory`, `SearchTermsFactory`, `UrlRewriteFactory` |
| Core | `CartRuleFactory`, `CartRuleCouponFactory`, `ChannelFactory`, `CurrencyFactory`, `LocaleFactory` |
| Admin | `CatalogRuleFactory`, `CurrencyExchangeRateFactory`, `ThemeFactory` |
| CMS | `PageFactory`, `PageTranslationFactory` |

#### Playwright Helpers

```
packages/Webkul/Admin/tests/e2e-pw/
├── setup.ts     ← Global setup (login, seed state)
├── pages/       ← Page Object Models
└── utils/       ← Shared Playwright utility functions
```

### 1.6 Test Coverage Estimate

| Package | Unit Tests | Feature Tests | E2E Tests |
|---|---|---|---|
| Admin | — | 49 files | ✅ (multiple spec files) |
| Shop | — | 22 files | ✅ (multiple spec files) |
| Core | 2 files | — | — |
| Customer | Unit tests present | — | — |
| DataGrid | Unit tests present | — | — |
| Stripe | Unit + Feature | Feature tests | — |
| Razorpay | Unit + Feature | Feature tests | — |
| PayU | Unit + Feature | Feature tests | — |
| EUWithdrawal | — | Feature tests | — |
| Installer | — | Feature tests | — |
| ~30 other packages | None | None | None |

> **Note:** Approximately 35% of packages (those without payment gateway logic or complex UI) have no test coverage at all.

### 1.7 CI Integration

From `.github/workflows/`:

| Workflow | File | Trigger | What it runs |
|---|---|---|---|
| Pest Tests | `pest_tests.yml` | push, PR | `vendor/bin/pest --colors=always` |
| Code Style | `pint_tests.yml` | push, PR | `vendor/bin/pint --test` |
| Admin E2E | `admin_playwright_tests.yml` | push, PR | Playwright Admin tests (10 parallel shards) |
| Shop E2E | `shop_playwright_tests.yml` | push, PR | Playwright Shop tests |
| Translations | `translation_tests.yml` | push, PR | `php artisan bagisto:translations:check` |
| Docker Publish | `docker_publish.yml` | (separate) | Docker image build + push |

**Pest CI environment:**
- OS: ubuntu-latest
- PHP: 8.3
- MySQL: 8.0 (Docker service)
- Steps: checkout → setup PHP → composer install → copy `.env.example` → configure DB → `bagisto:install` → run Pest

**Playwright CI environment:**
- OS: ubuntu-latest
- PHP: 8.3 + Node.js 22.13.1
- MySQL: 8.0 (Docker service)
- **10 parallel shards** (shard matrix 1–10 of 10)
- Steps: checkout → setup PHP + Node → install npm deps → install Playwright browsers → configure env → composer install → `bagisto:install` → seed products → start Laravel server → run Playwright with shard → upload HTML report + test results + `laravel.log` as artifacts (1-day retention)

---

## 2. sendra-storefront (Next.js)

### 2.1 Test Framework

**None configured.**

- No test framework in `package.json` (no Jest, Vitest, Playwright, or Cypress)
- No test scripts in `package.json` scripts section
- No `__tests__/`, `*.test.ts`, or `*.spec.ts` files present

| Aspect | Status |
|---|---|
| Unit testing | ❌ Not configured |
| Integration testing | ❌ Not configured |
| E2E testing | ❌ Not configured |
| Component testing | ❌ Not configured |

> **⚠ Gap:** The storefront has zero automated test coverage.

---

## 3. sendra-gold-franchise (Vite/React/TypeScript)

### 3.1 Test Framework

**None configured.**

- No test framework in `package.json`
- No test scripts beyond `"lint": "tsc --noEmit"` (type checking only)
- No test files of any kind present in the project

| Aspect | Status |
|---|---|
| Unit testing | ❌ Not configured |
| Integration testing | ❌ Not configured |
| E2E testing | ❌ Not configured |
| Type checking | ✅ `tsc --noEmit` via `npm run lint` |

> **⚠ Gap:** The franchise portal has zero automated test coverage. All validation is manual or by TypeScript type checking.

---

## 4. Summary

| | sendra-backend | sendra-storefront | sendra-gold-franchise |
|---|---|---|---|
| Unit tests | ✅ Pest 3 | ❌ None | ❌ None |
| Feature/Integration | ✅ Pest 3 (71 files) | ❌ None | ❌ None |
| E2E tests | ✅ Playwright | ❌ None | ❌ None |
| Factories/fixtures | ✅ 64+ factories | ❌ None | ❌ None |
| CI automated | ✅ 5 GitHub Actions workflows | ❌ None | ❌ None |
| Type checking | N/A (PHP) | ✅ `tsc` (strict) | ✅ `tsc` (no strict) |

**Total Pest test files:** ~71 PHP test files (49 Admin + 22 Shop + scattered unit tests across 6 other packages)
**Total Playwright spec files:** ~10+ `.spec.ts` files across Admin and Shop
**Total factory files:** 64+ across 15 packages
