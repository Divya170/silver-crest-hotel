import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugify } from '../common/slug';
import { removeUpload } from '../common/upload';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
import { Room } from './room.entity';

const NULLABLE = ['occupancyNote', 'sizeNote', 'rateNote', 'clientNote'] as const;

@Injectable()
export class RoomsService {
  constructor(@InjectRepository(Room) private readonly repo: Repository<Room>) {}

  listPublic() {
    return this.repo.find({ where: { published: true }, order: { sortOrder: 'ASC', id: 'ASC' } });
  }

  async findPublicBySlug(slug: string) {
    const room = await this.repo.findOne({ where: { slug, published: true } });
    if (!room) throw new NotFoundException('Room not found.');
    return room;
  }

  findPublishedById(id: number) {
    return this.repo.findOne({ where: { id, published: true } });
  }

  listAdmin(search?: string, status?: 'published' | 'hidden') {
    const qb = this.repo.createQueryBuilder('r').orderBy('r.sortOrder', 'ASC').addOrderBy('r.id', 'ASC');
    if (search?.trim()) qb.andWhere('(LOWER(r.name) LIKE :q OR LOWER(r.description) LIKE :q)', { q: `%${search.trim().toLowerCase()}%` });
    if (status === 'published') qb.andWhere('r.published = 1');
    if (status === 'hidden') qb.andWhere('r.published = 0');
    return qb.getMany();
  }

  async findOne(id: number) {
    const room = await this.repo.findOne({ where: { id } });
    if (!room) throw new NotFoundException('Room not found.');
    return room;
  }

  private clean<T extends Partial<CreateRoomDto>>(dto: T): T {
    const out = { ...dto };
    for (const k of NULLABLE) if ((out as Record<string, unknown>)[k] === '') (out as Record<string, unknown>)[k] = null;
    if (out.facilities) out.facilities = out.facilities.map((f) => f.trim()).filter(Boolean);
    return out;
  }

  private async uniqueSlug(name: string, ignoreId?: number) {
    const base = slugify(name);
    let slug = base;
    for (let i = 2; ; i++) {
      const hit = await this.repo.findOne({ where: { slug } });
      if (!hit || hit.id === ignoreId) return slug;
      slug = `${base}-${i}`;
    }
  }

  async create(dto: CreateRoomDto) {
    const data = this.clean(dto);
    const sortOrder = data.sortOrder ?? (await this.repo.count());
    return this.repo.save(this.repo.create({ ...data, slug: await this.uniqueSlug(data.name), sortOrder }));
  }

  async update(id: number, dto: UpdateRoomDto) {
    const room = await this.findOne(id);
    const data = this.clean(dto);
    if (data.name && data.name !== room.name) room.slug = await this.uniqueSlug(data.name, id);
    Object.assign(room, data);
    return this.repo.save(room);
  }

  async setImage(id: number, url: string) {
    const room = await this.findOne(id);
    removeUpload(room.imageUrl);
    room.imageUrl = url;
    return this.repo.save(room);
  }

  async clearImage(id: number) {
    const room = await this.findOne(id);
    removeUpload(room.imageUrl);
    room.imageUrl = null;
    return this.repo.save(room);
  }

  async remove(id: number) {
    const room = await this.findOne(id);
    removeUpload(room.imageUrl);
    await this.repo.remove(room);
    return { ok: true };
  }

  async seed(rows: Partial<Room>[]) {
    if ((await this.repo.count()) > 0) return;
    await this.repo.save(rows.map((r) => this.repo.create(r)));
  }
}
