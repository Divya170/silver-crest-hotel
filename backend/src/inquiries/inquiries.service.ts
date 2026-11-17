import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { fieldErrors } from '../common/validation';
import { RoomsService } from '../rooms/rooms.service';
import { CreateInquiryDto, ListInquiriesQuery, UpdateInquiryDto } from './dto/inquiry.dto';
import { Inquiry } from './inquiry.entity';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isRealDate(iso: string) {
  if (!DATE_RE.test(iso)) return false;
  const d = new Date(`${iso}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso;
}

function nightsBetween(a: string, b: string) {
  return Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86_400_000);
}

const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry) private readonly repo: Repository<Inquiry>,
    private readonly rooms: RoomsService,
    private readonly config: ConfigService,
  ) {}

  /** "Today" in the hotel's timezone, as YYYY-MM-DD. */
  today() {
    const tz = this.config.get<string>('HOTEL_TIMEZONE') || 'America/Los_Angeles';
    return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  }

  /** Mirrors the inquiry form's rules and messages exactly (see DATA-MODEL.md). */
  validate(dto: CreateInquiryDto) {
    const e: Record<string, string> = {};
    const checkIn = str(dto.checkIn).trim();
    const checkOut = str(dto.checkOut).trim();
    const name = str(dto.name).trim();
    const email = str(dto.email).trim();
    const phone = str(dto.phone).trim();
    const message = str(dto.message).trim();
    const guestsRaw = str(dto.guests).trim();
    const today = this.today();

    if (!checkIn) e.checkIn = 'Choose a check-in date.';
    else if (!isRealDate(checkIn)) e.checkIn = 'Choose a valid check-in date.';
    else if (checkIn < today) e.checkIn = 'Check-in can’t be in the past.';

    if (!checkOut) e.checkOut = 'Choose a check-out date.';
    else if (!isRealDate(checkOut)) e.checkOut = 'Choose a valid check-out date.';
    else if (checkIn && isRealDate(checkIn) && checkOut <= checkIn) e.checkOut = 'Check-out must be later than check-in.';

    const guests = Number(guestsRaw);
    if (guestsRaw === '' || !Number.isInteger(guests) || guests < 1) e.guests = 'Enter a whole number of guests, 1 or more.';
    else if (guests > 99) e.guests = 'For groups larger than 99, please contact the hotel directly.';

    if (!name) e.name = 'Please enter your full name.';
    else if (name.length > 120) e.name = 'Please keep your name under 120 characters.';

    if (!email) e.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(email) || email.length > 200) e.email = 'Enter an email address like name@example.com.';

    if (!phone) e.phone = 'Please enter a phone number.';
    else if (phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a phone number with at least 7 digits.';
    else if (phone.length > 40) e.phone = 'Please keep the phone number under 40 characters.';

    if (message.length > 2000) e.message = 'Please keep your message under 2,000 characters.';

    return { errors: e, clean: { checkIn, checkOut, guests, name, email, phone, message: message || null } };
  }

  private async newReference() {
    const d = this.today().replace(/-/g, '').slice(2);
    for (;;) {
      const ref = `SC-${d}-${randomBytes(3).toString('hex').toUpperCase().slice(0, 4)}`;
      if ((await this.repo.count({ where: { reference: ref } })) === 0) return ref;
    }
  }

  async create(dto: CreateInquiryDto) {
    const { errors, clean } = this.validate(dto);

    let roomId: number | null = null;
    let roomName: string | null = null;
    const rawRoom = str(dto.roomId).trim();
    if (rawRoom) {
      const id = Number(rawRoom);
      const room = Number.isInteger(id) ? await this.rooms.findPublishedById(id) : null;
      if (!room) errors.roomId = 'That room is no longer available to select. Choose another or leave it blank.';
      else {
        roomId = room.id;
        roomName = room.name;
      }
    }

    if (Object.keys(errors).length) {
      const n = Object.keys(errors).length;
      throw fieldErrors(errors, n === 1 ? 'Please fix 1 field before sending your inquiry.' : `Please fix ${n} fields before sending your inquiry.`);
    }

    const saved = await this.repo.save(
      this.repo.create({
        ...clean,
        roomId,
        roomName,
        nights: nightsBetween(clean.checkIn, clean.checkOut),
        source: dto.source ?? 'contact',
        status: 'new',
        reference: await this.newReference(),
      }),
    );

    return {
      reference: saved.reference,
      name: saved.name,
      email: saved.email,
      roomName: saved.roomName,
      checkIn: saved.checkIn,
      checkOut: saved.checkOut,
      nights: saved.nights,
      guests: saved.guests,
      createdAt: saved.createdAt,
      confirmed: false,
    };
  }

  async list(q: ListInquiriesQuery) {
    const page = Math.max(1, parseInt(q.page || '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(5, parseInt(q.pageSize || '20', 10) || 20));
    const qb = this.repo.createQueryBuilder('i');
    if (q.status && q.status !== 'all') qb.andWhere('i.status = :status', { status: q.status });
    if (q.search?.trim()) {
      qb.andWhere('(LOWER(i.name) LIKE :s OR LOWER(i.email) LIKE :s OR i.phone LIKE :s OR LOWER(i.reference) LIKE :s OR LOWER(i.roomName) LIKE :s)', {
        s: `%${q.search.trim().toLowerCase()}%`,
      });
    }
    if (q.sort === 'oldest') qb.orderBy('i.createdAt', 'ASC');
    else if (q.sort === 'checkin') qb.orderBy('i.checkIn', 'ASC');
    else qb.orderBy('i.createdAt', 'DESC');
    qb.addOrderBy('i.id', 'DESC').skip((page - 1) * pageSize).take(pageSize);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, pageSize, pages: Math.max(1, Math.ceil(total / pageSize)) };
  }

  async stats() {
    const rows = await this.repo.createQueryBuilder('i').select('i.status', 'status').addSelect('COUNT(*)', 'count').groupBy('i.status').getRawMany<{ status: string; count: string }>();
    const by = Object.fromEntries(rows.map((r) => [r.status, Number(r.count)]));
    const today = this.today();
    const upcoming = await this.repo.createQueryBuilder('i').where('i.checkIn >= :today', { today }).andWhere("i.status != 'archived'").getCount();
    return { new: by.new ?? 0, responded: by.responded ?? 0, archived: by.archived ?? 0, total: rows.reduce((a, r) => a + Number(r.count), 0), upcoming };
  }

  async findOne(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Inquiry not found.');
    return row;
  }

  async update(id: number, dto: UpdateInquiryDto) {
    const row = await this.findOne(id);
    if (dto.status) row.status = dto.status;
    if (dto.adminNotes !== undefined) row.adminNotes = dto.adminNotes?.trim() || null;
    return this.repo.save(row);
  }

  async remove(id: number) {
    await this.repo.remove(await this.findOne(id));
    return { ok: true };
  }

  async exportCsv(q: ListInquiriesQuery) {
    const { items } = await this.list({ ...q, page: '1', pageSize: '100000' });
    const all = items.length ? items : [];
    const cols: (keyof Inquiry)[] = ['reference', 'status', 'createdAt', 'roomName', 'checkIn', 'checkOut', 'nights', 'guests', 'name', 'email', 'phone', 'message', 'adminNotes'];
    const esc = (v: unknown) => {
      const s = v instanceof Date ? v.toISOString() : v == null ? '' : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    return [cols.join(','), ...all.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
  }
}
