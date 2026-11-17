# Silver Crest Hotel — Data model extracted from the design comp

Source: `design-source/*.dc.html` (six pages: Main, Rooms, Amenities, About, Gallery, Contact).

## Site identity
- Name: **Silver Crest Hotel** · tagline strip “Hotel · Bakersfield”.
- Client: Gregory Cooper (invoice INV-1889).
- Address: 3194 Pine Avenue, Bakersfield, CA 93301, USA.
- Phone: +1 (842) 147-2951 (`tel:+18421472951`). Email: silvercresthotel@hotmail.com.
- Maps: `https://www.google.com/maps/search/?api=1&query=<address>` and directions `https://www.google.com/maps/dir/?api=1&destination=<address>`.
- Fonts: Cormorant Garamond (headings, 400/500/600 + italic) · Inter (body, nav, buttons).
- Colors: ivory `#F8F6F0`, cream `#EEE9DF`, white `#FFFFFF`, charcoal `#292A27`, graphite `#55544F`, champagne `#B39A70` (lines/accents only), stone `#DCD7CD`, warm grey `#918D84`, bronze text accent `#6E5A39` (AA-safe small text), error `#A23B2A`, input border `#8A857B`.
- Motion: `rise` fade-up on load (staggered .15s), slow Ken-Burns zoom on hero photos (24s), image hover zoom 1.045, hero cross-fade 1.8s, all disabled under `prefers-reduced-motion`.
- Breakpoints: nav collapses to hamburger + call icon ≤1040px; multi-column grids collapse to one column ≤860px.

## Routes and sections
1. `/` Home — hero slideshow (3 slides, autoplay 7s, pause button, slide buttons, pauses on hover/menu) · Welcome (split, layered photos, intro) · Rooms preview (1 large + 2 small) · Amenities overview (cream band, list) · Why stay (4 numbered themes) · Guest experience (photo + panel, testimonial slot) · Gallery preview collage (4 tiles) · Location (address, map, Maps/Directions) · Reservation CTA “Planning Your Stay?” · Footer.
2. `/rooms` — hero + breadcrumb · alternating room entries (split / split reversed / full-bleed feature) · inline Room Inquiry form with “Inquiring about” chip.
3. `/amenities` — hero “Comfort in Every Detail” · confirmation-status note · featured amenity · grouped lists (3 groups) · CTA “Need More Information?”.
4. `/about` — hero “A Welcoming Place to Stay” · hotel introduction · Hospitality Philosophy (4 rows i.–iv.) · Property overview collage · CTA “Experience Silver Crest Hotel.”.
5. `/gallery` — hero “Explore Silver Crest” · category chips All/Exterior/Rooms/Common Areas/Facilities with counts · masonry grid · lightbox (counter, prev/next, Esc, arrow keys, swipe) · empty state per category · CTA.
6. `/contact` — dark hero “Let’s Plan Your Stay.” · three contact columns (Call/Email/Visit) · inquiry form with 3-step explainer · map + directions · final CTA “Prefer to speak with someone?”.

## Content types (seed copy)
- **Hero slides** (content `hero_slide`): “Hotel exterior”, “Lobby or reception”, “Guest room interior”. Headline “Your Stay, Your Comfort, Your Welcome.”; supporting copy “Discover Silver Crest Hotel, where a welcoming atmosphere and comfortable accommodation come together to make your stay enjoyable.”
- **Why-stay themes** (content `why_theme`): 01 Accommodation, 02 Hospitality, 03 Convenience, 04 Guest experience — bodies are client-approval placeholders.
- **Philosophy** (content `philosophy`): i. Guest comfort, ii. Welcoming hospitality, iii. Clean, organized rooms, iv. Professional service — pending approval.
- **Page copy blocks** (content `page_copy`): welcome intro, about intro, guest-experience text.
- **Rooms**: three placeholder categories “[Room Category A/B/C]”, each flagged as placeholder. No price, size or capacity fields shown unless set by admin.
- **Amenities**: none confirmed → empty; the site shows the placeholder slots / “awaiting confirmation” state. Groups suggested: In your room, Around the hotel, Services.
- **Gallery**: 12 placeholder items — Exterior (Hotel entrance, Building facade, Evening view), Rooms (Guest room, Bed and linens, Room detail, Bathroom, Window and light), Common Areas (Reception, Lobby seating, Hallway, Architectural detail). Facilities: 0.
- **Testimonials**: none. Slot hidden until the flag is on AND ≥1 published verified testimonial exists.

## Validation rules (mirrored exactly in NestJS DTO + service)
- checkIn required, not before today (“Check-in can’t be in the past.”).
- checkOut required, strictly later than checkIn (“Check-out must be later than check-in.”).
- guests required, whole number ≥ 1.
- name required (trimmed).
- email required, `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`.
- phone required, ≥ 7 digits after stripping non-digits.
- room optional (must reference a published room if given); message optional (≤ 2000 chars).
- Error copy mirrors the comp’s messages.

## Feature flags (settings)
- `heroAutoplay` (default true), `heroIntervalSeconds` (default 7, range 5–8).
- `showTestimonials` (default false).
- `mapEmbedUrl` (nullable — when unset, show the map placeholder + links).

## Simulated in the comp — NOT reproduced
- The 900 ms fake “sending” timeout and the “not sent / backend not connected” notice → replaced with a real POST that persists the inquiry and returns 201, or a real error.
- The `formState` tweak (Live/Success/Failure preview) → real states only.
- Placeholder photo panels → real uploads; a placeholder panel renders only when an item has no image.
