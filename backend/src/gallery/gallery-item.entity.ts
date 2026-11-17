import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export const GALLERY_CATEGORIES = ['Exterior', 'Rooms', 'Common Areas', 'Facilities'] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

@Entity('gallery_items')
export class GalleryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'varchar' })
  category: GalleryCategory;

  /** Null = not yet photographed; the site shows a clearly labelled placeholder panel. */
  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ default: '' })
  alt: string;

  /** Masonry tile size on desktop. */
  @Column({ type: 'integer', default: 2 })
  rows: number;

  @Column({ type: 'integer', default: 1 })
  cols: number;

  /** Placeholder panel tint while no photo exists. */
  @Column({ default: '#DCD7CD' })
  tone: string;

  /** Show on the homepage "A closer look" collage (first four by order). */
  @Column({ default: false })
  featuredOnHome: boolean;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
