import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export const INQUIRY_STATUSES = ['new', 'responded', 'archived'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

/** A reservation INQUIRY — never a confirmed booking. */
@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  reference: string;

  @Column({ type: 'integer', nullable: true })
  roomId: number | null;

  /** Snapshot of the room name at the time of the inquiry (rooms can be renamed or deleted later). */
  @Column({ type: 'varchar', nullable: true })
  roomName: string | null;

  @Column({ type: 'varchar', length: 10 })
  checkIn: string;

  @Column({ type: 'varchar', length: 10 })
  checkOut: string;

  @Column({ type: 'integer' })
  nights: number;

  @Column({ type: 'integer' })
  guests: number;

  @Column()
  name: string;

  @Index()
  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  /** Which page the inquiry came from: 'rooms' or 'contact'. */
  @Column({ default: 'contact' })
  source: string;

  @Index()
  @Column({ type: 'varchar', default: 'new' })
  status: InquiryStatus;

  @Column({ type: 'text', nullable: true })
  adminNotes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
