import { ContentBlock } from '../content/content-block.entity';
import { GalleryItem } from '../gallery/gallery-item.entity';
import { Room } from '../rooms/room.entity';

/** Seed copy taken verbatim from the design comp (design-source/*.dc.html). See DATA-MODEL.md. */

export const CONTENT_SEED: Partial<ContentBlock>[] = [
  {
    type: 'page_copy', key: 'home_hero', title: 'Your Stay, Your Comfort, Your Welcome.',
    body: 'Discover Silver Crest Hotel, where a welcoming atmosphere and comfortable accommodation come together to make your stay enjoyable.',
    fields: { eyebrow: 'Silver Crest Hotel · Bakersfield, California' },
  },
  {
    type: 'page_copy', key: 'home_welcome', title: 'A comfortable place to arrive, rest and feel at home.',
    body: 'Silver Crest Hotel offers accommodation in Bakersfield, California, with attention to comfort, cleanliness and professional, welcoming hospitality.',
    fields: { eyebrow: 'Welcome to Silver Crest', clientNote: 'A short introduction in the hotel’s own words: its character and what guests can expect during a stay.', imageUrl: null, detailImageUrl: null },
  },
  { type: 'page_copy', key: 'home_rooms', title: 'Rest, thoughtfully arranged.', body: null, fields: { eyebrow: 'Rooms & Accommodation' } },
  {
    type: 'page_copy', key: 'home_amenities', title: 'Facilities, presented with care.',
    body: 'A clear overview of what the hotel provides, so guests know what to expect before they arrive.', fields: { eyebrow: 'Amenities' },
  },
  {
    type: 'page_copy', key: 'home_why', title: 'Why stay at Silver Crest?',
    body: 'Four themes for the hotel to describe in its own words. Each statement will be written with, and approved by, the hotel.', fields: {},
  },
  {
    type: 'page_copy', key: 'home_experience', title: 'Settle in. Slow down. Stay a while.',
    body: 'From the moment you arrive, the aim is simple: a calm, comfortable stay with a warm welcome.', fields: { eyebrow: 'The Guest Experience', imageUrl: null },
  },
  { type: 'page_copy', key: 'home_gallery', title: 'A closer look.', body: null, fields: { eyebrow: 'Gallery' } },
  { type: 'page_copy', key: 'home_location', title: 'Find us in Bakersfield.', body: null, fields: { eyebrow: 'Location' } },
  { type: 'page_copy', key: 'home_cta', title: 'Planning Your Stay?', body: 'Get in touch with Silver Crest Hotel to inquire about your accommodation.', fields: {} },
  {
    type: 'page_copy', key: 'rooms_hero', title: 'Rooms & Accommodation',
    body: 'Comfortable rooms prepared with care. Explore the options below and send an inquiry for the room that suits your stay.', fields: { imageUrl: null },
  },
  {
    type: 'page_copy', key: 'rooms_inquiry', title: 'Ask about a room.',
    body: 'Share your dates and the room you’re interested in. The hotel will reply to confirm availability and details.', fields: { eyebrow: 'Room Inquiry' },
  },
  {
    type: 'page_copy', key: 'amenities_hero', title: 'Comfort in Every Detail',
    body: 'An honest, organized overview of what Silver Crest Hotel provides, so you can plan your stay with confidence.', fields: { eyebrow: 'Amenities & Facilities', imageUrl: null },
  },
  {
    type: 'page_copy', key: 'amenities_groups', title: 'Everything, at a glance.',
    body: 'Grouped so guests can scan quickly.', fields: {},
  },
  {
    type: 'page_copy', key: 'amenities_cta', title: 'Need More Information?',
    body: 'If you’d like to know whether a particular facility is available, the team is happy to help.', fields: { eyebrow: 'Questions' },
  },
  {
    type: 'page_copy', key: 'about_hero', title: 'A Welcoming Place to Stay',
    body: 'Silver Crest Hotel provides accommodation in Bakersfield, California, built around comfort and a genuine welcome.', fields: { imageUrl: null },
  },
  {
    type: 'page_copy', key: 'about_intro',
    title: 'Silver Crest Hotel is a hotel in Bakersfield offering comfortable accommodation and attentive, professional hospitality for individual travelers, couples, families and business guests.',
    body: null,
    fields: { eyebrow: 'The Hotel', clientNote: 'The hotel’s own introduction: what it is, the accommodation it offers and how it approaches hospitality. Founding date, ownership, awards and milestones are left out unless the hotel provides and verifies them.' },
  },
  {
    type: 'page_copy', key: 'about_philosophy', title: 'What we care about.', body: null,
    fields: { eyebrow: 'Hospitality Philosophy', clientNote: 'These four themes appear as the hotel’s philosophy only once the hotel approves them.' },
  },
  {
    type: 'page_copy', key: 'about_property', title: 'Inside Silver Crest.', body: null,
    fields: { eyebrow: 'The Property', clientNote: 'Authentic photographs of the building, reception and rooms, with a verified short description of the property.' },
  },
  { type: 'page_copy', key: 'about_cta', title: 'Experience Silver Crest Hotel.', body: 'Tell us your dates and the team will get back to you about your stay.', fields: {} },
  { type: 'page_copy', key: 'gallery_hero', title: 'Explore Silver Crest', body: 'A look at the hotel, its rooms and its spaces. Select any photograph to view it larger.', fields: {} },
  { type: 'page_copy', key: 'gallery_cta', title: 'Plan your stay at Silver Crest.', body: null, fields: { eyebrow: 'Like what you see?' } },
  {
    type: 'page_copy', key: 'contact_hero', title: 'Let’s Plan Your Stay.',
    body: 'Have questions or planning a visit? Contact Silver Crest Hotel for accommodation and reservation inquiries.', fields: {},
  },
  {
    type: 'page_copy', key: 'contact_inquiry', title: 'Tell us about your stay.',
    body: 'Share your dates and a few details. The hotel will review your request and reply to confirm availability.', fields: { eyebrow: 'Reservation Inquiry' },
  },
  { type: 'page_copy', key: 'contact_map', title: 'Find Silver Crest Hotel.', body: null, fields: { eyebrow: 'Getting Here' } },
  {
    type: 'page_copy', key: 'contact_final', title: 'Prefer to speak with someone?',
    body: 'For anything not covered here, contact the hotel directly. The team is happy to help.', fields: {},
  },

  { type: 'hero_slide', title: 'Hotel exterior', body: null, fields: { imageUrl: null, alt: 'Silver Crest Hotel exterior' }, sortOrder: 0 },
  { type: 'hero_slide', title: 'Lobby or reception', body: null, fields: { imageUrl: null, alt: 'Silver Crest Hotel lobby' }, sortOrder: 1 },
  { type: 'hero_slide', title: 'Guest room interior', body: null, fields: { imageUrl: null, alt: 'A guest room at Silver Crest Hotel' }, sortOrder: 2 },

  { type: 'why_theme', title: 'Accommodation', body: null, fields: { clientNote: 'A statement about the rooms and the comfort they offer.' }, sortOrder: 0 },
  { type: 'why_theme', title: 'Hospitality', body: null, fields: { clientNote: 'How the team welcomes and looks after guests.' }, sortOrder: 1 },
  { type: 'why_theme', title: 'Convenience', body: null, fields: { clientNote: 'What makes the location or stay easy, if confirmed.' }, sortOrder: 2 },
  { type: 'why_theme', title: 'Guest experience', body: null, fields: { clientNote: 'What a stay at Silver Crest feels like.' }, sortOrder: 3 },

  { type: 'philosophy', title: 'Guest comfort', body: '[Client-approved line on how comfort shapes each stay.]', fields: {}, sortOrder: 0 },
  { type: 'philosophy', title: 'Welcoming hospitality', body: '[Client-approved line on how guests are welcomed.]', fields: {}, sortOrder: 1 },
  { type: 'philosophy', title: 'Clean, organized rooms', body: '[Client-approved line on cleanliness and attention to detail.]', fields: {}, sortOrder: 2 },
  { type: 'philosophy', title: 'Professional service', body: '[Client-approved line on the team’s service.]', fields: {}, sortOrder: 3 },
];

export const ROOM_SEED: Partial<Room>[] = [
  {
    slug: 'room-category-a', name: '[Room Category A]', description: '', facilities: [], imageAlt: 'Room category A', sortOrder: 0,
    clientNote: 'Room name, a two-to-three sentence description and bed configuration. Size, capacity and price stay hidden until the hotel confirms them.',
  },
  { slug: 'room-category-b', name: '[Room Category B]', description: '', facilities: [], imageAlt: 'Room category B', sortOrder: 1, clientNote: 'Room name, description and confirmed in-room facilities.' },
  {
    slug: 'room-category-c', name: '[Room Category C]', description: '', facilities: [], imageAlt: 'Room category C', sortOrder: 2,
    clientNote: 'Room name, description and confirmed facilities. Hide or delete this entry if the hotel has only two categories.',
  },
];

export const GALLERY_SEED: Partial<GalleryItem>[] = [
  { category: 'Exterior', title: 'Hotel entrance', rows: 3, cols: 2, tone: '#D3CDC1', featuredOnHome: true },
  { category: 'Rooms', title: 'Guest room', rows: 2, cols: 1, tone: '#DCD7CD', featuredOnHome: true },
  { category: 'Rooms', title: 'Bed and linens', rows: 2, cols: 1, tone: '#E3DED4', featuredOnHome: true },
  { category: 'Common Areas', title: 'Reception', rows: 2, cols: 1, tone: '#CFC9BD', featuredOnHome: true },
  { category: 'Rooms', title: 'Room detail', rows: 1, cols: 1, tone: '#E7E2D8' },
  { category: 'Exterior', title: 'Building facade', rows: 2, cols: 1, tone: '#DCD7CD' },
  { category: 'Common Areas', title: 'Lobby seating', rows: 2, cols: 2, tone: '#D8D2C6' },
  { category: 'Rooms', title: 'Bathroom', rows: 2, cols: 1, tone: '#E3DED4' },
  { category: 'Common Areas', title: 'Hallway', rows: 2, cols: 1, tone: '#CFC9BD' },
  { category: 'Exterior', title: 'Evening view', rows: 2, cols: 2, tone: '#D3CDC1' },
  { category: 'Rooms', title: 'Window and light', rows: 2, cols: 1, tone: '#DCD7CD' },
  { category: 'Common Areas', title: 'Architectural detail', rows: 2, cols: 1, tone: '#E7E2D8' },
].map((g, i) => ({ ...g, alt: g.title, sortOrder: i }) as Partial<GalleryItem>);
