import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { removeUpload } from '../common/upload';
import { Amenity } from './amenity.entity';
import { CreateAmenityDto, UpdateAmenityDto } from './dto/amenity.dto';

@Injectable()
export class AmenitiesService {
  constructor(@InjectRepository(Amenity) private readonly repo: Repository<Amenity>) {}

  /** Grouped for the site: { featured, groups: [{ name, items }] }. */
  async listPublic(group?: string) {
    const where = group ? { published: true, groupName: group } : { published: true };
    const items = await this.repo.find({ where, order: { sortOrder: 'ASC', id: 'ASC' } });
    const featured = items.find((a) => a.featured) ?? null;
    const map = new Map<string, Amenity[]>();
    for (const a of items) {
      if (!map.has(a.groupName)) map.set(a.groupName, []);
      map.get(a.groupName)!.push(a);
    }
    return { total: items.length, featured, items, groups: [...map.entries()].map(([name, list]) => ({ name, items: list })) };
  }

  listAdmin(search?: string, group?: string) {
    const qb = this.repo.createQueryBuilder('a').orderBy('a.groupName', 'ASC').addOrderBy('a.sortOrder', 'ASC').addOrderBy('a.id', 'ASC');
    if (search?.trim()) qb.andWhere('(LOWER(a.name) LIKE :q OR LOWER(a.description) LIKE :q)', { q: `%${search.trim().toLowerCase()}%` });
    if (group) qb.andWhere('a.groupName = :group', { group });
    return qb.getMany();
  }

  async groups() {
    const rows = await this.repo.createQueryBuilder('a').select('DISTINCT a.groupName', 'name').orderBy('name', 'ASC').getRawMany<{ name: string }>();
    return rows.map((r) => r.name);
  }

  async findOne(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Amenity not found.');
    return row;
  }

  /** Only one amenity can be featured at a time. */
  private async clearOtherFeatured(keepId: number) {
    await this.repo.createQueryBuilder().update(Amenity).set({ featured: false }).where('id != :id', { id: keepId }).andWhere('featured = 1').execute();
  }

  async create(dto: CreateAmenityDto) {
    const row = await this.repo.save(this.repo.create({ ...dto, sortOrder: dto.sortOrder ?? (await this.repo.count()) }));
    if (row.featured) await this.clearOtherFeatured(row.id);
    return row;
  }

  async update(id: number, dto: UpdateAmenityDto) {
    const row = await this.findOne(id);
    Object.assign(row, dto);
    const saved = await this.repo.save(row);
    if (saved.featured) await this.clearOtherFeatured(saved.id);
    return saved;
  }

  async setImage(id: number, url: string | null) {
    const row = await this.findOne(id);
    removeUpload(row.imageUrl);
    row.imageUrl = url;
    return this.repo.save(row);
  }

  async remove(id: number) {
    const row = await this.findOne(id);
    removeUpload(row.imageUrl);
    await this.repo.remove(row);
    return { ok: true };
  }
}
