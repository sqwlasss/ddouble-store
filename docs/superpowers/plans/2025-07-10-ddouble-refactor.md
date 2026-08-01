# DDouble Store Refactor — 12-Part Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up, restyle, optimize, and harden the DDouble React e-commerce app (React 18 + Vite SPA, Shopify Storefront API, Firebase Auth, Tailwind, Vercel) in 12 sequential parts.

**Architecture:** Frontend-only SPA. Data via Shopify Storefront API through `src/lib/shopify/*` + React Query hooks in `src/hooks/useProducts.js` / `src/hooks/useShopifyCart.js`. Auth via Firebase (`src/lib/firebaseAuth.js`). Design system: warm minimal storefront (#F9F9F7 / #1A1A1A / #6B6B67 / #E5E5E1 / #D9D2C5, Inter 300-600, uppercase tracked labels).

**Tech Stack:** React 18, React Router v6, Tailwind CSS 3, @tanstack/react-query 5, Shopify Storefront API, Firebase Auth, Radix UI (dialog/accordion/label/slot), framer-motion, lucide-react. Zero new deps preferred.

## Global Constraints

- Design tokens: bg `#F9F9F7`, text `#1A1A1A`, muted `#6B6B67`, border `#E5E5E1`, accent `#D9D2C5`; Inter 300-600; uppercase tracked labels.
- Preserve Tailwind conventions and `@/` alias (vite.config.js already maps it).
- Every task ends with `npm run lint` AND `npm run build` both green.
- DO NOT touch: product titles/names/descriptions/descriptionsHtml/catalog content in Shopify; dropshipping/sourcing/inventory; pricing, price amounts, variant prices, currency values, compare-at prices; the free-shipping threshold NUMBER (may fix only HOW it is displayed/configured); reviews/ratings/testimonials/social proof; company identity disclosure (legal entity, VAT, registered office); the Facebook social icon/link in footer.
- Base URL constant: `https://ddouble-store.vercel.app`.
- `@/` alias = `src/`. Use it in all imports.

---

## Part 1: Cleanup — Remove Dead Code & Unused Imports

**Goal:** Clean up the codebase so all later work is safe and reviewable.

### Task 1.1: Remove unused `Price` import in Shop.jsx

**Files:**
- Modify: `src/pages/Shop.jsx`

- [ ] **Step 1: Confirm `Price` unused**

```bash
grep -n "Price" src/pages/Shop.jsx
```

Expected: `Price` appears only on the import line `import Price from "@/components/ddouble/Price";` and nowhere else in the file.

- [ ] **Step 2: Remove the import line**

```bash
sed -i '/import Price from "@\/components\/ddouble\/Price";/d' src/pages/Shop.jsx
```

- [ ] **Step 3: Lint**

```bash
npm run lint
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Shop.jsx && git commit -m "fix: remove unused Price import from Shop.jsx"
```

### Task 1.2: Delete dead files

**Files:**
- Delete: `src/hooks/usePersistentCart.js`, `src/hooks/use-mobile.jsx`, `src/hooks/use-size.jsx`, `src/utils/index.ts`

- [ ] **Step 1: Verify all four files unreferenced**

```bash
grep -rn "usePersistentCart\|use-mobile\|use-size\|utils/index\|from.*@/utils" src/ --include="*.jsx" --include="*.js" --include="*.ts" | grep -v "^src/hooks/usePersistentCart.js\|^src/hooks/use-mobile.jsx\|^src/hooks/use-size.jsx\|^src/utils/index.ts"
```

Expected: no output (no external references).

- [ ] **Step 2: Delete files**

```bash
rm src/hooks/usePersistentCart.js src/hooks/use-mobile.jsx src/hooks/use-size.jsx src/utils/index.ts
```

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

Expected: both green.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: remove dead files (usePersistentCart, use-mobile, use-size, utils/index.ts)"
```

### Task 1.3: Audit and remove unused shadcn UI components

**Files:**
- Modify: `src/components/ui/` (delete unused)

- [ ] **Step 1: List all ui/ imports**

```bash
grep -rn "components/ui" src/ --include="*.jsx" --include="*.js" | grep import
```

Expected kept (imported somewhere): `button`, `input`, `label`, `toast`, `toaster`, `use-toast`, `accordion`, `input-otp`, `country-select`, `address-autocomplete`.

- [ ] **Step 2: Check each ui file for importers**

```bash
for f in src/components/ui/*; do name=$(basename "$f" .jsx); echo "== $name =="; grep -rln "$name" src/ --include="*.jsx" --include="*.js" | grep -v "^src/components/ui/"; done
```

- [ ] **Step 3: Delete files with zero importers**

Remove every ui/ file that appears in no import statement (verify one-by-one; do not delete the 10 kept components).

- [ ] **Step 4: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: remove unused shadcn ui components"
```

### Task 1.4: Add `dist/` to .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add dist entries**

Add to `.gitignore` (already has `dist` — add `dist/` and `dist/**`):

```
dist/
dist/**
```

- [ ] **Step 2: Untrack existing dist if tracked**

```bash
git rm -r --cached dist/ 2>/dev/null || true
```

- [ ] **Step 3: Verify + commit**

```bash
git add .gitignore && git commit -m "chore: ignore dist/"
```

**Part 1 Acceptance:** lint green; no unused files left; dist no longer tracked.

---

## Part 2: Auth/Account Pages — Match Storefront Visual Language

**Goal:** Make auth/account pages match the premium storefront visual language; fix inconsistent radii, CTA hovers, icon sizing, favicon.

### Task 2.1: Restyle AuthLayout and AccountLayout

**Files:**
- Modify: `src/components/AuthLayout.jsx`, `src/components/AccountLayout.jsx`

- [ ] **Step 1: Read both layouts**

```bash
cat src/components/AuthLayout.jsx src/components/AccountLayout.jsx
```

- [ ] **Step 2: Convert to storefront tokens**

Replace shadcn card style (`rounded-2xl`, `border-border`, `bg-card`) with storefront hairline style: `bg-[#F9F9F7]`, `border border-[#E5E5E1]`, `rounded-none` (square corners), Inter 300-500 text, uppercase tracked labels. Keep all props/children identical.

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

### Task 2.2: Restyle account pages

**Files:**
- Modify: `src/pages/account/Profile.jsx`, `Orders.jsx`, `Addresses.jsx`, `Wishlist.jsx`, `Settings.jsx`

- [ ] **Step 1: Apply token sweep per page**

Same conversion as Task 2.1: square corners (`rounded-none`), `border-[#E5E5E1]`, bg `#F9F9F7`, Inter 300-500, uppercase tracked labels. Replace any `rounded-lg`/`rounded-2xl` shadcn cards with hairline-border style. Keep functionality identical.

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

### Task 2.3: Unified CTA pattern

**Files:**
- Modify: `src/pages/ProductDetail.jsx`, `src/pages/Home.jsx`, `src/pages/About.jsx`, `src/pages/Contact.jsx`, `src/components/ddouble/StickyAddToCart.jsx`, `src/components/ddouble/CartDrawer.jsx`

- [ ] **Step 1: Define canonical CTA classes**

Primary CTA = `bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.15em] hover:bg-[#2A2A2A] disabled:opacity-50`.

- [ ] **Step 2: Replace beige-wash hovers**

Find all `hover:bg-[#D9D2C5] hover:text-[#1A1A1A]` on primary buttons (ProductDetail ATC, Home hero CTAs, About/Contact submit, StickyAddToCart, CartDrawer Checkout) and replace hover with `hover:bg-[#2A2A2A]` (text stays white).

```bash
grep -rn "hover:bg-\[#D9D2C5\]" src/ --include="*.jsx"
```

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

### Task 2.4: Standardize radii

**Files:** Sweep all components.

- [ ] **Step 1: Find stray radii**

```bash
grep -rn "rounded" src/ --include="*.jsx" | grep -v "rounded-full\|rounded-none"
```

- [ ] **Step 2: Normalize**

Elements square (`rounded-none`) except circular icon buttons and dots (`rounded-full`). Remove stray `rounded-sm`/`rounded-lg`/`rounded-2xl` on cards/inputs/buttons.

- [ ] **Step 3: Lint + build**

### Task 2.5: Unify icon sizes

- [ ] **Step 1: Enforce size rules**

Nav/footer icons 18px; in-button icons 14-16px; steppers 14px; micro-icons 12px. Sweep `size={}` props on lucide icons in Navbar, Footer, ProductDetail, CartDrawer, StickyAddToCart, Shop.

- [ ] **Step 2: Lint + build**

### Task 2.6: New favicon

**Files:**
- Create: `public/favicon.svg`
- Modify: `index.html`

- [ ] **Step 1: Create `public/favicon.svg`**

Simple "DD" monogram: black square `#1A1A1A` with `#F9F9F7` letters, or inverse. Example:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#1A1A1A"/>
  <text x="32" y="42" font-family="Inter, Helvetica, Arial, sans-serif" font-size="28" font-weight="600" letter-spacing="1" fill="#F9F9F7" text-anchor="middle">DD</text>
</svg>
```

- [ ] **Step 2: Reference in index.html**

Add `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` to `<head>`. Remove the old data-URI favicon link.

- [ ] **Step 3: Lint + build + verify**

```bash
npm run lint && npm run build && ls dist/favicon.svg
```

### Task 2.7: Restyle PageNotFound visuals

**Files:**
- Modify: `src/lib/PageNotFound.jsx`

- [ ] **Step 1: Apply palette**

bg `#F9F9F7`, Inter, square buttons, brand CTA `bg-[#1A1A1A] hover:bg-[#2A2A2A]`. Visual-only change; content rewrite deferred to Part 9.

- [ ] **Step 2: Lint + build**

**Part 2 Acceptance:** Auth/account pages look like the storefront; one CTA hover style site-wide; new favicon renders in tab; lint green.

---

## Part 3: Navbar/Header — Fix Links, Center Logo, Breadcrumbs, Search

**Goal:** Fix the broken category link, stabilize the header layout, add breadcrumbs, improve search UX.

### Task 3.1: Fix broken "Bedding & Pillows" link

**Files:**
- Modify: `src/components/ddouble/Navbar.jsx`, `src/components/ddouble/Footer.jsx`

- [ ] **Step 1: Replace handle in both files**

`/shop?category=blankets-pillows` → `/shop?category=bedding-pillows` (2 occurrences: Navbar.jsx NAV_LINKS + Footer.jsx Shop column).

```bash
sed -i 's|category=blankets-pillows|category=bedding-pillows|g' src/components/ddouble/Navbar.jsx src/components/ddouble/Footer.jsx
```

- [ ] **Step 2: Lint + build**

### Task 3.2: Dynamic collection links

**Files:**
- Modify: `src/components/ddouble/Navbar.jsx`, `src/components/ddouble/Footer.jsx`

- [ ] **Step 1: Import hook in Navbar**

```jsx
import { useCollections } from "@/hooks/useProducts";
```

- [ ] **Step 2: Build Collections dropdown from live data**

In Navbar: replace hardcoded `NAV_LINKS` children array for Collections with `const { data: collections } = useCollections();` and build children: `collections.map(c => ({ label: c.title, path: `/shop?category=${c.handle}` }))`. While loading (no data yet), fall back to the current hardcoded children.

- [ ] **Step 3: Footer Shop links from live data**

In Footer: `useCollections()`; render `collections.map(c => <Link to={`/shop?category=${c.handle}`}>{c.title}</Link>)`. Keep "All Products" first. Fall back to hardcoded list while loading.

- [ ] **Step 4: Lint + build**

### Task 3.3: Logo centering — 3-column layout

**Files:**
- Modify: `src/components/ddouble/Navbar.jsx`

- [ ] **Step 1: Remove absolute positioning hack**

Delete `className="absolute left-[36%] md:left-[45%] -translate-x-1/2 ..."` on the logo Link.

- [ ] **Step 2: 3-column flex**

Inside the `h-16 md:h-20` row, use three children with fixed-width side columns:

```jsx
<div className="flex items-center justify-between h-16 md:h-20">
  {/* Left: mobile menu button (lg:hidden) + desktop nav (hidden lg:flex) */}
  <div className="flex items-center gap-8 flex-1">
    <button className="lg:hidden ...">...</button>
    <div className="hidden lg:flex items-center gap-8">...nav links...</div>
  </div>
  {/* Center: logo — flex-1 text-center */}
  <Link to="/" className="flex-1 text-center text-xl md:text-2xl font-semibold tracking-[0.08em] text-[#1A1A1A]">
    DDOUBLE
  </Link>
  {/* Right: icons — flex-1 justify-end */}
  <div className="flex items-center gap-4 md:gap-5 flex-1 justify-end">...</div>
</div>
```

Logo stays centered at all breakpoints because side columns are equal `flex-1`.

- [ ] **Step 3: Lint + build + manual check**

```bash
npm run lint && npm run build
```

### Task 3.4: Breadcrumbs

**Files:**
- Create: `src/components/ddouble/Breadcrumb.jsx`
- Modify: `src/pages/ProductDetail.jsx`, `src/pages/Shop.jsx`

- [ ] **Step 1: Create Breadcrumb component**

```jsx
import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="px-6 md:px-10 lg:px-16 py-4">
      <ol className="flex flex-wrap items-center gap-2 text-[11px]">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-[#6B6B67]">/</span>}
            {item.href ? (
              <Link to={item.href} className="text-[#6B6B67] hover:text-[#1A1A1A] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#1A1A1A]" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 2: ProductDetail — replace "Back to Shop"**

Replace the `<Link ...><ArrowLeft/> Back to Shop</Link>` block with:

```jsx
<Breadcrumb items={[
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: product.title },
]} />
```

- [ ] **Step 3: Shop — category breadcrumb**

When `category !== "all"` and `activeCollection` exists, render above the h1:

```jsx
<Breadcrumb items={[
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: activeCollection.title },
]} />
```

- [ ] **Step 4: Lint + build**

### Task 3.5: Search UX

**Files:**
- Modify: `src/components/ddouble/Navbar.jsx`

- [ ] **Step 1: Popular searches when empty**

When `searchOpen && !searchQuery.trim()`, render below the input:

```jsx
<div className="mt-3 pt-3 border-t border-[#E5E5E1]">
  <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B67] mb-2">Popular searches</p>
  <div className="flex flex-wrap gap-2">
    {["Poster", "Rug", "Bedding"].map((term) => (
      <button key={term} onClick={() => setSearchQuery(term)}
        className="text-xs border border-[#E5E5E1] px-3 py-1.5 hover:border-[#1A1A1A] transition-colors">
        {term}
      </button>
    ))}
  </div>
</div>
```

- [ ] **Step 2: No-results suggestion**

Replace `No results found.` with:

```jsx
<p className="mt-3 text-xs text-[#6B6B67]">
  No results for '{searchQuery}' — try <button onClick={() => setSearchQuery("Poster")} className="underline underline-offset-2 text-[#1A1A1A]">Poster</button>
</p>
```

- [ ] **Step 3: Escape closes search**

Add to the search input `onKeyDown`: `if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }`.

- [ ] **Step 4: Lint + build**

**Part 3 Acceptance:** Bedding & Pillows shows 5 products; logo centered; breadcrumbs present; search shows suggestions; lint/build green.

---

## Part 4: Homepage — Hero, Mobile Order, LCP, Collection Cards, FadeIn

**Goal:** Strengthen above-the-fold, fix mobile hero ordering, make collection cards fast, reduce animation lag.

### Task 4.1: Hero copy

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Read Home.jsx**

```bash
cat src/pages/Home.jsx
```

- [ ] **Step 2: Update headline + subline**

Headline: `Museum-grade wall art, made in Copenhagen.` Subline: state what the product IS (prints/objects) + one differentiator, using ONLY facts already claimed in About/FAQ copy. Keep Shop All CTA.

### Task 4.2: Mobile hero order

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Image above text on <lg**

Use `flex flex-col-reverse lg:flex-row` on the hero container (or `order-1`/`order-2` utilities on children). On `<lg` image renders first (above fold), on `lg` keep current split.

- [ ] **Step 2: Tighten mobile padding**

Reduce the text block's `py-32` on mobile (e.g. `py-12 md:py-32` or similar) so the fold isn't empty.

### Task 4.3: LCP hero image

**Files:**
- Modify: `src/pages/Home.jsx`, `index.html`

- [ ] **Step 1: width/height + srcset + fetchpriority on hero img**

```jsx
<img
  src={`${heroUrl}?width=1200`}
  srcSet={`${heroUrl}?width=800 800w, ${heroUrl}?width=1200 1200w, ${heroUrl}?width=1600 1600w`}
  sizes="(max-width: 768px) 100vw, 1200px"
  width="1200"
  height="800"
  fetchPriority="high"
  alt="..."
/>
```

(Use the actual hero image URL from Home.jsx.)

- [ ] **Step 2: Preload link in index.html**

```html
<link rel="preload" as="image" href="/images/home.jpg" imagesrcset="/images/home.jpg?width=800 800w, /images/home.jpg?width=1200 1200w" imagesizes="(max-width: 768px) 100vw, 1200px">
```

Adjust href to the real hero asset path. Note: if hero is a Shopify CDN URL, preload that URL instead.

### Task 4.4: Collection cards from collection images

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Stop fetching first product per card**

Remove `useCollectionProducts` usage in CollectionCard. Use the collection's own `image` from `useCollections()` (already loaded) for the thumbnail.

- [ ] **Step 2: Placeholder fallback**

If `collection.image` is null, render a styled placeholder box with the collection name (bg `#F1F0EC`, centered uppercase label).

### Task 4.5: FadeIn — reduced motion, faster

**Files:**
- Modify: `src/components/ddouble/FadeIn.jsx`

- [ ] **Step 1: prefers-reduced-motion support**

```jsx
export default function FadeIn({ children, className = "", delay = 0 }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div ... transition={{ duration: 0.5, delay: Math.min(delay, 0.4), ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Remove direction option**

Grep callers: `grep -rn "direction=" src/ --include="*.jsx"`. If no callers pass `direction`, remove it and the directionMap entirely.

### Task 4.6: Instagram section — conditional + lazy images

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Render only when products exist**

Wrap "Follow our journey" section in `{allProducts?.length > 0 && (...)}`.

- [ ] **Step 2: width/height + loading="lazy"**

On each Instagram grid image add `width="400" height="400" loading="lazy"`.

### Task 4.7: Verify

- [ ] **Step 1: Lint + build**

```bash
npm run lint && npm run build
```

**Part 4 Acceptance:** Mobile fold shows image; collection cards load instantly from collection images; reduced-motion honored; lint/build green.

---

## Part 5: Product Detail — Images, Zoom A11y, Honest Room View, ATC, Sanitizer, Related, Trust

**Goal:** Image optimization, keyboard-accessible gallery/zoom, honest in-room view, clean add-to-cart, hardened accordions, better related products, sticky ATC fixes, trust strip.

### Task 5.1: shopifyImage + clamp helpers

**Files:**
- Modify: `src/lib/utils.js`

- [ ] **Step 1: Add helpers**

```js
export function shopifyImage(url, width) {
  if (!url) return null;
  return url.includes("?") ? `${url}&width=${width}` : `${url}?width=${width}`;
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
```

### Task 5.2: Apply shopifyImage everywhere

**Files:**
- Modify: `src/pages/ProductDetail.jsx`, `src/components/ddouble/ProductCard.jsx`, `src/components/ddouble/CartDrawer.jsx`, `src/components/ddouble/Navbar.jsx`, `src/pages/account/Wishlist.jsx`, `src/pages/account/Orders.jsx`

- [ ] **Step 1: Import helper**

In each file: `import { shopifyImage } from "@/lib/utils";`

- [ ] **Step 2: Apply per use width**

- Main PDP gallery image: `shopifyImage(displayImage, 1200)` + width/height attrs + `fetchPriority="high"`.
- PDP gallery thumbs: `shopifyImage(img.url, 200)`, width/height 80x80.
- ProductCard grid images: `shopifyImage(product.image, 600)`.
- CartDrawer line thumbs: `shopifyImage(item.image, 160)` + explicit width/height (w-20 h-24) to reserve aspect.
- Navbar search results: `shopifyImage(product.image, 160)`.
- Wishlist/Orders thumbs: width 160 (list) / 600 (grid).

- [ ] **Step 3: Lint + build**

### Task 5.3: Zoom/gallery a11y

**Files:**
- Modify: `src/pages/ProductDetail.jsx`

- [ ] **Step 1: Zoom div → real button**

```jsx
<button
  type="button"
  onClick={() => setZoomed(!zoomed)}
  aria-label="Zoom image"
  aria-pressed={zoomed}
  className={`relative overflow-hidden bg-[#F1F0EC] cursor-zoom-in w-full ${zoomed ? "cursor-zoom-out" : ""}`}
>
  <img ... />
</button>
```

- [ ] **Step 2: Reset zoom on image change**

Add to the existing `useEffect(() => setSelectedImage(null), [selectedOptions])` also `setZoomed(false)`; and reset when `selectedImage` changes:

```jsx
useEffect(() => { setZoomed(false); }, [selectedImage]);
```

- [ ] **Step 3: Gallery thumb aria**

Add `aria-label={`View image ${i + 1}`}` and `aria-current={matchedThumb === i ? "true" : undefined}` to each thumb button.

### Task 5.4: Honest "View in Room"

**Files:**
- Modify: `src/pages/ProductDetail.jsx`

- [ ] **Step 1: Remove hardcoded LIFESTYLE_IMAGES**

Delete `const LIFESTYLE_IMAGES = {...}`.

- [ ] **Step 2: Per-product room image**

Define `const roomImage = product.images.length > 1 ? product.images[1]?.url : null;` (second image = in-room shot when present).

- [ ] **Step 3: Toggle only when available**

Render the Product / View-in-Room toggle buttons only when `roomImage` exists. When toggled, main img src = `shopifyImage(roomImage, 1200)`. Remove `scaleX(-1)` mirror hack and the `style transform` combining showRoom + zoom (apply zoom scale only; room view uses a real different image).

### Task 5.5: Clean ATC label

**Files:**
- Modify: `src/pages/ProductDetail.jsx`

- [ ] **Step 1: Fix button content**

Replace `{cartLoading ? "Adding..." : `Add to Cart — `}{!cartLoading && <Price amount={displayPrice} />}` with:

```jsx
{cartLoading ? "Adding…" : selectedVariant ? `Add to Cart · ${displayPrice.toFixed(2)}` : "Select options"}
```

(Render plain text with currency symbol from `useCurrency()` — check CurrencyContext for a symbol/format helper; if none exists, use `currency === "GBP" ? "£" : "$"` prefix.)

- [ ] **Step 2: Helper text when unselected**

Below the button, when `product.options.some(o => o.values.length > 1) && !selectedVariant`, render:

```jsx
<p className="mt-2 text-xs text-[#6B6B67]">Select your options above to add to cart.</p>
```

### Task 5.6: Accordion a11y — h2 outside button

**Files:**
- Modify: `src/pages/ProductDetail.jsx` (AccordionSection)

- [ ] **Step 1: Restructure**

```jsx
<h2 className="text-2xl md:text-3xl font-light">
  <button
    onClick={handleToggle}
    aria-expanded={isOpen}
    className="flex items-center justify-between w-full text-left cursor-pointer group"
  >
    <span>{title}</span>
    <ChevronDown size={20} className={`text-[#6B6B67] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
  </button>
</h2>
```

Keep the maxHeight transition div unchanged. Remove the manual onKeyDown handler (native button handles Enter/Space).

### Task 5.7: Description sanitization

**Files:**
- Modify: `src/pages/ProductDetail.jsx`
- Modify: `package.json` (add `dompurify` if absent — this is an allowed dep)

- [ ] **Step 1: Check dompurify presence**

```bash
grep -q dompurify package.json && echo present || npm install dompurify
```

- [ ] **Step 2: Sanitize**

```jsx
import DOMPurify from "dompurify";

const sanitizedHtml = useMemo(() => {
  if (!product?.descriptionHtml) return "";
  return DOMPurify.sanitize(product.descriptionHtml, {
    ALLOWED_TAGS: ["p", "ul", "ol", "li", "strong", "em", "br", "a"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  }).replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
}, [product?.descriptionHtml]);
```

Use `dangerouslySetInnerHTML={{ __html: sanitizedHtml }}` (only when `product.descriptionHtml` non-empty, as today).

- [ ] **Step 3: Lint + build**

### Task 5.8: Related products — same collection first

**Files:**
- Modify: `src/pages/ProductDetail.jsx`

- [ ] **Step 1: Use useCollections + product collection info**

Import `useCollections` and `useCollectionProducts` if not already. Replace Math.random sort:

```jsx
const related = useMemo(() => {
  if (!allProducts || !product) return [];
  const others = allProducts.filter((p) => p.handle !== product.handle);
  // Prefer products sharing the first tag/category word as a cheap same-collection signal,
  // or use collectionProducts from useCollectionProducts when a collection matches.
  const sameCollection = others.filter((p) =>
    p.tags?.some((t) => product.tags?.includes(t))
  );
  const rest = others.filter((p) => !sameCollection.includes(p));
  return [...sameCollection.slice(0, 4), ...rest.slice(0, 4 - Math.min(sameCollection.length, 4))];
}, [allProducts, product]);
```

(If a `product.collectionHandle` exists from data, prefer exact collection match; otherwise tag overlap is the cheap coherent signal. Keep 4 items.)

### Task 5.9: Trust strip

**Files:**
- Modify: `src/pages/ProductDetail.jsx`

- [ ] **Step 1: Add trust row in buy zone**

Replace/extend the existing shipping info block with a consistent row (numbers read from the Part 7 config once created — use `FREE_SHIPPING_THRESHOLD`):

- "Free shipping over £X" (from config)
- "30-day returns"
- "Ships in 1-2 days"
- "Tracked delivery"

Render as a 2x2 muted grid under the ATC button (reuse Truck/RotateCcw icons at 14px).

### Task 5.10: StickyAddToCart — safe area + hide at footer

**Files:**
- Modify: `src/components/ddouble/StickyAddToCart.jsx`

- [ ] **Step 1: Safe area**

Add `style={{ paddingBottom: "env(safe-area-inset-bottom)" }}` to the fixed container.

- [ ] **Step 2: Hide near page bottom**

Add an IntersectionObserver on `document.querySelector("footer")` (via prop `footerRef` or query): when footer intersects viewport, set `hidden` state; render `translate-y-full` when hidden or when `!visible`.

**Part 5 Acceptance:** All images size-optimized; zoom keyboard-accessible; in-room honest; ATC label clean; sanitizer in place; related products coherent; lint/build green.

---

## Part 6: Shop Page — URL State, Sort, Counts, Load-More, Filter Sheet, Errors

**Goal:** URL-synced filters, a real featured sort, product counts, pagination, better empty/error states, proper mobile filter sheet.

### Task 6.1: URL state drives filters

**Files:**
- Modify: `src/pages/Shop.jsx`

- [ ] **Step 1: Derive state from useSearchParams**

```jsx
const [searchParams, setSearchParams] = useSearchParams();
const category = searchParams.get("category") || "all";
const priceRange = searchParams.get("price") || "all";
const sort = searchParams.get("sort") || "default";
const searchQuery = searchParams.get("q") || "";
```

Remove the local `useState` for these four and the `useEffect` sync block. `const [filtersOpen, setFiltersOpen] = useState(false);` and `sortOpen` stay local.

- [ ] **Step 2: Update helpers**

```jsx
const updateParam = (key, value, mode = "replace") => {
  const params = new URLSearchParams(searchParams);
  if (!value || value === "all") params.delete(key);
  else params.set(key, value);
  setSearchParams(params, { replace: mode === "replace" });
};
```

Wire: category → `updateParam("category", cat, "push")` (used by FilterGroup onChange), price → `updateParam("price", r, "replace")`, sort → `updateParam("sort", s, "replace")`, search → `updateParam("q", q, "push")` (from the existing search input in Shop if present; Navbar already navigates with `?q=`).

- [ ] **Step 3: clearFilters updates URL**

```jsx
const clearFilters = () => {
  const params = new URLSearchParams(searchParams);
  params.delete("category"); params.delete("price"); params.delete("q");
  setSearchParams(params, { replace: true });
};
```

- [ ] **Step 4: Lint + build**

### Task 6.2: Honest sort

**Files:**
- Modify: `src/pages/Shop.jsx`

- [ ] **Step 1: Replace "best" with real behavior**

Check `normalizeProduct` in `src/hooks/useProducts.js`: if products expose a created date or position, add `createdAt: node.createdAt` to the normalizer. Update SORT_OPTIONS:

```js
const SORT_OPTIONS = [
  { id: "default", label: "Default" },
  { id: "price-asc", label: "Price: Low–High" },
  { id: "price-desc", label: "Price: High–Low" },
  { id: "alpha", label: "A–Z" },
];
```

- [ ] **Step 2: Implement "Default"**

If `createdAt` available: `default` sorts newest-first (`b.createdAt - a.createdAt`). Otherwise leave insertion order (Shopify query order) and label "Default". No silent no-op sort.

- [ ] **Step 3: Lint + build**

### Task 6.3: Product counts on every category view

**Files:**
- Modify: `src/pages/Shop.jsx`

- [ ] **Step 1: Compute count for categories**

In `CollectionProducts`, pass `count` up (products.length). Header copy:

```jsx
<p className="mt-2 text-sm text-[#6B6B67]">
  {loading ? "Loading…" : `${count} ${count === 1 ? "piece" : "pieces"}`}
</p>
```

Show for `category === "all"` AND category views (currently only "all" shows it).

### Task 6.4: Load-more pagination

**Files:**
- Modify: `src/hooks/useProducts.js`, `src/pages/Shop.jsx`

- [ ] **Step 1: Extend useAllProducts with after param**

```js
export function useAllProducts(country, after = null) {
  return useQuery({
    queryKey: ["products", "all-posters", country, after],
    queryFn: async () => {
      const data = await shopifyFetch(ALL_PRODUCTS(country), { first: 50, after });
      return {
        products: data.products.edges.map(({ node }) => normalizeProduct(node)),
        pageInfo: data.products.pageInfo,
      };
    },
    staleTime: 60 * 1000,
  });
}
```

(Keep old shape compatible: Shop currently expects an array. Adjust Shop to `data?.products || []`.)

- [ ] **Step 2: Load-more in Shop**

```jsx
const [cursor, setCursor] = useState(null);
const { data, isLoading, isFetching } = useAllProducts(country, cursor);
const pageInfo = data?.pageInfo;

const loadMore = () => {
  if (pageInfo?.hasNextPage) setCursor(pageInfo.endCursor);
};

{pageInfo?.hasNextPage && (
  <button
    onClick={loadMore}
    disabled={isFetching}
    className="mt-16 mx-auto block text-xs uppercase tracking-[0.15em] border border-[#1A1A1A] px-8 py-4 hover:bg-[#1A1A1A] hover:text-white transition-colors disabled:opacity-50"
  >
    {isFetching ? "Loading…" : "Load more"}
  </button>
)}
```

Append pages: keep `allProducts` as accumulated array via `useMemo` combining fetched pages (or `queryClient.setQueryData` append in loadMore). Simplest correct approach: accumulate in state — `setPages(prev => [...prev, ...data.products])` inside a `useEffect` keyed on cursor/data; dedupe by id.

- [ ] **Step 3: Lint + build**

### Task 6.5: Mobile filter bottom-sheet

**Files:**
- Modify: `src/pages/Shop.jsx`

- [ ] **Step 1: Use Radix Dialog**

`@radix-ui/react-dialog` is already a dependency. On `<md` render filters in a Dialog (position bottom sheet): `DialogContent` with `aria-modal`, Escape closes (Radix default), focus trap (Radix default). Keep the existing inline grid panel on `md:` and up.

```jsx
<Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
  <DialogContent className="fixed bottom-0 inset-x-0 max-h-[80vh] overflow-y-auto bg-[#F9F9F7] border-t border-[#E5E5E1] p-6">
    {/* FilterGroup category + price */}
  </DialogContent>
</Dialog>
```

Wrap the desktop inline panel in `hidden md:grid`; the Dialog sheet shows below `md` (render Dialog always, or gate with a `use-mobile`-style check — prefer CSS: render both, one hidden via `md:hidden` wrapper around the Dialog trigger+content wrapper… simplest: only open Dialog when window width < 768 via matchMedia listener).

- [ ] **Step 2: Lint + build**

### Task 6.6: Empty & error states

**Files:**
- Modify: `src/pages/Shop.jsx`

- [ ] **Step 1: Error state with retry**

In `ProductGrid` accept `error` + `refetch` props; render:

```jsx
<div className="py-24 text-center">
  <p className="text-sm text-[#6B6B67]">Something went wrong loading products.</p>
  <button onClick={refetch} className="mt-4 text-xs uppercase tracking-[0.1em] underline underline-offset-4 text-[#1A1A1A]">Try again</button>
</div>
```

- [ ] **Step 2: Friendlier empty copy**

Replace `No prints match your filters.` with `No pieces match your filters — try adjusting them.` Keep Clear Filters action.

- [ ] **Step 3: Combo tests**

Verify manually: `?category=all&q=poster`, `?category=posters&price=under-30`, `?category=bedding-pillows` all render correct filtered grids.

**Part 6 Acceptance:** Filters persist in URL; counts on all views; load-more works; filter sheet keyboard-accessible; error state retries; lint/build green.

---

## Part 7: Cart Drawer — A11y, Free Shipping, Trust, Thumbnails, Persistence, Buy Again

**Goal:** Accessible cart drawer, consistent free-shipping logic, payment trust signals, optimized thumbnails, persistence improvements, buy-again flow.

### Task 7.1: Drawer a11y

**Files:**
- Modify: `src/components/ddouble/CartDrawer.jsx`

- [ ] **Step 1: Escape-to-close + focus trap + restore**

Use Radix Dialog (`@radix-ui/react-dialog` already installed):

```jsx
import * as Dialog from "@radix-ui/react-dialog";

<Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
    <Dialog.Content
      className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#F9F9F7] shadow-2xl flex flex-col focus:outline-none"
      aria-labelledby="cart-heading"
    >
      <h2 id="cart-heading" className="...">Cart ({totalItems})</h2>
      ...
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

Radix gives: Escape close, focus trap, focus restore on close. Backdrop click closes (Overlay onClick). Remove the current manual `role="dialog"` div + `if (!open) return null`.

- [ ] **Step 2: Lint + build + manual Escape test**

### Task 7.2: Free-shipping config + helper

**Files:**
- Create: `src/config/shipping.js`
- Modify: `src/pages/ProductDetail.jsx`, `src/components/ddouble/CartDrawer.jsx`

- [ ] **Step 1: Create config**

```js
// src/config/shipping.js
// The threshold NUMBER is out of scope to change — centralize the existing displayed value.
// Note: the value is displayed in the active currency WITHOUT conversion; it is the base
// number shown in the current currency (e.g. 100 GBP shown as "£100.00" in GBP).
export const FREE_SHIPPING_THRESHOLD = 100;

export function shippingProgress(subtotal, threshold = FREE_SHIPPING_THRESHOLD) {
  const remaining = Math.max(0, threshold - subtotal);
  const percent = subtotal >= threshold ? 100 : Math.min(100, (subtotal / threshold) * 100);
  return { remaining, percent };
}
```

- [ ] **Step 2: Replace hardcoded usages**

ProductDetail has `Free shipping on orders over <Price amount={100} />` twice (shipping info block + ShippingReturnsContent) and FAQ may too. Replace with a `ShippingNote` that renders `FREE_SHIPPING_THRESHOLD` via `<Price amount={FREE_SHIPPING_THRESHOLD} />`. Keep the displayed VALUE identical (100).

- [ ] **Step 3: Lint + build**

### Task 7.3: Free-shipping progress bar in drawer

**Files:**
- Modify: `src/components/ddouble/CartDrawer.jsx`

- [ ] **Step 1: Add progress block above Subtotal**

```jsx
const { remaining, percent } = shippingProgress(totalPrice);

<div className="border-t border-[#E5E5E1] px-6 pt-4 pb-2">
  {remaining > 0 ? (
    <>
      <p className="text-[11px] text-[#6B6B67]">
        You're <span className="text-[#1A1A1A]"><Price amount={remaining} /></span> away from free shipping
      </p>
      <div className="mt-2 h-1 bg-[#E5E5E1]">
        <div className="h-1 bg-[#1A1A1A] transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>
    </>
  ) : (
    <p className="text-[11px] text-[#1A1A1A]">Free shipping unlocked</p>
  )}
</div>
```

### Task 7.4: Payment trust row

**Files:**
- Modify: `src/components/ddouble/CartDrawer.jsx`

- [ ] **Step 1: Add muted row under Checkout**

Inline SVG chips for Visa, Mastercard, PayPal, Apple Pay (no icon libs) + text `Secure checkout by Shopify`:

```jsx
<div className="pt-3 space-y-2">
  <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B67]">Secure checkout by Shopify</p>
  <div className="flex gap-2">
    <span className="text-[10px] font-bold text-[#6B6B67] border border-[#E5E5E1] px-2 py-1 rounded-sm">VISA</span>
    <span className="text-[10px] font-bold text-[#6B6B67] border border-[#E5E5E1] px-2 py-1 rounded-sm">Mastercard</span>
    <span className="text-[10px] font-bold text-[#6B6B67] border border-[#E5E5E1] px-2 py-1 rounded-sm">PayPal</span>
    <span className="text-[10px] font-bold text-[#6B6B67] border border-[#E5E5E1] px-2 py-1 rounded-sm"> Pay</span>
  </div>
</div>
```

(Text chips acceptable; inline SVG optional.)

### Task 7.5: Thumbnails (covered by Part 5.2 — verify)

- [ ] **Step 1: Confirm CartDrawer images use shopifyImage(…, 160) + explicit width/height classes** (done in Task 5.2 Step 2). Skip if already applied.

### Task 7.6: Persistence across devices (best effort)

**Files:**
- Modify: `src/hooks/useShopifyCart.js`

- [ ] **Step 1: Store cart id keyed to customer**

In `useShopifyCart`, when a stored customer token exists, also persist cart id under a customer-scoped key on `addItem`:

```js
const customerToken = getStoredCustomerToken();
if (customerToken) {
  localStorage.setItem(`shopify_cart_${customerToken.slice(0, 12)}`, updated.id);
}
```

On load (`syncCart`), prefer the customer-scoped cart id when a token exists, else the generic key. Best effort — wrap in try/catch.

- [ ] **Step 2: Abandoned-cart comment**

Add comment near `checkout`: `// Abandoned-cart email would hook here (server-side service required — not implemented).`

### Task 7.7: Buy again on Orders

**Files:**
- Modify: `src/pages/account/Orders.jsx`

- [ ] **Step 1: Read Orders.jsx**

```bash
cat src/pages/account/Orders.jsx
```

- [ ] **Step 2: Add "Buy again" per order**

For each order with line items, add button `Buy again` that loops `order.lineItems` calling `addItem(variantId, quantity)` from `useShopifyCart(country)`. Wrap each in try/catch; on failure `toast({ title: "Could not re-add {title}", variant: "destructive" })`. Note: variants may be inactive — the try/catch guards that.

- [ ] **Step 3: Lint + build**

**Part 7 Acceptance:** Drawer closes on Escape with trapped focus; free-shipping progress works; threshold read from one constant; payment trust row visible; lint/build green.

---

## Part 8: Auth — Real Email Verification, SPA Nav, Remove Deterministic Passwords, Favorites Sync

**Goal:** Real email verification, SPA navigation, consolidated favorites, remove the deterministic-password scheme, buy-again-friendly account area.

### Task 8.1: Replace fake OTP with email verification screen

**Files:**
- Modify: `src/pages/Register.jsx`
- Modify: `src/lib/firebaseAuth.js`

- [ ] **Step 1: Read firebaseAuth.js**

```bash
cat src/lib/firebaseAuth.js
```

- [ ] **Step 2: Ensure sendEmailVerification exported**

Add/confirm in `firebaseAuth.js`:

```js
export async function sendEmailVerification(user) {
  const { sendEmailVerification: send } = await import("firebase/auth");
  const u = user ?? getCurrentUser();
  if (!u) throw new Error("No signed-in user");
  return send(u);
}
```

- [ ] **Step 3: Rework Register.jsx**

Remove `showOtp`/`otpCode`/`handleVerify` states, the `InputOTP` import and the OTP JSX block. After `registerUser` succeeds, set `showVerifyScreen(true)` rendering:

```jsx
<AuthLayout icon={Mail} title="Check your inbox" subtitle={`We emailed a verification link to ${email}`}>
  <p className="text-sm text-[#6B6B67] text-center">
    Click the link in the email to verify your account, then log in.
  </p>
  <Button className="w-full h-12 font-medium" onClick={handleResend} disabled={loading}>
    {loading ? "Sending…" : "Resend email"}
  </Button>
  <p className="text-center text-sm text-[#6B6B67] mt-4">
    Already verified? <Link to="/login" className="text-[#1A1A1A] underline underline-offset-4">Log in</Link>
  </p>
</AuthLayout>
```

`handleResend` calls `sendEmailVerification(currentFirebaseUser)` (store the created user from `registerUser` return in state). Show success toast "Verification email sent".

- [ ] **Step 4: Login verification banner**

In `Login.jsx` after successful `loginViaEmailPassword`, if `user.emailVerified === false`, render a dismissible banner (state `showBanner`) above the form:

```jsx
{showBanner && (
  <div className="mb-4 p-3 border border-[#E5E5E1] bg-[#F1F0EC] text-sm text-[#1A1A1A] flex items-start justify-between gap-3">
    <span>Please verify your email — check your inbox for the verification link.</span>
    <button onClick={() => setShowBanner(false)} aria-label="Dismiss"><X size={14} /></button>
  </div>
)}
```

Do NOT block shopping. (Requires firebaseAuth login functions to return the user — check and adjust.)

- [ ] **Step 5: Lint + build**

### Task 8.2: SPA navigation — remove window.location hard redirects

**Files:**
- Modify: `src/pages/Login.jsx`, `src/pages/Register.jsx`, `src/pages/ForgotPassword.jsx`, `src/pages/ResetPassword.jsx`, `src/lib/AuthContext.jsx`

- [ ] **Step 1: Find all hard redirects**

```bash
grep -rn "window.location" src/ --include="*.jsx" --include="*.js"
```

- [ ] **Step 2: Replace with navigate()**

- Login.jsx `window.location.href = "/account"` → `navigate("/account")` (already imports useNavigate).
- Register.jsx (both Google + submit paths) → `navigate("/")` or `navigate("/login")` per flow.
- ForgotPassword/ResetPassword → `navigate(...)` after success.
- AuthContext.jsx `navigateToLogin` — if it uses `window.location`, replace with router navigation: AuthContext is inside Router? Check: App.jsx renders `<Router>` around `<AuthenticatedApp>`; AuthProvider is OUTSIDE Router, so AuthContext cannot call useNavigate. Fix: move `AuthProvider` inside `Router` in App.jsx, or use a `<Navigate>` component. Prefer: move Router up to wrap AuthProvider (verify no circular usage), then `const navigate = useNavigate()` in AuthContext. If risky, keep a `Navigate`-based redirect component in AuthenticatedApp for `auth_required`.

- [ ] **Step 3: Lint + build**

### Task 8.3: Remove deterministic password scheme

**Files:**
- Modify: `src/lib/auth/shopifySync.js`
- Create: `.env.local.example`

- [ ] **Step 1: Delete derivePassword**

Remove `derivePassword` entirely (known account-takeover vector).

- [ ] **Step 2: Opt-in backend sync**

```js
// src/lib/auth/shopifySync.js
const SYNC_ENDPOINT = import.meta.env.VITE_SHOPIFY_CUSTOMER_SYNC_ENDPOINT;

export async function syncShopifyCustomer(firebaseUser) {
  if (!firebaseUser?.email) return null;
  if (!SYNC_ENDPOINT) return null; // opt-in: no endpoint configured → skip client-side sync entirely

  try {
    const res = await fetch(SYNC_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || "",
        firebaseUid: firebaseUser.id,
        token: await firebaseUser.getIdToken(),
      }),
    });
    if (!res.ok) return null;
    const { accessToken } = await res.json();
    storeCustomerToken(accessToken); // use existing token storage from lib/shopify/customer
    return await getCustomer(accessToken);
  } catch {
    return null;
  }
}
```

Remove `createCustomer`/`createCustomerToken` imports if unused; keep `getCustomer`, `clearCustomerToken`, `storeCustomerToken` as available from `@/lib/shopify/customer` (check exports).

- [ ] **Step 3: Non-blocking notice in account area**

In `AccountLayout.jsx` or `Settings.jsx`: if `!import.meta.env.VITE_SHOPIFY_CUSTOMER_SYNC_ENDPOINT`, render a small muted note: "Account sync not configured — wishlist syncing is unavailable." Non-blocking.

- [ ] **Step 4: Create .env.local.example**

```bash
# .env.local.example
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
VITE_SHOPIFY_CUSTOMER_SYNC_ENDPOINT=https://your-backend.example.com/sync-shopify-customer
VITE_GOOGLE_MAPS_API_KEY=your_key_restricted_by_http_referrer
VITE_GA_MEASUREMENT_ID=G-XXXXXXX
```

- [ ] **Step 5: Verify derivePassword gone + lint**

```bash
grep -rn "derivePassword" src/  # must output nothing
npm run lint && npm run build
```

### Task 8.4: Favorites consolidation (one-way sync)

**Files:**
- Modify: `src/lib/FavoritesContext.jsx`, `src/lib/AccountContext.jsx`, `src/pages/account/Wishlist.jsx`, `src/lib/shopify/wishlist.js`

- [ ] **Step 1: Read AccountContext + wishlist.js**

```bash
cat src/lib/AccountContext.jsx src/lib/shopify/wishlist.js
```

- [ ] **Step 2: One-way sync on authenticate**

In `AccountContext` (or a small effect in `FavoritesContext` that reads auth state): when `isAuthenticated` becomes true, push local favorites into customer wishlist via existing `wishlist.js` functions (best-effort, idempotent — addFavorite should no-op for existing ids; wrap in try/catch). When account opens, load customer wishlist into the same items list the Favorites page shows.

- [ ] **Step 3: Same items on both pages**

Ensure `Wishlist.jsx` (account) and `Favorites.jsx` render from the same merged, idempotent source: after sync, local favorites and customer wishlist match. Dedupe by product id. Logged-out → localStorage only (current behavior).

- [ ] **Step 4: Lint + build**

### Task 8.5: Buy again on Orders (from Part 7.7 — confirm done)

- [ ] **Step 1: Verify Task 7.7 completed** (buy-again button + empty-state CTA already present). If Part 7 was skipped, implement here identically.

**Part 8 Acceptance:** No OTP anywhere; verification is email-link based; no deterministic passwords remain; sync is opt-in via env endpoint; favorites/wishlist show the same items; lint/build green.

---

## Part 9: SEO — Per-Route Meta, JSON-LD in Head, Sitemap, Robots

**Goal:** Per-route titles/meta/canonical/OG, JSON-LD in `<head>`, a real sitemap, breadcrumb schema, better meta copy.

### Task 9.1: Seo component (zero new deps)

**Files:**
- Create: `src/components/Seo.jsx`

- [ ] **Step 1: Create Seo head-manager**

```jsx
import { useEffect } from "react";

const SITE_URL = "https://ddouble-store.vercel.app";
const DEFAULT_TITLE = "DDouble — Museum-Grade Wall Art | Made in Copenhagen";
const DEFAULT_DESCRIPTION = "Fine-art prints and home objects, made in Copenhagen.";

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  if (content) el.setAttribute("content", content);
  else el.remove();
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
  if (href) el.setAttribute("href", href);
}

export default function Seo({ title, description, canonicalPath, image, noindex = false, jsonLd = null }) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title || DEFAULT_TITLE;
    setMeta("name", "description", description || DEFAULT_DESCRIPTION);
    if (canonicalPath) setLink("canonical", `${SITE_URL}${canonicalPath}`);
    setMeta("property", "og:title", title || DEFAULT_TITLE);
    setMeta("property", "og:description", description || DEFAULT_DESCRIPTION);
    setMeta("property", "og:url", canonicalPath ? `${SITE_URL}${canonicalPath}` : SITE_URL);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:image", image || "");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title || DEFAULT_TITLE);
    setMeta("name", "twitter:description", description || DEFAULT_DESCRIPTION);
    setMeta("name", "robots", noindex ? "noindex" : "");
    let ldScript = document.getElementById("page-jsonld");
    if (jsonLd) {
      if (!ldScript) {
        ldScript = document.createElement("script");
        ldScript.id = "page-jsonld";
        ldScript.type = "application/ld+json";
        document.head.appendChild(ldScript);
      }
      ldScript.textContent = JSON.stringify(jsonLd);
    } else if (ldScript) ldScript.remove();
    return () => { document.title = prevTitle; };
  }, [title, description, canonicalPath, image, noindex, jsonLd]);
  return null;
}
```

(Set `og:type` per page via optional prop if needed.)

### Task 9.2: Mount Seo per route

**Files:**
- Modify: `src/pages/Home.jsx`, `src/pages/Shop.jsx`, `src/pages/ProductDetail.jsx`, `src/pages/About.jsx`, `src/pages/Contact.jsx`, `src/pages/FAQ.jsx`, `src/lib/PageNotFound.jsx`

- [ ] **Step 1: Home**

```jsx
<Seo title="DDouble — Museum-Grade Wall Art | Made in Copenhagen" canonicalPath="/" />
```

- [ ] **Step 2: Shop**

```jsx
<Seo
  title={activeCollection ? `${activeCollection.title} — DDouble | Fine-Art Prints & Decor` : "Shop All — DDouble | Fine-Art Prints & Decor"}
  description="Fine-art prints and decor, made in Copenhagen."
  canonicalPath={category !== "all" ? `/shop?category=${category}` : "/shop"}
  jsonLd={category !== "all" ? breadcrumbJsonLd : null}
/>
```

- [ ] **Step 3: ProductDetail**

```jsx
<Seo
  title={`${product.title} — DDouble | Fine-Art Poster`}
  description={(product.description || product.title).slice(0, 155)}
  canonicalPath={`/product/${product.handle}`}
  image={product.image}
  jsonLd={productSchema}
/>
```

Move the existing inline `<script type="application/ld+json">` OUT of the JSX body into a `productSchema` useMemo (see Task 9.3). Also remove the JSON-LD from FAQ body into Seo (Task 9.4).

- [ ] **Step 4: About/Contact/FAQ** — distinct titles/descriptions, canonical paths.

- [ ] **Step 5: PageNotFound** — `<Seo noindex title="Page Not Found — DDouble" canonicalPath={null} />`.

### Task 9.3: Fix Product JSON-LD

**Files:**
- Modify: `src/pages/ProductDetail.jsx`
- Modify: `src/config/shipping.js` (add STORE_CURRENCY)

- [ ] **Step 1: Add STORE_CURRENCY**

In `src/config/shipping.js` add `export const STORE_CURRENCY = "GBP";`.

- [ ] **Step 2: Build schema in useMemo**

```jsx
const productSchema = useMemo(() => {
  if (!product) return null;
  const variant = selectedVariant || product.variants[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.title,
    image: product.image,
    url: `https://ddouble-store.vercel.app/product/${product.handle}`,
    brand: { "@type": "Brand", name: "DDouble" },
    offers: {
      "@type": "Offer",
      price: variant?.price ?? product.price,
      priceCurrency: STORE_CURRENCY,
      availability: variant?.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://ddouble-store.vercel.app/product/${product.handle}`,
    },
  };
}, [product, selectedVariant]);
```

- [ ] **Step 3: Breadcrumb JSON-LD on PDP**

```jsx
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
    { "@type": "ListItem", position: 3, name: product.title, item: `${SITE_URL}/product/${product.handle}` },
  ],
};
```

Include in Seo `jsonLd` (array of schemas allowed — wrap in `[]`).

### Task 9.4: FAQ JSON-LD into head

**Files:**
- Modify: `src/pages/FAQ.jsx`

- [ ] **Step 1: Read FAQ.jsx**

```bash
cat src/pages/FAQ.jsx
```

- [ ] **Step 2: Move FAQPage schema**

Take the existing inline FAQ JSON-LD (if present) and pass via Seo `jsonLd`. If none exists, add a minimal FAQPage schema built from the page's Q&A data (read-only use of existing copy).

### Task 9.5: Sitemap generator

**Files:**
- Create: `scripts/generate-sitemap.mjs`
- Modify: `package.json` (add `"sitemap"` script)

- [ ] **Step 1: Write generator**

```js
// scripts/generate-sitemap.mjs
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const SITE = "https://ddouble-store.vercel.app";

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  console.error("Missing env vars VITE_SHOPIFY_STORE_DOMAIN / VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  process.exit(1);
}

async function gql(query, variables) {
  const res = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const PRODUCTS_QUERY = `query($cursor: String) {
  products(first: 50, after: $cursor) { pageInfo { hasNextPage endCursor } edges { node { handle updatedAt } } }
}`;
const COLLECTIONS_QUERY = `query($cursor: String) {
  collections(first: 50, after: $cursor) { pageInfo { hasNextPage endCursor } edges { node { handle updatedAt } } }
}`;

async function fetchAll(query) {
  const items = [];
  let cursor = null, hasNext = true;
  while (hasNext) {
    const data = await gql(query, { cursor });
    const { edges, pageInfo } = data.products ? data.products : data.collections;
    items.push(...edges.map((e) => e.node));
    hasNext = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }
  return items;
}

const [products, collections] = await Promise.all([
  fetchAll(PRODUCTS_QUERY),
  fetchAll(COLLECTIONS_QUERY),
]);

const today = new Date().toISOString().split("T")[0];
const urls = [
  { loc: "/", lastmod: today, priority: "1.0" },
  { loc: "/shop", lastmod: today, priority: "0.9" },
  ...collections.map((c) => ({ loc: `/shop?category=${c.handle}`, lastmod: (c.updatedAt || "").slice(0, 10) || today, priority: "0.8" })),
  ...products.map((p) => ({ loc: `/product/${p.handle}`, lastmod: (p.updatedAt || "").slice(0, 10) || today, priority: "0.8" })),
  { loc: "/about", lastmod: today, priority: "0.5" },
  { loc: "/contact", lastmod: today, priority: "0.5" },
  { loc: "/faq", lastmod: today, priority: "0.5" },
  { loc: "/privacy", lastmod: today, priority: "0.3" },
  { loc: "/terms", lastmod: today, priority: "0.3" },
  { loc: "/shipping", lastmod: today, priority: "0.3" },
  { loc: "/returns", lastmod: today, priority: "0.3" },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${SITE}${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`).join("\n")}
</urlset>\n`;

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`Wrote sitemap with ${urls.length} URLs`);
```

(Adjust env var names to match actual names in `src/lib/shopify/client.js` — read it first.)

- [ ] **Step 2: Add npm script**

In package.json scripts: `"sitemap": "node scripts/generate-sitemap.mjs"`.

- [ ] **Step 3: Regenerate + commit**

```bash
npm run sitemap
git add public/sitemap.xml package.json scripts/ && git commit -m "feat: sitemap generator"
```

### Task 9.6: robots.txt + PageNotFound noindex

**Files:**
- Modify: `public/robots.txt`, `src/lib/PageNotFound.jsx` (Seo noindex from 9.2)

- [ ] **Step 1: Update robots.txt**

```
User-agent: *
Allow: /
Disallow: /account
Disallow: /favorites
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password

Sitemap: https://ddouble-store.vercel.app/sitemap.xml
```

- [ ] **Step 2: index.html cleanup**

Keep base title/description as fallback; remove any page-independent canonical/OG links that Seo now overrides (or keep as safe defaults — decision: remove to avoid duplicates, since Seo creates them on mount).

**Part 9 Acceptance:** Every route has unique title/meta/canonical; schema in head with real availability; sitemap lists all URLs; lint/build green.

---

## Part 10: Performance — Lazy Firebase, Caching, SW, Fonts, CLS

**Goal:** Shrink initial JS, add long-term caching, optimize images/fonts, avoid layout shift, add a service worker shell cache.

### Task 10.1: Lazy-load Firebase

**Files:**
- Modify: `src/lib/firebase.js`, `src/lib/firebaseAuth.js`

- [ ] **Step 1: Read both files**

```bash
cat src/lib/firebase.js src/lib/firebaseAuth.js
```

- [ ] **Step 2: Dynamic import**

Convert `src/lib/firebase.js` exports to an async init pattern; in `firebaseAuth.js` use `const { getAuth, signInWithEmailAndPassword, ... } = await import("firebase/auth");` inside each function, initializing the app lazily (module-level cached promise). AuthProvider in AuthContext calls these functions only after user interaction on auth routes, so firebase lands in a separate chunk.

- [ ] **Step 3: Measure bundle**

```bash
npm run build && ls -lh dist/assets/*.js | sort -k5 -h | tail -5
```

Record main JS size before/after. Target: main < 350KB raw (excluding firebase chunk).

### Task 10.2: Immutable asset caching

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Read vercel.json**

```bash
cat vercel.json
```

- [ ] **Step 2: Add headers**

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

Keep the existing SPA rewrite.

### Task 10.3: Minimal service worker

**Files:**
- Create: `public/sw.js`
- Modify: `src/main.jsx`

- [ ] **Step 1: Create public/sw.js**

```js
const CACHE = "ddouble-shell-v1";
const SHELL = ["/", "/index.html"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.origin !== location.origin) return; // never cache Shopify/API responses
  if (url.pathname.startsWith("/assets/")) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("/index.html")))
  );
});
```

- [ ] **Step 2: Register in main.jsx (production only)**

```jsx
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
```

### Task 10.4: Fonts — self-host or preload

**Files:**
- Modify: `index.html`, `src/index.css`

- [ ] **Step 1: Prefer self-hosting**

Download Inter woff2 (300/400/500/600, latin subset) into `public/fonts/`. Add `@font-face` rules in `src/index.css`:

```css
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 300 600;
  font-display: swap;
  src: url("/fonts/inter-latin.woff2") format("woff2");
}
```

Remove the Google Fonts `<link>` from index.html; add `<link rel="preload" as="font" href="/fonts/inter-latin.woff2" type="font/woff2" crossorigin>`.

If self-hosting impossible (no network fetch during task), keep Google Fonts but ensure preconnect links exist (they do) — document choice in a comment.

### Task 10.5: CLS sweep

**Files:** All `<img>` tags site-wide.

- [ ] **Step 1: Audit images**

```bash
grep -rn "<img" src/ --include="*.jsx"
```

- [ ] **Step 2: Add width/height or aspect classes**

Every `<img>` gets explicit `width`/`height` attributes (from known aspect ratios: 3/4 cards, 4/5 PDP, 1/1 lifestyle grid) or an aspect-ratio class already present (ProductCard has `aspect-[3/4]`). Cover: ProductCard, CartDrawer, Wishlist, Orders, Navbar search results, Home lifestyle grid, About image, PDP gallery + thumbs.

### Task 10.6: Hero LCP confirm

- [ ] **Step 1: Verify Part 4.3 artifacts present** (preload link, fetchpriority, srcset). Confirm smallest reasonable size used as `src`.

### Task 10.7: Trim unused JS — replace FadeIn

**Files:**
- Modify: `src/components/ddouble/FadeIn.jsx`, `src/main.jsx` (uninstall if fully replaced)

- [ ] **Step 1: Check framer-motion usage**

```bash
grep -rn "framer-motion" src/ --include="*.jsx" --include="*.js"
```

- [ ] **Step 2: Replace with IntersectionObserver reveal**

```jsx
import { useState, useEffect, useRef } from "react";

export default function FadeIn({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "-50px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: `opacity 0.5s ease ${Math.min(delay, 0.4)}s, transform 0.5s ease ${Math.min(delay, 0.4)}s`,
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Remove framer-motion**

If no other usage: `npm uninstall framer-motion`. Verify bundle shrink:

```bash
npm run build && ls -lh dist/assets/*.js | sort -k5 -h
```

**Part 10 Acceptance:** Initial JS payload measurably smaller; /assets cached immutable; SW registered in prod; fonts self-hosted or preloaded; no image CLS; lint/build green.

---

## Part 11: Accessibility — Contrast, Focus, Keyboard, ARIA, Touch Targets, Motion

**Goal:** Fix contrast, focus, keyboard, ARIA, touch targets, and motion preferences site-wide.

### Task 11.1: Contrast fixes

**Files:**
- Modify: `src/index.css`, site-wide components

- [ ] **Step 1: Darken muted text**

`#6B6B67` on `#F1F0EC` is ~4.2:1 — below 4.5:1. Introduce a darker muted token used for body-muted text: `#5A5A56`. Apply to: Footer text, placeholder text, breadcrumbs, filter labels, helper text. (Do NOT change the design system's `#6B6B67` identity globally where it sits on `#F9F9F7` at ≥4.5:1 — only fix failing pairs; on `#F1F0EC` backgrounds use `#5A5A56`.)

- [ ] **Step 2: 10px labels → 11px**

Audit `text-[10px]` uppercase labels (FilterGroup label, option names, footer headings, EstimatedDelivery heading, trust labels): bump to `text-[11px]` and use darker gray `#5A5A56`.

- [ ] **Step 3: Photo overlays**

"Curated for modern living" overlay and collection-card gradients: strengthen scrim to `bg-black/40` (verify current value; if `bg-black/30` or lower, raise).

### Task 11.2: Focus indicators

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Global focus-visible style**

```css
@layer base {
  :focus-visible {
    outline: 2px solid #1A1A1A;
    outline-offset: 2px;
  }
}
```

- [ ] **Step 2: Remove outline-none on interactive elements**

```bash
grep -rn "outline-none" src/ --include="*.jsx"
```

Remove `outline-none` from interactive elements (search input, quantity steppers, icon buttons, Navbar search input). Keep `outline-none` ONLY on the Radix Dialog content if it introduces a ring (replace with `focus:outline-none` on that one element if needed).

### Task 11.3: Touch targets ≥44px

- [ ] **Step 1: Enlarge small targets**

- ProductCard heart: `w-9 h-9` → `w-11 h-11`.
- CartDrawer qty steppers: `px-2 py-1` → `px-3 py-2` (min 44px height total — ensure combined height ≥44px; if row is small add `min-h-11`).
- Navbar icon buttons: `p-1` → `p-2.5` (or add `min-w-11 min-h-11 flex items-center justify-center`).
- Badge text `text-[9px]` → `text-[10px]`/`text-xs` (≥12px per spec — use `text-[10px]` minimum... spec says badge text ≥12px: use `text-xs`).
- Favorite heart on PDP: `w-10 h-10` → `w-11 h-11`.

- [ ] **Step 2: Lint + build**

### Task 11.4: Keyboard — panels close on Escape, focus managed

**Files:**
- Modify: `src/components/ddouble/Navbar.jsx`, `src/pages/Shop.jsx`, `src/components/ddouble/CurrencySelector.jsx`, `src/components/ddouble/CartDrawer.jsx`

- [ ] **Step 1: Audit panels**

Panels: CartDrawer (Radix Dialog — done Part 7), mobile menu, search overlay, filter sheet (Radix Dialog — done Part 6), sort menu, currency menu, mega menu.

- [ ] **Step 2: Mobile menu + search overlay + sort + currency**

For non-Radix panels, add a shared `useEscapeClose` pattern:

```jsx
function useEscapeClose(open, onClose) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);
}
```

Focus moves into the panel on open (ref + `el.focus()`), restored on close (store `document.activeElement` before open). Prefer swapping these panels to Radix Popover/Dialog where cleanest (both deps exist: check package.json — `@radix-ui/react-dialog` present; add `@radix-ui/react-popover` ONLY if needed; otherwise manual focus management).

- [ ] **Step 3: Mega menu keyboard**

Keep hover-open; add `onFocus`/`onBlur` (already present) — ensure the toggle button has `aria-expanded` and children links are tabbable when open; never trap focus. Add `aria-haspopup="true"` + `aria-expanded={megaOpen}` to the Collections button.

### Task 11.5: ARIA

- [ ] **Step 1: PDP qty +/- aria-labels** — `aria-label="Decrease quantity"` / `"Increase quantity"` (verify present; add if missing).
- [ ] **Step 2: Gallery thumbs** — `aria-label` + `aria-current` (done Part 5.3; verify).
- [ ] **Step 3: Decorative icons aria-hidden** — `Search`, `ShoppingBag`, `Heart`, `User` in Navbar: wrap icon in `<span aria-hidden="true">` or add `aria-hidden="true"` on the lucide icon (buttons already have aria-labels).
- [ ] **Step 4: aria-live** — `aria-live="polite"` on cart count badge in Navbar and on the Toaster region (check `src/components/ui/toaster.jsx` — add `aria-live="polite"` + `role="status"` if missing).

### Task 11.6: Semantics — skip link, single h1

**Files:**
- Modify: `src/components/ddouble/Navbar.jsx` (or App.jsx)

- [ ] **Step 1: Skip-to-content link**

At the top of Navbar (first element in header):

```jsx
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#1A1A1A] focus:text-white focus:px-4 focus:py-2 text-xs uppercase tracking-[0.15em]">
  Skip to content
</a>
```

Ensure each page's `<main>` has `id="main"` (add to Navbar-wrapped pages; PDP/Shop already have `<main>`).

- [ ] **Step 2: Single h1 per page**

Grep: `grep -rn "<h1" src/pages/ --include="*.jsx"`. Ensure exactly one per page (Home hero, Shop title, PDP product title, auth pages, account pages). If multiple, demote extras to h2.

### Task 11.7: Reduced motion CSS

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Global reduced-motion rule**

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Task 11.8: Forms — labels + aria-describedby

**Files:**
- Modify: `src/pages/Login.jsx`, `src/pages/Register.jsx`, `src/pages/Contact.jsx`, `src/components/ddouble/Footer.jsx` (newsletter)

- [ ] **Step 1: Error messaging with aria-describedby**

Where validation can fail (login/register/contact/newsletter), add error text elements with `id` and `aria-describedby` on the input:

```jsx
{error && (
  <p id="login-error" role="alert" className="text-xs text-[#1A1A1A] border border-[#E5E5E1] bg-[#F1F0EC] p-3">{error}</p>
)}
<input aria-describedby={error ? "login-error" : undefined} ... />
```

- [ ] **Step 2: Verify every field has label** (Login/Register/Contact/newsletter already mostly true — confirm `htmlFor`/`id` pairs).

- [ ] **Step 3: Lint + build**

**Part 11 Acceptance:** Contrast ≥4.5:1 on tested pairs; every dialog closes on Escape with focus management; all interactive targets ≥44px; keyboard-only session can complete add-to-cart; lint/build green.

---

## Part 12: Legal Pages, Cookie Consent, GA4, Security Headers

**Goal:** Real Privacy/Terms/Shipping/Returns pages, cookie consent banner, GA4 ecommerce events (opt-in), security headers and key hygiene.

### Task 12.1: Four legal pages

**Files:**
- Create: `src/pages/Privacy.jsx`, `src/pages/Terms.jsx`, `src/pages/Shipping.jsx`, `src/pages/Returns.jsx`
- Modify: `src/App.jsx` (routes)

- [ ] **Step 1: Read FAQ/About page template**

```bash
cat src/pages/FAQ.jsx | head -60
```

- [ ] **Step 2: Create pages using the site template**

Pattern: eyebrow label + h1 + body, storefront tokens. Content: honest, plain-language, generic-but-specific. Cover: data collected (Firebase account data, Google Maps address autocomplete, Shopify cart/order data, localStorage), how used, retention, third parties, cookies (analytics/cart), user rights (access/delete), contact. Use placeholder tokens `[Company legal name]` and `[Registered address]` where entity info is required — never fabricate. Add a comment in each page: `{/* TODO: fill in real legal entity name/address/VAT before launch */}`.

Each page gets `<Seo title="Privacy Policy — DDouble" canonicalPath="/privacy" />` (etc.).

- [ ] **Step 3: Routes in App.jsx**

```jsx
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Returns = lazy(() => import("./pages/Returns"));
...
<Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<Terms />} />
<Route path="/shipping" element={<Shipping />} />
<Route path="/returns" element={<Returns />} />
```

(Under existing Suspense.)

### Task 12.2: Footer links

**Files:**
- Modify: `src/components/ddouble/Footer.jsx`

- [ ] **Step 1: Fix policy links**

Bottom row: "Privacy Policy" → `/privacy`, "Terms of Service" → `/terms` (currently both → `/about`).

- [ ] **Step 2: Add Help column links**

In Help column add: "Shipping Policy" → `/shipping`, "Returns & Refunds" → `/returns`. (Current Help column points Shipping/Returns/Size Guide all to `/faq` — fix Shipping/Returns to real pages; Size Guide can stay `/faq`.)

### Task 12.3: Cookie consent banner

**Files:**
- Create: `src/components/CookieConsent.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create banner**

```jsx
import { useEffect, useState } from "react";

const CONSENT_KEY = "ddouble_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
  }, []);

  const decide = (value) => {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
    window.dispatchEvent(new CustomEvent("consent-change", { detail: value === "accepted" }));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[70] bg-[#1A1A1A] text-[#F9F9F7] px-6 py-4">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <p className="text-xs leading-relaxed max-w-xl">
          We use cookies to improve your experience and measure site usage. See our{" "}
          <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>.
        </p>
        <div className="flex gap-3 shrink-0">
          <button onClick={() => decide("rejected")} className="text-xs uppercase tracking-[0.15em] border border-[#F9F9F7] px-5 py-2.5 hover:bg-[#F9F9F7] hover:text-[#1A1A1A] transition-colors">
            Reject
          </button>
          <button onClick={() => decide("accepted")} className="text-xs uppercase tracking-[0.15em] bg-[#F9F9F7] text-[#1A1A1A] px-5 py-2.5 hover:bg-[#E5E5E1] transition-colors">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Mount in App.jsx**

`<CookieConsent />` next to `<Toaster />` inside providers.

### Task 12.4: GA4 analytics module

**Files:**
- Create: `src/lib/analytics.js`
- Modify: `src/main.jsx` (init)

- [ ] **Step 1: Create analytics module**

```js
// src/lib/analytics.js
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

function consentGranted() {
  return localStorage.getItem("ddouble_consent") === "accepted";
}

export function initAnalytics() {
  if (!GA_ID || !consentGranted() || typeof window === "undefined") return;
  if (window.gtag) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
}

export function trackEvent(name, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (!consentGranted()) return;
  window.gtag("event", name, params);
}
```

(Re-init on `consent-change` accept.)

- [ ] **Step 2: Wire events**

- `view_item` on PDP mount: `trackEvent("view_item", { currency, value: price, items: [{ item_id: handle, item_name: title, price }] })`.
- `add_to_cart` in ProductDetail `handleAddToCart` after success.
- `remove_from_cart` in CartDrawer `removeItem` after success.
- `begin_checkout` in CartDrawer `checkout` click. Add comment: `// purchase requires server-side confirmation (not implemented — client-only begin_checkout)`.
- `view_item_list` on Shop grid render, once per filter set change (useEffect keyed on category/price/sort/search).

All guarded by `typeof window` checks inside trackEvent (already).

### Task 12.5: Security headers

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Add headers**

```json
{
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
    ]},
    { "source": "/assets/(.*)", "headers": [
      { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
    ]}
  ]
}
```

CSP: do NOT add — Google Fonts/Maps/Shopify CDN + inline JSON-LD make a safe CSP fragile; note in vercel.json comment: `// CSP omitted: inline JSON-LD + third-party CDNs (Google Fonts/Maps, Shopify) would require extensive allowlists; revisit with backend` if a JSON comment is not possible, put the note in this plan's acceptance notes only.

### Task 12.6: Env documentation + key hygiene

**Files:**
- Modify: `.env.local.example`

- [ ] **Step 1: Add docs**

```bash
# VITE_GOOGLE_MAPS_API_KEY: restrict by HTTP referrer to *.vercel.app and localhost in Google Cloud Console.
# VITE_GA_MEASUREMENT_ID: GA4 stream id. Analytics loads only when set AND consent granted.
# VITE_SHOPIFY_CUSTOMER_SYNC_ENDPOINT: optional backend sync endpoint (Part 8). If unset, customer sync is skipped.
```

- [ ] **Step 2: Verify no secrets committed**

```bash
grep -rn "AIza\|sk_live\|AKIA" src/ .env.local.example 2>/dev/null || echo "no secrets found"
```

### Task 12.7: Rate-limit note (comment only)

- [ ] **Step 1: Add comment in Contact.jsx / Footer.jsx newsletter handler**

```js
// Rate limiting for this endpoint belongs on the backend (not present). Add server-side limits before launch.
```

**Part 12 Acceptance:** Four policy pages exist and are linked; footer no longer links policies to /about; cookie banner appears once and gates analytics; GA4 loads only when id set + consent granted; five events fire; security headers present; lint/build green.

---

## Self-Review Notes (per spec)

- Part 1 covers: unused import, dead files, shadcn audit, dist ignore, lint green. ✔
- Part 2 covers: auth/account restyle, CTA hover, radii, icon sizes, favicon, PageNotFound visuals. ✔
- Part 3 covers: broken link fix, dynamic collections, logo centering, breadcrumbs, search UX. ✔
- Part 4 covers: hero copy, mobile order, LCP, collection cards, FadeIn reduced-motion. ✔
- Part 5 covers: image helper, zoom a11y, honest room view, ATC label, accordion h2, sanitizer, related products, trust strip, sticky ATC. ✔
- Part 6 covers: URL state, featured→default sort, counts, load-more, filter sheet, error states. ✔
- Part 7 covers: drawer a11y, free-shipping config, progress bar, trust row, thumbnails, persistence, buy-again. ✔
- Part 8 covers: email verification, SPA nav, deterministic password removal, favorites sync. ✔
- Part 9 covers: Seo component, per-route meta, JSON-LD in head, sitemap, robots, noindex. ✔
- Part 10 covers: lazy Firebase, caching headers, SW, fonts, CLS, FadeIn replacement. ✔
- Part 11 covers: contrast, focus, touch targets, keyboard, ARIA, semantics, reduced motion, forms. ✔
- Part 12 covers: legal pages, cookie consent, GA4, security headers, env docs. ✔

## Final Verification (run after every part and at the end)

```bash
npm run lint
npm run build
```

Both must be green before any part is considered complete.
