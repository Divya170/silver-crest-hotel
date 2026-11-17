import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/** Real, verified guest testimonials only — used with the guest's permission. Nothing is seeded. */
@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  quote: string;

  @Column()
  guestName: string;

  /** e.g. "Stayed in March 2026" — optional. */
  @Column({ type: 'varchar', nullable: true })
  context: string | null;

  /** Admin confirms the testimonial is genuine and permission was given. Required before it can be published. */
  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  published: boolean;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
