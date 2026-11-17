import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from '../rooms/rooms.module';
import { InquiriesAdminController, InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';
import { Inquiry } from './inquiry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry]), RoomsModule],
  controllers: [InquiriesController, InquiriesAdminController],
  providers: [InquiriesService],
})
export class InquiriesModule {}
