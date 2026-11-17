import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { AMENITY_ICONS } from '../amenity.entity';

export class CreateAmenityDto {
  @IsString() @IsNotEmpty({ message: 'Add the amenity name.' }) @MaxLength(120) name: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsString() @IsNotEmpty({ message: 'Add a group name.' }) @MaxLength(80) groupName?: string;
  @IsOptional() @IsIn([...AMENITY_ICONS, null], { message: 'Choose an icon from the list.' }) icon?: string | null;
  @IsOptional() @IsString() @MaxLength(200) imageAlt?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsBoolean() published?: boolean;
}

export class UpdateAmenityDto extends PartialType(CreateAmenityDto) {}
