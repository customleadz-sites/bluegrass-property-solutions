# Bluegrass Property Solutions LLC — website

Static multi-page site. No build step — plain HTML/CSS/JS, deploys straight to Vercel.

**Client:** Tyler Nightengale
**Domain:** bluegrasspropertysolutionsllc.com (currently at Squarespace — transferring after the project)
**Phone:** (270) 978-7035 · **Email:** bluegrasspropertysolutionsky@gmail.com
**Hours:** 8:00am – 8:00pm

---

## ⚠️ Before launch — outstanding items

1. **Web3Forms access key.** `contact.html` has a placeholder:
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
   ```
   Replace with the real key. Until then the form refuses to submit and shows a
   message telling people to call instead (it does **not** fail silently).
   Test a real submission after swapping it in.

2. **Photos.** Every image on the site is a placeholder from Pexels. Tyler had no
   job photos at intake. Before/after shots are the single biggest conversion
   driver in this trade — the site will underperform until his real work is on it.
   Swap the four `images/stock-*.jpg` files (same filenames = no code changes).

3. **Claims to confirm with Tyler.** Everything on the site is drawn from his
   intake answers, but these are promises he has to keep — get his sign-off:
   - "Sherwin-Williams on every job"
   - "Free written estimates"
   - "You deal with the owner"
   - Answering the phone 8am–8pm

4. **Not licensed or insured.** Deliberately not claimed anywhere on the site,
   because it isn't true yet. Competitors all say "licensed & insured" and Tyler
   listed "property damage" as a top customer fear — this is a real conversion
   hole. Once he's insured, say so prominently (nav trust strip + service pages).

5. **No reviews / no Google Business Profile.** There's no testimonials section
   because there are no testimonials. GBP drives most local service calls and
   takes time to verify — worth starting now. Add reviews once they exist.

6. **No guarantee offered.** The copy frameworks push hard for one and it would
   help, but it's Tyler's promise to make, not ours to invent. A workmanship
   warranty is the natural fit — worth a conversation.

---

## Structure

```
index.html                         Home
service-exterior-painting.html     Exterior painting
service-pressure-washing.html      Pressure washing
service-deck-fence-staining.html   Deck & fence staining
contact.html                       Free estimate form
blog.html                          Blog index
blog-*.html                        3 posts
css/style.css                      All styles
js/site.js                         Mobile nav + form submit
js/map.js                          Service-area map
js/counties.json                   County boundaries (5 counties, ~2KB)
images/                            Logos, favicons, stock photos
```

`vercel.json` sets `cleanUrls: true`, so internal links are extensionless
(`href="contact"`, not `contact.html`). **Keep it that way** — linking with
`.html` causes a redirect hop on every click.

Local preview needs a server that resolves extensionless URLs. Plain
`python3 -m http.server` will 404 on every page except `/`.

## Design

- **Type:** Archivo (display — signage-style grotesk echoing the logo's block
  lettering) + Hanken Grotesk (body). Deliberately not the fancy serif Tyler
  disliked on North Shade Lawn.
- **Palette:** from `assets/colors.png` — navy `#0D2C54`, blue `#1E5FA8`,
  green `#4CAF3B`, gray `#7D7D7D`.
- **Motif:** the paint-swatch strip (`.swatch`) used as a section divider.
  On dark sections it needs `.swatch.inv`, which drops the navy chip — otherwise
  it merges into the navy and the band looks like it starts halfway across.
- **Footer logo** uses `logo-horizontal-light.png` (navy knocked out to white,
  green kept). The normal logo is invisible on the dark footer.

## Service-area map

Leaflet + CARTO tiles. Murray-centered. Five counties highlighted — Graves,
Calloway, Marshall, **McCracken** and **Carlisle**. The last two are included
because Tyler serves Paducah and Arlington, which sit in them, even though he
only listed the first three counties.

Town coordinates were geocoded via OpenStreetMap Nominatim (real, not estimated).

Two things worth knowing if you edit it:
- `zoomSnap: 0.1` — with default integer snapping the service area floats in a
  sea of dead space.
- The basemap label layer is **deliberately not loaded**. It renders its own town
  names which collide with the pins ("PADUCAH" stacked on "Paducah").

## Content notes

- Copy follows Pain → Agitate → Solve. Trust is built only on what's actually
  true (Sherwin-Williams, real prep, owner-direct, free written estimates) —
  no invented job counts, review numbers, years, or credentials.
- Tyler's "10 years" is **property management** experience, not 10 years of
  painting. The site does not claim painting tenure anywhere.
- No blog post about pricing, because Tyler never provided pricing. Don't add
  one with made-up numbers.
- American spelling throughout (color, fiber, gray, story).
