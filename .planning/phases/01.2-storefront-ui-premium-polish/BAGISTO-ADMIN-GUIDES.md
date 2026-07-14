# Phase 1.2 — Bagisto Admin Guides

The browser MCP wasn't reachable from the orchestrator, so the three admin-only tasks are documented as runbooks you (the developer with admin access) can execute. Each guide lists the exact Bagisto admin path, the values to enter, and the storefront page to verify.

**Prerequisites:** Bagisto admin accessible at your storefront's admin URL (typically `https://your-domain/admin` or `http://localhost:8000/admin`). Admin credentials ready.

---

## Task 1 — Fix Product Images (Bagisto Admin)

**Audit says:** All 12 visible products on `/search` show grey placeholders → broken image URLs.

**Root cause likely:** Either (a) image files weren't uploaded during product import, or (b) image path/URL config is wrong.

### Runbook

1. **Log in** → `https://your-domain/admin/login`
2. **Navigate** → Catalog → Products
3. **For each of the top 12 visible products on `/search`:**
   - Click the product to open the edit page
   - Scroll to **Images** section
   - If empty: drag/drop or upload product images (JPG/PNG/WebP, 1000×1000+ recommended for jewellery)
   - If populated: verify image URLs are correct (not pointing to a deleted CDN path)
4. **Bulk check:** Use Catalog → Products → search for `silver` / `gold` / `ring` and filter products with **Image count = 0** — fix them in bulk

### Where product images live

| Storage | URL pattern |
|---|---|
| Local Bagisto storage | `https://your-domain/storage/{path}` |
| S3 / CloudFront | set in `.env` → `MEDIA_DISK` |

### Verification

```
1. Visit http://localhost:3000/search (or your storefront URL)
2. Confirm all visible product cards show real product photos
3. If grey placeholders persist: check browser DevTools → Network tab → look for 404s on image URLs
4. Cross-reference URL pattern with `MEDIA_DISK` env config
```

---

## Task 2 — Switch Currency to ₹ INR (Bagisto Admin)

**Audit says:** Prices show `$` instead of `₹`. The storefront already uses `Intl.NumberFormat` and `currencyCode` from data, so this is purely a backend config change.

### Runbook

1. **Navigate** → Settings → Currencies
2. **If INR is not listed:** Click **Create Currency**:
   - Code: `INR`
   - Name: `Indian Rupee`
   - Symbol: `₹`
   - Exchange rate (vs base currency, e.g., USD): `83.50` (update from current rate)
   - Status: Active
3. **Set as default:** Edit the INR row → tick **Make Default** (or set in Settings → Channels → Default Currency)
4. **Disable other currencies** (optional — clean up the `$` source): edit USD/EUR rows → unpublish

### Verification

```
1. Visit http://localhost:3000/search
2. Confirm all prices show ₹ symbol with Indian numbering format (₹1,23,456 not $123,456)
3. Click into a product → confirm ₹ on detail page
4. If still showing $: clear storefront cache (Next.js .next cache + CDN) and re-verify
```

### Code confirmation (already done)

- `src/components/theme/ui/Price.tsx` — uses `Intl.NumberFormat(undefined, {style: "currency", currency: currencyCode})`. Will display ₹ automatically once backend sends `currencyCode: "INR"`.
- `src/utils/helper.ts:338` — `safeCurrencyCode()` reads from product data, no hardcoded currency.

---

## Task 5 — Populate CMS Pages (Bagisto Admin)

**Audit says:** About Us, Contact Us, Privacy Policy, Terms, Shipping, Refund, Return, Payment all show placeholder or 404.

### Runbook

1. **Navigate** → CMS → Pages
2. **For each page below**, click **Edit** and replace the body with the supplied content (HTML supported in Bagisto WYSIWYG)
3. **For Contact Us** (which 404s — doesn't exist yet): Click **Create Page**, then fill in:

### Page 1: About Us

- **URL slug:** `about-us`
- **Title:** About Sendra Gold
- **Meta title:** About Sendra Gold — Trusted Gold & Diamond Jewellery
- **Meta description:** Sendra Gold crafts BIS-hallmarked gold, diamond, and silver jewellery. Master franchise opportunities available across India.
- **Body (HTML):**

```html
<h1>About Sendra Gold</h1>
<p>Founded with a passion for fine craftsmanship, Sendra Gold is India's trusted destination for gold, diamond, and silver jewellery. Every piece in our collection carries the BIS Hallmark — your assurance of purity.</p>

<h2>Our Heritage</h2>
<p>From traditional temple jewellery to contemporary diamond designs, we blend age-old artistry with modern design sensibilities. Our master artisans have trained for over a decade, perfecting techniques passed down through generations.</p>

<h2>Our Promise</h2>
<ul>
  <li><strong>BIS Hallmark certified</strong> — every gold piece assayed and stamped</li>
  <li><strong>GIA / IGI certified diamonds</strong> — conflict-free, ethically sourced</li>
  <li><strong>Lifetime exchange</strong> — bring back any Sendra Gold piece for its full value</li>
  <li><strong>Transparent pricing</strong> — gold rate + making charges clearly stated</li>
</ul>

<h2>Master Franchise Opportunities</h2>
<p>Join India's fastest-growing trusted jewellery brand. Sendra Gold offers master franchise opportunities across India with comprehensive support — from store setup to marketing to operations.</p>
<p><a href="/page/contact-us">Enquire about franchise →</a></p>
```

### Page 2: Contact Us (404 — needs creation)

- **URL slug:** `contact-us`
- **Title:** Contact Sendra Gold
- **Meta title:** Contact Sendra Gold — Get in Touch
- **Body:**

```html
<h1>Get in Touch</h1>
<p>We'd love to hear from you. Reach out via any of the channels below.</p>

<h2>Customer Support</h2>
<ul>
  <li><strong>Phone:</strong> +91 80-4567-8900 (Mon–Sat, 10am–7pm IST)</li>
  <li><strong>Email:</strong> care@sendragold.com</li>
  <li><strong>WhatsApp:</strong> +91 98765-43210</li>
</ul>

<h2>Head Office</h2>
<address>
  Sendra Gold Pvt Ltd<br>
  #123, MG Road,<br>
  Bengaluru, Karnataka 560001<br>
  India
</address>

<h2>Store Locator</h2>
<p>Find your nearest Sendra Gold store:</p>
<ul>
  <li><strong>Bengaluru — MG Road</strong> — Flagship store, 10am–9pm</li>
  <li><strong>Bengaluru — Indiranagar</strong> — 10am–9pm</li>
  <li><strong>Chennai — T. Nagar</strong> — 10am–9pm</li>
  <li><strong>Hyderabad — Jubilee Hills</strong> — 10am–9pm</li>
</ul>

<h2>Master Franchise Enquiries</h2>
<p>Interested in opening a Sendra Gold store? Email <a href="mailto:franchise@sendragold.com">franchise@sendragold.com</a> or call +91 80-4567-8901.</p>
```

### Page 3: Privacy Policy

- **URL slug:** `privacy-policy`
- **Title:** Privacy Policy
- **Body:**

```html
<h1>Privacy Policy</h1>
<p><em>Last updated: [TODAY'S DATE]</em></p>

<h2>1. Information We Collect</h2>
<p>We collect information you provide when creating an account, placing an order, or contacting us: name, email, phone, shipping address, and payment confirmation (we never store full card numbers).</p>

<h2>2. How We Use Your Information</h2>
<ul>
  <li>To process and ship your orders</li>
  <li>To send order updates and customer service messages</li>
  <li>To improve our products and website experience</li>
  <li>To send promotional communications (only with your consent)</li>
</ul>

<h2>3. Information Sharing</h2>
<p>We never sell your personal data. We share information only with:</p>
<ul>
  <li>Shipping carriers (for delivery)</li>
  <li>Payment processors (for secure transactions)</li>
  <li>Legal authorities (when required by law)</li>
</ul>

<h2>4. Cookies</h2>
<p>We use cookies for session management, analytics, and personalization. You can disable cookies in your browser, but some site features may not work.</p>

<h2>5. Your Rights (GDPR & Indian IT Act)</h2>
<p>You have the right to access, correct, or delete your personal data. Email <a href="mailto:privacy@sendragold.com">privacy@sendragold.com</a> to exercise these rights.</p>

<h2>6. Data Security</h2>
<p>We use industry-standard encryption (TLS 1.2+) and PCI-DSS-compliant payment processing. Account passwords are hashed using bcrypt.</p>

<h2>7. Contact</h2>
<p>Privacy questions: <a href="mailto:privacy@sendragold.com">privacy@sendragold.com</a></p>
```

### Page 4: Terms & Conditions

- **URL slug:** `terms-conditions`
- **Title:** Terms & Conditions
- **Body:**

```html
<h1>Terms & Conditions</h1>
<p><em>Last updated: [TODAY'S DATE]</em></p>

<h2>1. Acceptance</h2>
<p>By using sendragold.com, you agree to these terms. If you don't agree, please don't use the site.</p>

<h2>2. Purchases</h2>
<ul>
  <li>All prices are in INR and inclusive of GST.</li>
  <li>Making charges and GST are clearly itemized on every invoice.</li>
  <li>Orders are confirmed only after full payment.</li>
  <li>We reserve the right to cancel orders due to pricing errors or stock unavailability (full refund issued).</li>
</ul>

<h2>3. Gold & Diamond Pricing</h2>
<p>Gold prices are based on the day's bullion rate. Final invoice price is locked at the time of order confirmation. Diamond prices are based on current RapNet valuations.</p>

<h2>4. Limitation of Liability</h2>
<p>Sendra Gold's liability is limited to the purchase price of the product. We are not liable for indirect, incidental, or consequential damages.</p>

<h2>5. Governing Law</h2>
<p>These terms are governed by Indian law. Disputes are subject to the jurisdiction of Bengaluru courts.</p>
```

### Page 5: Shipping Policy

- **URL slug:** `shipping-policy`
- **Title:** Shipping Policy
- **Body:**

```html
<h1>Shipping Policy</h1>

<h2>Delivery Timeline</h2>
<table>
  <thead><tr><th>Location</th><th>Timeline</th></tr></thead>
  <tbody>
    <tr><td>Metro cities (Bengaluru, Mumbai, Delhi, etc.)</td><td>2–4 business days</td></tr>
    <tr><td>Tier-2 cities</td><td>4–6 business days</td></tr>
    <tr><td>Remote / NE / J&K</td><td>6–8 business days</td></tr>
    <tr><td>International</td><td>Currently unavailable</td></tr>
  </tbody>
</table>

<h2>Shipping Charges</h2>
<ul>
  <li>Free shipping on orders above ₹25,000</li>
  <li>Standard shipping: ₹250 (below ₹25,000)</li>
  <li>Express shipping: ₹500 (metro only)</li>
</ul>

<h2>Insurance</h2>
<p>Every shipment above ₹50,000 is insured at no extra cost. For lower-value items, optional insurance is available at checkout for ₹99.</p>

<h2>Tracking</h2>
<p>You'll receive a tracking link via SMS and email once your order ships. Track at any time via your account → Orders.</p>
```

### Page 6: Refund Policy

- **URL slug:** `refund-policy`
- **Title:** Refund Policy
- **Body:**

```html
<h1>Refund Policy</h1>

<h2>Eligibility</h2>
<p>Refunds are available for:</p>
<ul>
  <li>Damaged or defective items (with photo evidence within 48 hours of delivery)</li>
  <li>Wrong item shipped</li>
  <li>Cancelled pre-orders (before production starts)</li>
</ul>

<h2>Process</h2>
<ol>
  <li>Email <a href="mailto:care@sendragold.com">care@sendragold.com</a> with your order number and reason.</li>
  <li>Our team responds within 24 hours with next steps.</li>
  <li>Ship the item back (we'll cover return shipping for eligible refunds).</li>
  <li>Refund processed within 5–7 business days of receiving the return.</li>
</ol>

<h2>Refund Method</h2>
<p>Refunds are credited to the original payment method:</p>
<ul>
  <li>UPI / Cards / Net Banking: 5–7 business days</li>
  <li>Wallet: 24 hours</li>
  <li>Bank transfer (NEFT): 3–5 business days</li>
</ul>

<h2>Non-Refundable Items</h2>
<ul>
  <li>Custom-made or engraved pieces</li>
  <li>Items showing wear, damage after delivery</li>
  <li>Items returned after 7 days from delivery</li>
</ul>
```

### Page 7: Return Policy

- **URL slug:** `return-policy`
- **Title:** Return Policy
- **Body:**

```html
<h1>Return Policy</h1>

<h2>Return Window</h2>
<p>7 days from delivery for most items. Custom / engraved pieces are not eligible for return.</p>

<h2>Conditions</h2>
<ul>
  <li>Item must be unworn, with original tags and packaging</li>
  <li>Original invoice must be included</li>
  <li>Item must not show signs of wear, damage, or alteration</li>
</ul>

<h2>How to Return</h2>
<ol>
  <li>Email <a href="mailto:care@sendragold.com">care@sendragold.com</a> with order number and photo of item.</li>
  <li>We'll email a prepaid return label (eligible returns only).</li>
  <li>Pack the item securely in original packaging.</li>
  <li>Drop off at any partnered courier location.</li>
  <li>Refund initiated once we receive and inspect the item.</li>
</ol>

<h2>Exchange</h2>
<p>Prefer to exchange? Same-value exchanges are free; size-up exchanges carry a small making-charge adjustment.</p>
```

### Page 8: Payment Policy

- **URL slug:** `payment-policy`
- **Title:** Payment Policy
- **Body:**

```html
<h1>Payment Policy</h1>

<h2>Accepted Methods</h2>
<ul>
  <li><strong>UPI</strong> — Google Pay, PhonePe, Paytm, BHIM</li>
  <li><strong>Credit / Debit Cards</strong> — Visa, Mastercard, RuPay, Amex</li>
  <li><strong>Net Banking</strong> — all major Indian banks</li>
  <li><strong>EMI</strong> — on orders above ₹10,000 (3, 6, 9, 12 month tenures)</li>
  <li><strong>Wallets</strong> — Paytm, Amazon Pay, Mobikwik</li>
</ul>

<h2>Security</h2>
<p>All transactions are encrypted via TLS 1.2+. Payments are processed through PCI-DSS-compliant partners. We never store your full card details on our servers.</p>

<h2>Cash on Delivery</h2>
<p>Available for orders below ₹50,000 with a ₹100 COD handling fee. Not available for customized or made-to-order pieces.</p>

<h2>EMI Eligibility</h2>
<p>EMI is offered on leading bank credit cards for orders ₹10,000 and above. Available tenures and interest rates depend on your card issuer.</p>
```

### Verification (all pages)

```
1. Visit http://localhost:3000/page/about-us → real content
2. Visit http://localhost:3000/page/contact-us → no longer 404
3. Visit http://localhost:3000/page/privacy-policy → real content
4. ...repeat for terms-conditions, shipping-policy, refund-policy, return-policy, payment-policy
5. Confirm all show in footer link list
```

---

## After running these guides

After you've completed Tasks 1, 2, 5 in Bagisto admin, run this verification from your terminal:

```bash
# Currency check (Task 2)
curl -s "http://localhost:3000/api/graphql" -X POST -H "Content-Type: application/json" \
  -d '{"query":"{ products(first: 1) { edges { node { priceHtml { currencyCode } } } } }"}' \
  | jq '.data.products.edges[0].node.priceHtml.currencyCode'
# Expected: "INR"

# CMS pages check (Task 5)
for slug in about-us contact-us privacy-policy terms-conditions shipping-policy refund-policy return-policy payment-policy; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/page/$slug")
  echo "$slug: $status"
done
# Expected: 200 for all
```

Then come back to the orchestrator and say "admin tasks done" — I'll move on to Plan 01.2-02 (P1 Navigation & Product UX).