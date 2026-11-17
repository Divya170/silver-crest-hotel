import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Settings } from './settings.entity';

export function telHref(phone?: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : null;
}

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(Settings) private readonly repo: Repository<Settings>) {}

  async get(): Promise<Settings> {
    let s = await this.repo.findOne({ where: { id: 1 } });
    if (!s) s = await this.repo.save(this.repo.create({ id: 1 }));
    return s;
  }

  /** Public view adds derived, ready-to-use link values so the frontend never rebuilds them. */
  async getPublic() {
    const s = await this.get();
    const fullAddress = `${s.addressLine1}, ${s.city}, ${s.region} ${s.postalCode}, ${s.country}`;
    const q = encodeURIComponent(fullAddress);
    return {
      ...s,
      fullAddress,
      phoneHref: telHref(s.phone),
      emailHref: s.email ? `mailto:${s.email}` : null,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${q}`,
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${q}`,
    };
  }

  async update(dto: UpdateSettingsDto) {
    const s = await this.get();
    const patch: Partial<Settings> = { ...dto };
    for (const k of ['phone', 'email', 'mapEmbedUrl'] as const) {
      if (patch[k] === '') patch[k] = null;
    }
    Object.assign(s, patch);
    await this.repo.save(s);
    return this.getPublic();
  }

  async seed() {
    const existing = await this.repo.findOne({ where: { id: 1 } });
    if (existing) return;
    await this.repo.save(
      this.repo.create({
        id: 1,
        phone: '+1 (842) 147-2951',
        email: 'silvercresthotel@hotmail.com',
      }),
    );
  }
}
