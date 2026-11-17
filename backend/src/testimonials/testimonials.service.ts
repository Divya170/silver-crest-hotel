import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fieldErrors } from '../common/validation';
import { SettingsService } from '../settings/settings.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';
import { Testimonial } from './testimonial.entity';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial) private readonly repo: Repository<Testimonial>,
    private readonly settings: SettingsService,
  ) {}

  /** Shown only when the feature flag is on AND at least one verified, published testimonial exists. */
  async listPublic() {
    const s = await this.settings.get();
    if (!s.showTestimonials) return { enabled: false, items: [] as Testimonial[] };
    const items = await this.repo.find({ where: { published: true, verified: true }, order: { sortOrder: 'ASC', id: 'ASC' } });
    return { enabled: items.length > 0, items };
  }

  listAdmin(search?: string) {
    const qb = this.repo.createQueryBuilder('t').orderBy('t.sortOrder', 'ASC').addOrderBy('t.id', 'DESC');
    if (search?.trim()) qb.andWhere('(LOWER(t.quote) LIKE :q OR LOWER(t.guestName) LIKE :q)', { q: `%${search.trim().toLowerCase()}%` });
    return qb.getMany();
  }

  async findOne(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Testimonial not found.');
    return row;
  }

  private guard(row: Partial<Testimonial>) {
    if (row.published && !row.verified) {
      throw fieldErrors({ published: 'Mark the testimonial as verified (genuine, with permission) before publishing it.' });
    }
  }

  async create(dto: CreateTestimonialDto) {
    const row = this.repo.create(dto);
    this.guard(row);
    return this.repo.save(row);
  }

  async update(id: number, dto: UpdateTestimonialDto) {
    const row = await this.findOne(id);
    Object.assign(row, dto);
    if (dto.verified === false) row.published = false;
    this.guard(row);
    return this.repo.save(row);
  }

  async remove(id: number) {
    await this.repo.remove(await this.findOne(id));
    return { ok: true };
  }
}
