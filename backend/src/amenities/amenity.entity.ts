import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export const AMENITY_ICONS = ['bed', 'wifi', 'parking', 'coffee', 'dining', 'pool', 'fitness', 'desk', 'laundry', 'concierge', 'accessible', 'shower', 'tv', 'air', 'key', 'star'] as const;

/** Only amenities the hotel has confirmed are ever stored here. Nothing is seeded. */
@Entity('amenities')
export class Amenity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', default: '' })
  description: string;

  /** Display group, e.g. "In your room", "Around the hotel", "Services". */
  @Column({ default: 'Around the hotel' })
  groupName: string;

  @Column({ type: 'varchar', nullable: true })
  icon: string | null;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ default: '' })
  imageAlt: string;

  /** The featured amenity gets the large photo-led block on the Amenities page. */
  @Column({ default: false })
  featured: boolean;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
