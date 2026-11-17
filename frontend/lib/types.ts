export interface SiteSettings {
  id: number;
  hotelName: string;
  tagline: string;
  addressLine1: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string | null;
  email: string | null;
  mapEmbedUrl: string | null;
  heroAutoplay: boolean;
  heroIntervalSeconds: number;
  showTestimonials: boolean;
  footerNote: string;
  fullAddress: string;
  phoneHref: string | null;
  emailHref: string | null;
  mapsUrl: string;
  directionsUrl: string;
}

export type ContentType = 'page_copy' | 'hero_slide' | 'why_theme' | 'philosophy';

export interface ContentBlock {
  id: number;
  type: ContentType;
  key: string | null;
  title: string;
  body: string | null;
  fields: Record<string, string | null>;
  sortOrder: number;
  published: boolean;
}

export type PageCopy = Record<string, ContentBlock | undefined>;

export interface Room {
  id: number;
  slug: string;
  name: string;
  description: string;
  facilities: string[];
  imageUrl: string | null;
  imageAlt: string;
  occupancyNote: string | null;
  sizeNote: string | null;
  rateNote: string | null;
  clientNote: string | null;
  sortOrder: number;
  published: boolean;
}

export interface Amenity {
  id: number;
  name: string;
  description: string;
  groupName: string;
  icon: string | null;
  imageUrl: string | null;
  imageAlt: string;
  featured: boolean;
  sortOrder: number;
  published: boolean;
}

export interface AmenitiesResponse {
  total: number;
  featured: Amenity | null;
  items: Amenity[];
  groups: { name: string; items: Amenity[] }[];
}

export type GalleryCategory = 'Exterior' | 'Rooms' | 'Common Areas' | 'Facilities';

export interface GalleryItem {
  id: number;
  title: string;
  category: GalleryCategory;
  imageUrl: string | null;
  alt: string;
  rows: number;
  cols: number;
  tone: string;
  featuredOnHome: boolean;
  sortOrder: number;
  published: boolean;
}

export interface GalleryResponse {
  category: string;
  categories: { name: string; count: number }[];
  items: GalleryItem[];
}

export interface Testimonial {
  id: number;
  quote: string;
  guestName: string;
  context: string | null;
  verified: boolean;
  published: boolean;
  sortOrder: number;
}

export type InquiryStatus = 'new' | 'responded' | 'archived';

export interface Inquiry {
  id: number;
  reference: string;
  roomId: number | null;
  roomName: string | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  source: string;
  status: InquiryStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryReceipt {
  reference: string;
  name: string;
  email: string;
  roomName: string | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  createdAt: string;
  confirmed: false;
}

export interface ApiErrorBody {
  statusCode?: number;
  message?: string | string[];
  errors?: Record<string, string>;
}
