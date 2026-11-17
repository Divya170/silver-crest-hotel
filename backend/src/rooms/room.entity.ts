import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ type: 'text', default: '' })
  description: string;

  /** Confirmed in-room facilities only. */
  @Column({ type: 'simple-json', default: '[]' })
  facilities: string[];

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ default: '' })
  imageAlt: string;

  /** Optional confirmed details — shown only when the hotel sets them. Never invented. */
  @Column({ type: 'varchar', nullable: true })
  occupancyNote: string | null;

  @Column({ type: 'varchar', nullable: true })
  sizeNote: string | null;

  @Column({ type: 'varchar', nullable: true })
  rateNote: string | null;

  /** When set, the site shows a dashed "Client to supply" note. Clear it once real content is in. */
  @Column({ type: 'text', nullable: true })
  clientNote: string | null;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
