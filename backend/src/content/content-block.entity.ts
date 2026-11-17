import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export const CONTENT_TYPES = ['page_copy', 'hero_slide', 'why_theme', 'philosophy'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

/**
 * One polymorphic entity for every simple CMS collection.
 * - page_copy: keyed blocks of page text (key = 'home_hero', 'home_welcome', …)
 * - hero_slide: homepage slideshow (fields.imageUrl, fields.alt)
 * - why_theme / philosophy: numbered editorial lists
 * fields.clientNote, when set, renders as a dashed "Client to supply" note on the site.
 */
@Entity('content_blocks')
@Index(['type', 'key'])
export class ContentBlock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  type: ContentType;

  @Column({ type: 'varchar', nullable: true })
  key: string | null;

  @Column({ default: '' })
  title: string;

  @Column({ type: 'text', nullable: true })
  body: string | null;

  @Column({ type: 'simple-json', default: '{}' })
  fields: Record<string, string | null>;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
