# Silver Crest Hotel — website

A working version of the Silver Crest Hotel design: six public pages, a reservation-inquiry flow that saves to a real database, and an admin panel for every piece of content.

| Part | Stack | Folder |
|---|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript | `frontend/` |
| API | NestJS 10, TypeORM, class-validator, JWT | `backend/` |
| Database | SQLite 3 | `database/app.sqlite` |

`design-source/` holds the original `.dc.html` design comp. `DATA-MODEL.md` lists everything extracted from it: routes, seed copy, validation rules, feature flags and the simulated parts that were replaced with real logic.

---

## Quick start

Requires Node.js 18.18+ (20 LTS recommended).

```bash
npm run install:all          # installs root, backend and frontend dependencies
cp backend/.env.example backend/.env          # already present; edit JWT_SECRET for production
cp frontend/.env.example frontend/.env.local  # already present
npm run dev                  # API on :4000, website on :3000
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin/login
- API: http://localhost:4000/api

On first start the API creates the tables, seeds the content from the design, and **prints the default admin login in the console**:

```
Email:    admin@silvercresthotel.local
Password: SilverCrest!2026
```

You can change these through `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env` before the first start. You can also change the password later under **Admin → Settings**.

To start over with a fresh database, run `npm run db:reset` and restart the API. It re-seeds automatically.

---

## Structure

```text
silver-crest-hotel/
├── backend/                     NestJS API
│   └── src/
│       ├── admin-auth/          JWT login, /me, change password, default admin seed
│       ├── content/             ONE polymorphic ContentBlock (page_copy, hero_slide, why_theme, philosophy)
│       ├── rooms/               Room categories (searchable, image upload)
│       ├── amenities/           Confirmed amenities, grouped, one "featured"
│       ├── gallery/             Photos with category filter, tile size, home collage flag
│       ├── testimonials/        Verified testimonials, gated by a settings flag
│       ├── inquiries/           Reservation inquiries + status workflow + CSV export
│       ├── settings/            Singleton: hotel details, contact info, feature flags
│       ├── common/              JWT guard, validation pipe, upload helpers
│       └── seed/                Idempotent first-boot seed (copy from the design)
├── frontend/                    Next.js
│   ├── app/(site)/              /, /rooms, /amenities, /about, /gallery, /contact
│   ├── app/admin/               /admin/login + (protected) dashboard and managers
│   ├── components/site/         Header, Footer, HeroSlideshow, InquiryForm, SuccessCard, GalleryBrowser, RoomEntry…
│   ├── components/admin/        AdminShell, EntityManager (generic CRUD), UI helpers
│   └── lib/                     API client, types, client-side validation mirror
├── database/app.sqlite          SQLite database (tables created by the API)
├── design-source/               Original design comp
└── DATA-MODEL.md
```

---

## What's dynamic

All text, rooms, amenities, photos, testimonials and contact details come from the API. The frontend only hardcodes layout and fixed UI labels.

**Public site**

- **Home:**
  - The hero slideshow has a cross-fade, an interval of 5–8 s set in Settings, pause on hover or with the button, slide buttons, and respects reduced motion.
  - Every section (welcome, rooms preview, amenities, "why stay", guest experience, gallery collage, location and map, CTA) is driven by the database.
- **Rooms:**
  - Rooms use three alternating layouts (split, reversed, full-width feature).
  - "Inquire About This Room" scrolls to the inline form with that room preselected. `/rooms?room=<id>` also works from the homepage.
- **Amenities:** amenities are grouped, with one featured amenity. While none are confirmed, the page shows the design's "awaiting confirmation" placeholder slots.
- **About:** the intro, the philosophy list and a property collage built from real gallery photos.
- **Gallery:**
  - Category filters show counts and are kept in the URL (`?category=Rooms`).
  - Categories with no photos show an empty state.
  - The lightbox has previous/next, Esc, arrow keys, swipe, a focus trap and returns focus when closed.
- **Contact:**
  - Phone, email and Maps links all work.
  - The inquiry form accepts `?room=`.
  - The map uses a real Google Maps embed when an embed URL is set in Settings, and the placeholder otherwise.

**Inquiry flow (the main conversion)**

- The browser checks each field instantly, and NestJS checks the same rules again with the same messages:
  - Check-in is not in the past, using the hotel's timezone.
  - Check-out is after check-in.
  - Guests is a whole number of 1 or more.
  - Name, email (regex) and phone (7 or more digits) are required.
  - The room, if given, must be a published room.
- States:
  - **Loading:** the button changes to "Sending…" and is disabled.
  - **Validation:** errors show next to each field, with a summary and focus on the first problem.
  - **Network or server failure:** an error panel appears, the form keeps its data, and the phone and email are shown.
- On success the inquiry is saved with a reference such as `SC-261115-4F2A` and status `new`. A **success card** shows the reference and stay summary, offers **Back to Home**, **Explore the Gallery** and **Send Another Inquiry**, and says clearly that this is not a confirmed reservation.

**Admin**

- **Dashboard:** new and upcoming inquiry counts, the latest new inquiries, and a checklist of content that is still a placeholder.
- **Inquiries:**
  - Search, status filter, sort and pagination.
  - A detail drawer with New/Responded/Archived status, internal notes, reply by email and delete.
  - CSV export.
- **Rooms, Amenities, Gallery, Testimonials, Page content:**
  - Create, edit and delete, with search and filters.
  - Publish/hide, image upload, replace and remove, and validation errors from the API.
  - Loading, empty and error states.
- **Settings:** hotel name and address, phone and email, Maps embed URL, slideshow autoplay and interval, the testimonials switch, the footer note, and changing the admin password.

---

## Content rules the build enforces

These come from the client brief:

- **Room details:** no invented prices, room sizes, room capacities or availability. Rooms only have optional "occupancy / size / rates" notes, and these show only when the admin fills them in.
- **Amenities:** none are seeded, and none are assumed.
- **Testimonials:** none are seeded. One can be published only after it is marked **Verified**, and the homepage shows testimonials only when **Show testimonials** is on.
- **Placeholders:** each seeded room and content block carries a **"Client to supply" note**, shown on the site as the design's dashed box. Clearing the note in the admin hides it. Photos show labelled placeholder panels until real images are uploaded.

---

## API overview

The public endpoints need no login:

```
GET  /api/settings
GET  /api/content?type=hero_slide|why_theme|philosophy|page_copy
GET  /api/content/page-copy
GET  /api/rooms            GET /api/rooms/:slug
GET  /api/amenities?group=
GET  /api/gallery?category=        GET /api/gallery/home
GET  /api/testimonials
POST /api/inquiries
```

The admin endpoints need `Authorization: Bearer <token>` from `POST /api/admin-auth/login`:

```
GET  /api/admin-auth/me            PATCH /api/admin-auth/password
GET|PUT /api/admin/settings
GET|POST /api/admin/content        PATCH|DELETE /api/admin/content/:id      POST /api/admin/content/:id/image
GET|POST /api/admin/rooms          PATCH|DELETE /api/admin/rooms/:id        POST|DELETE /api/admin/rooms/:id/image
GET|POST /api/admin/amenities      GET /api/admin/amenities/meta            PATCH|DELETE /api/admin/amenities/:id   POST|DELETE …/:id/image
GET|POST /api/admin/gallery        PATCH|DELETE /api/admin/gallery/:id      POST|DELETE /api/admin/gallery/:id/image
GET|POST /api/admin/testimonials   PATCH|DELETE /api/admin/testimonials/:id
GET  /api/admin/inquiries?search=&status=&sort=&page=&pageSize=
GET  /api/admin/inquiries/stats    GET /api/admin/inquiries/export.csv      GET|PATCH|DELETE /api/admin/inquiries/:id
```

Validation errors always come back as `400 { message, errors: { field: "message" } }`, which the forms show next to each field.

Uploaded images are saved to `backend/uploads/` and served at `/uploads/<file>`.

---

## Production notes

- Set a long random `JWT_SECRET`, set `CORS_ORIGINS` to the real site domain, and point `NEXT_PUBLIC_API_URL` at the public API URL.
- `synchronize: true` creates and updates the schema from the entities. That suits this small site; switch to TypeORM migrations if the schema will keep changing on a live database.
- Back up `database/app.sqlite` and `backend/uploads/` together.
- Email notifications for new inquiries are not included because no mail service was specified. Inquiries are saved and appear in the admin panel straight away.
