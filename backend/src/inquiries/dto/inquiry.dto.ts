import { Allow, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { INQUIRY_STATUSES, InquiryStatus } from '../inquiry.entity';

/**
 * Field presence/type only. The business rules (dates, guests, email, phone) are checked in
 * InquiriesService.validate() so the error messages match the site's inline messages exactly.
 */
export class CreateInquiryDto {
  @Allow() roomId?: number | string | null;
  @Allow() checkIn?: string;
  @Allow() checkOut?: string;
  @Allow() guests?: number | string;
  @Allow() name?: string;
  @Allow() email?: string;
  @Allow() phone?: string;
  @Allow() message?: string | null;
  @IsOptional() @IsIn(['rooms', 'contact']) source?: 'rooms' | 'contact';
}

export class UpdateInquiryDto {
  @IsOptional() @IsIn(INQUIRY_STATUSES as unknown as string[], { message: 'Choose New, Responded or Archived.' }) status?: InquiryStatus;
  @IsOptional() @IsString() @MaxLength(4000) adminNotes?: string | null;
}

export class ListInquiriesQuery {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsIn([...INQUIRY_STATUSES, 'all']) status?: InquiryStatus | 'all';
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() pageSize?: string;
  @IsOptional() @IsIn(['newest', 'oldest', 'checkin']) sort?: 'newest' | 'oldest' | 'checkin';
}
