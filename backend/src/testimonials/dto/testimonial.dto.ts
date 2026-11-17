import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTestimonialDto {
  @IsString() @IsNotEmpty({ message: 'Add the guest’s words.' }) @MaxLength(1200) quote: string;
  @IsString() @IsNotEmpty({ message: 'Add the guest’s name (as they agreed to be credited).' }) @MaxLength(120) guestName: string;
  @IsOptional() @IsString() @MaxLength(120) context?: string | null;
  @IsOptional() @IsBoolean() verified?: boolean;
  @IsOptional() @IsBoolean() published?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
}

export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {}
