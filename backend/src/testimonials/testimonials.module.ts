import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsModule } from '../settings/settings.module';
import { Testimonial } from './testimonial.entity';
import { TestimonialsAdminController, TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';

@Module({
  imports: [TypeOrmModule.forFeature([Testimonial]), SettingsModule],
  controllers: [TestimonialsController, TestimonialsAdminController],
  providers: [TestimonialsService],
})
export class TestimonialsModule {}
