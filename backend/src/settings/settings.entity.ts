import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/** Singleton (id = 1): hotel identity, contact details and every feature flag from the design comp. */
@Entity('settings')
export class Settings {
  @PrimaryColumn({ default: 1 })
  id: number;

  @Column({ default: 'Silver Crest Hotel' })
  hotelName: string;

  @Column({ default: 'Hotel · Bakersfield' })
  tagline: string;

  @Column({ default: '3194 Pine Avenue' })
  addressLine1: string;

  @Column({ default: 'Bakersfield' })
  city: string;

  @Column({ default: 'CA' })
  region: string;

  @Column({ default: '93301' })
  postalCode: string;

  @Column({ default: 'USA' })
  country: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  /** Optional Google Maps embed URL. When empty the site shows the map placeholder plus working Maps/Directions links. */
  @Column({ type: 'varchar', nullable: true })
  mapEmbedUrl: string | null;

  @Column({ default: true })
  heroAutoplay: boolean;

  @Column({ type: 'integer', default: 7 })
  heroIntervalSeconds: number;

  @Column({ default: false })
  showTestimonials: boolean;

  @Column({ default: 'Inquiries sent through this website are not confirmed reservations.' })
  footerNote: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
