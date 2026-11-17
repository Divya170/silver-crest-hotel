import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsHexColor, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { GALLERY_CATEGORIES, GalleryCategory } from '../gallery-item.entity';

export class CreateGalleryItemDto {
  @IsString() @IsNotEmpty({ message: 'Add a short title for the photo.' }) @MaxLength(120) title: string;
  @IsIn(GALLERY_CATEGORIES as unknown as string[], { message: 'Choose a category.' }) category: GalleryCategory;
  @IsOptional() @IsString() @MaxLength(250) alt?: string;
  @IsOptional() @IsInt() @Min(1) @Max(3) rows?: number;
  @IsOptional() @IsInt() @Min(1) @Max(2) cols?: number;
  @IsOptional() @IsHexColor() tone?: string;
  @IsOptional() @IsBoolean() featuredOnHome?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsBoolean() published?: boolean;
}

export class UpdateGalleryItemDto extends PartialType(CreateGalleryItemDto) {}
