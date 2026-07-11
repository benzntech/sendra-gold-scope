# INTEGRATIONS — Sendra Gold
_Last updated: 2026-07-11_

## Overview

The Sendra Gold platform integrates with a broad range of external services across payment processing, authentication, AI/ML providers, email delivery, cloud storage, real-time messaging, search, and currency exchange. The backend (Laravel/Bagisto) carries the majority of third-party integrations; the storefront connects to the backend via GraphQL; the franchise portal uses Google Gemini AI directly.

---

## 1. Payment Gateways

All payment integrations are implemented as dedicated Webkul packages under `packages/Webkul/`.

### Stripe
- **Package:** `stripe/stripe-php` `^17.3` (Composer)
- **Laravel Cashier:** `laravel/cashier` `^16.0` (subscription billing)
- **Webkul Module:** `packages/Webkul/Stripe/`
- **Tests:** Feature + Unit tests in `packages/Webkul/Stripe/tests/`
- **Config:** Standard Stripe API key env vars
- **Env vars:**
  ```
  STRIPE_KEY=
  STRIPE_SECRET=
  STRIPE_WEBHOOK_SECRET=
  ```

### Razorpay
- **Package:** `razorpay/razorpay` `^2.9`
- **Webkul Module:** `packages/Webkul/Razorpay/`
- **Tests:** Feature + Unit tests in `packages/Webkul/Razorpay/tests/`
- **Note:** India-primary payment gateway

### PayPal
- **Package:** `paypal/paypal-server-sdk` `^2.0`
- **Webkul Module:** `packages/Webkul/Paypal/`

### PayU
- **Package:** Local Webkul package (no external Composer dependency listed)
- **Webkul Module:** `packages/Webkul/PayU/`
- **Tests:** Feature + Unit tests in `packages/Webkul/PayU/tests/`
- **Note:** PayU is a major Indian/Eastern European payment gateway

### PhonePe
- **Package:** Local Webkul package
- **Webkul Module:** `packages/Webkul/PhonePe/`
- **Note:** UPI-based Indian payment gateway

---

## 2. Authentication & OAuth

### Laravel Sanctum (API Token Auth)
- **Package:** `laravel/sanctum` `^4.0`
- Used for stateless API authentication (storefront ↔ backend)
- The storefront's Apollo Client sends `Authorization: Bearer <token>` headers
- Storefront-key header: `X-STOREFRONT-KEY` (for SSR requests)

### Laravel Socialite (OAuth2 / Social Login)
- **Package:** `laravel/socialite` `^5.0`
- **Webkul Module:** `packages/Webkul/SocialLogin/`
- **Config:** `config/services.php`

Configured OAuth providers:
| Provider | Env Vars |
|---|---|
| **Google** | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` |
| **Facebook** | `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`, `FACEBOOK_CALLBACK_URL` |
| **Twitter** | `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET`, `TWITTER_CALLBACK_URL` |
| **LinkedIn (OpenID)** | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_CALLBACK_URL` |
| **GitHub** | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL` |

### NextAuth (Storefront)
- **Package:** `next-auth` `^4.24.13`
- Manages customer sessions in the Next.js storefront
- **Env vars (sendra-storefront):**
  ```
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=your_next_auth_secret_here
  ```
- Session cached in-memory with a 5-second TTL to reduce re-fetches

### Two-Factor Authentication (2FA)
- **Package:** `pragmarx/google2fa` `^8.0`
- TOTP-based 2FA for admin/user accounts

---

## 3. AI & Machine Learning Providers

### Backend — Laravel AI (`laravel/ai ^0.2.2`)
The backend uses a multi-provider AI abstraction layer (`config/ai.php`). The default provider for text is **OpenAI**; for images, **Gemini**.

| Provider | Driver | Key Env Var | Notes |
|---|---|---|---|
| **OpenAI** | `openai` | `OPENAI_API_KEY`, `OPENAI_ORGANIZATION` | Default for text, audio, transcription, embeddings |
| **Google Gemini** | `gemini` | `GEMINI_API_KEY` | Default for image generation |
| **Anthropic (Claude)** | `anthropic` | `ANTHROPIC_API_KEY` | |
| **Azure OpenAI** | `azure` | `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_URL`, `AZURE_OPENAI_API_VERSION`, `AZURE_OPENAI_DEPLOYMENT` | Default version: `2024-10-21`, deployment: `gpt-4o` |
| **Cohere** | `cohere` | `COHERE_API_KEY` | Default for reranking |
| **DeepSeek** | `deepseek` | `DEEPSEEK_API_KEY` | |
| **ElevenLabs** | `eleven` | `ELEVENLABS_API_KEY` | |
| **Groq** | `groq` | `GROQ_API_KEY` | |
| **Jina AI** | `jina` | `JINA_API_KEY` | |
| **Mistral** | `mistral` | `MISTRAL_API_KEY` | |
| **Ollama** | `ollama` | `OLLAMA_API_KEY` (optional), `OLLAMA_BASE_URL` | Default URL: `http://localhost:11434` |
| **OpenRouter** | `openrouter` | `OPENROUTER_API_KEY` | |
| **Voyage AI** | `voyageai` | `VOYAGEAI_API_KEY` | |
| **xAI (Grok)** | `xai` | `XAI_API_KEY` | |

- **Webkul MagicAI Module:** `packages/Webkul/MagicAI/` — wraps the AI layer for content/product generation
- **Config file:** `config/openai.php` (legacy/direct OpenAI config), `config/ai.php` (multi-provider)

### Franchise Portal — Google Gemini AI
- **Package:** `@google/genai` `^2.4.0` (npm)
- **Env var (sendra-gold-franchise):** `GEMINI_API_KEY`
- Used directly in the Vite/React frontend, routed through the Express server
- AI Studio deployment context (hosted on Google Cloud Run)

---

## 4. Email Delivery

### Default Mailer: Bagisto Dynamic SMTP
- `MAIL_MAILER=bagisto-dynamic-smtp` (custom Bagisto transport)
- Allows SMTP config to be changed from admin panel at runtime

### Supported Mail Transports (`config/mail.php`)
| Transport | Env Vars / Config |
|---|---|
| `smtp` | `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION` |
| `ses` (AWS SES) | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION` |
| `postmark` | `POSTMARK_TOKEN` |
| `resend` | `RESEND_KEY` |
| `sendmail` | `MAIL_SENDMAIL_PATH` |
| `mailgun` | (configured via Guzzle, standard Laravel support) |
| `failover` | Falls back smtp → log |
| `roundrobin` | Balances ses ↔ postmark |

### Mail Addresses (from .env.example)
```
MAIL_FROM_ADDRESS=shop@example.com
MAIL_FROM_NAME=Shop
ADMIN_MAIL_ADDRESS=admin@example.com
CONTACT_MAIL_ADDRESS=contact@example.com
```

### Dev Mail Capture
- **Mailpit** (`axllent/mailpit:latest`) — local SMTP catch-all in Docker Compose
  - SMTP port: `1025`
  - Web UI: `8025`

---

## 5. Cloud Storage — AWS S3
- **Config:** `config/filesystems.php`
- **Env vars:**
  ```
  AWS_ACCESS_KEY_ID=
  AWS_SECRET_ACCESS_KEY=
  AWS_DEFAULT_REGION=us-east-1
  AWS_BUCKET=
  AWS_USE_PATH_STYLE_ENDPOINT=false
  ```
- Default disk is local `public`; S3 is configured as an alternative disk driver
- Also used for: **AWS SES** (email), **AWS SQS** (queues), **DynamoDB** (cache)

---

## 6. Search — Elasticsearch
- **Package:** `elasticsearch/elasticsearch` `^8.10`
- **Docker image:** `elasticsearch:7.17.0` (note: version mismatch — client is v8.x, image is v7.17)
- **Config:** `config/elasticsearch.php`
- **Kibana** also deployed (`kibana:7.17.0`, port `5601`)
- Supports three connection modes: default (host+auth), API key, or Elastic Cloud ID
- **Env vars:**
  ```
  ELASTICSEARCH_HOST=http://localhost:9200
  ELASTICSEARCH_USER=
  ELASTICSEARCH_PASS=
  ELASTICSEARCH_API_KEY=
  ELASTICSEARCH_CLOUD_ID=
  ELASTICSEARCH_INDEX_PREFIX=
  ```

---

## 7. Real-Time Broadcasting — Pusher
- **Package:** `pusher/pusher-php-server` `^7.0`
- **Config:** `config/broadcasting.php`
- Default broadcast connection: `log` (null in dev)
- **Env vars:**
  ```
  BROADCAST_CONNECTION=log
  PUSHER_APP_KEY=
  PUSHER_APP_SECRET=
  PUSHER_APP_ID=
  PUSHER_APP_CLUSTER=
  ```
- Redis pub/sub also available as broadcast driver

---

## 8. Currency Exchange Rate APIs
- **Config:** `config/services.php` → `exchange_api`
- Two providers configured:

| Provider | Class | Env Var |
|---|---|---|
| **Exchange Rates API** (default) | `Webkul\Core\Helpers\Exchange\ExchangeRates` | `EXCHANGE_RATES_API_KEY` |
| **Fixer.io** | `Webkul\Core\Helpers\Exchange\FixerExchange` | `FIXER_API_KEY` |

---

## 9. Notifications & Messaging

### Slack
- **Config:** `config/services.php` → `slack`
- Bot-based notifications
- **Env vars:**
  ```
  SLACK_BOT_USER_OAUTH_TOKEN=
  SLACK_BOT_USER_DEFAULT_CHANNEL=
  ```

### In-App Notifications
- **Webkul Module:** `packages/Webkul/Notification/`
- Event-driven notifications dispatched via Laravel's notification system

---

## 10. Storefront ↔ Backend API (GraphQL)

### Apollo Client + Bagisto GraphQL API
- The storefront (`sendra-storefront`) communicates with the backend via **GraphQL**
- **Backend:** Bagisto GraphQL API (`bagisto/bagisto-api` package, installed in Dockerfile)
  - Exposes a GraphQL endpoint consumed by `NEXT_PUBLIC_BAGISTO_ENDPOINT`
  - Storefront key for server-side requests: `NEXT_PUBLIC_BAGISTO_STOREFRONT_KEY`
- **Client:** `@apollo/client` `^3.14.0`
  - SSR: calls `GRAPHQL_URL` directly with `X-STOREFRONT-KEY` header
  - Client-side: calls `/api/graphql` proxy route with `Authorization: Bearer <token>`
- **GraphQL modules** (under `src/graphql/`): `cart`, `catalog`, `checkout`, `customer`, `theme`

**Storefront env vars:**
```
NEXT_PUBLIC_BAGISTO_ENDPOINT=https://your-bagisto-instance.com
NEXT_PUBLIC_BAGISTO_STOREFRONT_KEY=your_storefront_key_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_next_auth_secret_here
COMPANY_NAME=Your Company Name
```

---

## 11. Social Sharing
- **Webkul Module:** `packages/Webkul/SocialShare/`
- Enables product/content sharing to social platforms from the storefront

---

## 12. Compliance & Legal Integrations
- **GDPR Module:** `packages/Webkul/GDPR/` — data privacy compliance
- **EU Withdrawal Module:** `packages/Webkul/EUWithdrawal/` — EU consumer right-of-withdrawal compliance
- **KYC / UIDAI / PAN Compliance (Franchise Portal):**
  - Aadhaar (`UIDAI`) and PAN number fields in `BuybackTicket` model
  - KYC data encrypted at rest using AES-256 (`src/lib/encryption.ts`)
  - Referenced in footer: "private customer KYC records (UIDAI & Income Tax) encrypted 256-bit at rest"

---

## 13. QR Codes & PDF Generation
- **QR Codes:** `simplesoftwareio/simple-qrcode` `^4.2`
- **PDF (primary):** `barryvdh/laravel-dompdf` `^2.0|^3.0`
- **PDF (alternative):** `mpdf/mpdf` `^8.2`
- Used for invoice generation, product labels, etc.

---

## 14. Redis
- **Package:** `predis/predis` `^2.2`
- **Docker image:** `redis:alpine`
- **Env vars:**
  ```
  REDIS_CLIENT=phpredis
  REDIS_HOST=127.0.0.1
  REDIS_PASSWORD=null
  REDIS_PORT=6379
  ```
- Used for: caching, session storage, queue backend, response caching, broadcast pub/sub

---

## 15. Response Caching
- **Package:** `spatie/laravel-responsecache` `^7.4`
- **Env var:** `RESPONSE_CACHE_ENABLED=true`
- Full-page HTTP response caching (configurable per route)

---

## 16. Sitemap & SEO
- **Package:** `spatie/laravel-sitemap` `^7.3`
- **Webkul Module:** `packages/Webkul/Sitemap/`
- Auto-generates XML sitemaps from catalog/category data

---

## Integration Summary Table

| Service / Integration | Category | Sub-project | Mechanism |
|---|---|---|---|
| Stripe | Payment | Backend | `stripe/stripe-php`, `laravel/cashier` |
| Razorpay | Payment | Backend | `razorpay/razorpay` |
| PayPal | Payment | Backend | `paypal/paypal-server-sdk` |
| PayU | Payment | Backend | Webkul/PayU package |
| PhonePe | Payment | Backend | Webkul/PhonePe package |
| Google OAuth | Auth | Backend | `laravel/socialite` |
| Facebook OAuth | Auth | Backend | `laravel/socialite` |
| Twitter OAuth | Auth | Backend | `laravel/socialite` |
| LinkedIn OAuth | Auth | Backend | `laravel/socialite` |
| GitHub OAuth | Auth | Backend | `laravel/socialite` |
| NextAuth | Auth | Storefront | `next-auth ^4.24.13` |
| OpenAI | AI | Backend | `laravel/ai`, `config/ai.php` |
| Google Gemini | AI | Backend + Franchise | `laravel/ai` (backend); `@google/genai` (franchise) |
| Anthropic Claude | AI | Backend | `laravel/ai` |
| Azure OpenAI | AI | Backend | `laravel/ai` |
| Cohere | AI | Backend | `laravel/ai` |
| Elasticsearch | Search | Backend | `elasticsearch/elasticsearch ^8.10` |
| AWS S3 | Storage | Backend | Laravel S3 driver |
| AWS SES | Email | Backend | Laravel SES mailer |
| Postmark | Email | Backend | Laravel Postmark mailer |
| Resend | Email | Backend | Laravel Resend mailer |
| Mailgun | Email | Backend | Laravel Mailgun mailer |
| Pusher | Real-time | Backend | `pusher/pusher-php-server ^7.0` |
| Slack | Notifications | Backend | Laravel Slack notifications |
| Exchange Rates API | Currency | Backend | `Webkul\Core\Helpers\Exchange` |
| Fixer.io | Currency | Backend | `Webkul\Core\Helpers\Exchange` |
| Bagisto GraphQL API | API layer | Storefront→Backend | `@apollo/client ^3.14` |
| Redis | Cache/Queue | Backend | `predis/predis ^2.2` |
| Google 2FA (TOTP) | Auth/Security | Backend | `pragmarx/google2fa ^8.0` |
| KYC (UIDAI/PAN) | Compliance | Franchise | Custom AES-256 `encryption.ts` |

---

## Environment Variable Reference

### sendra-backend (.env.example)
```env
APP_NAME=Bagisto
APP_ENV=local
APP_KEY=
APP_URL=http://localhost
APP_ADMIN_URL=admin
APP_TIMEZONE=Asia/Kolkata
APP_CURRENCY=USD

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

SESSION_DRIVER=database
QUEUE_CONNECTION=sync
CACHE_STORE=file
BROADCAST_CONNECTION=log

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

RESPONSE_CACHE_ENABLED=true

MAIL_MAILER=bagisto-dynamic-smtp
MAIL_FROM_ADDRESS=shop@example.com
ADMIN_MAIL_ADDRESS=admin@example.com
CONTACT_MAIL_ADDRESS=contact@example.com

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
```

Inferred additional env vars (from config files):
```env
# Payments
STRIPE_KEY=
STRIPE_SECRET=
RAZORPAY_KEY=
RAZORPAY_SECRET=

# OAuth (Social Login)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
FACEBOOK_CALLBACK_URL=
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
TWITTER_CALLBACK_URL=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_CALLBACK_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=

# AI Providers
OPENAI_API_KEY=
OPENAI_ORGANIZATION=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_URL=
COHERE_API_KEY=
DEEPSEEK_API_KEY=
ELEVENLABS_API_KEY=
GROQ_API_KEY=
MISTRAL_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434
OPENROUTER_API_KEY=
VOYAGEAI_API_KEY=
XAI_API_KEY=

# Email Services
POSTMARK_TOKEN=
RESEND_KEY=
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=

# Notifications
SLACK_BOT_USER_OAUTH_TOKEN=
SLACK_BOT_USER_DEFAULT_CHANNEL=

# Search
ELASTICSEARCH_HOST=http://localhost:9200
ELASTICSEARCH_USER=
ELASTICSEARCH_PASS=
ELASTICSEARCH_API_KEY=
ELASTICSEARCH_CLOUD_ID=
ELASTICSEARCH_INDEX_PREFIX=

# Real-time
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_ID=
PUSHER_APP_CLUSTER=

# Currency Exchange
EXCHANGE_RATES_API_KEY=
FIXER_API_KEY=
```

### sendra-storefront (.env.example)
```env
NEXT_PUBLIC_BAGISTO_ENDPOINT=https://your-bagisto-instance.com
NEXT_PUBLIC_BAGISTO_STOREFRONT_KEY=your_storefront_key_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_next_auth_secret_here
COMPANY_NAME=Your Company Name
```

### sendra-gold-franchise (.env.example)
```env
GEMINI_API_KEY=MY_GEMINI_API_KEY
APP_URL=MY_APP_URL
```
