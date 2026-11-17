import { PartialType } from '@nestjs/mapped-types';
import { ArrayMaxSize, IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoomDto {
  @IsString() @IsNotEmpty({ message: 'Add the room category name.' }) @MaxLength(120) name: string;
  @IsOptional() @IsString() @MaxLength(4000) description?: string;
  @IsOptional() @IsArray() @ArrayMaxSize(30) @IsString({ each: true }) facilities?: string[];
  @IsOptional() @IsString() @MaxLength(200) imageAlt?: string;
  @IsOptional() @IsString() @MaxLength(120) occupancyNote?: string | null;
  @IsOptional() @IsString() @MaxLength(120) sizeNote?: string | null;
  @IsOptional() @IsString() @MaxLength(120) rateNote?: string | null;
  @IsOptional() @IsString() @MaxLength(1000) clientNote?: string | null;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsBoolean() published?: boolean;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}
