import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, IsUrl, Max, MaxLength, Min, ValidateIf } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional() @IsString() @MaxLength(120) hotelName?: string;
  @IsOptional() @IsString() @MaxLength(120) tagline?: string;
  @IsOptional() @IsString() @MaxLength(160) addressLine1?: string;
  @IsOptional() @IsString() @MaxLength(80) city?: string;
  @IsOptional() @IsString() @MaxLength(40) region?: string;
  @IsOptional() @IsString() @MaxLength(20) postalCode?: string;
  @IsOptional() @IsString() @MaxLength(60) country?: string;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null && v !== '')
  @IsString()
  @MaxLength(40)
  phone?: string | null;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null && v !== '')
  @IsEmail({}, { message: 'Enter a valid email address.' })
  email?: string | null;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null && v !== '')
  @IsUrl({ protocols: ['https'], require_protocol: true }, { message: 'Use a full https:// Google Maps embed URL.' })
  mapEmbedUrl?: string | null;

  @IsOptional() @IsBoolean() heroAutoplay?: boolean;

  @IsOptional()
  @IsInt()
  @Min(5, { message: 'Use 5–8 seconds between slides.' })
  @Max(8, { message: 'Use 5–8 seconds between slides.' })
  heroIntervalSeconds?: number;

  @IsOptional() @IsBoolean() showTestimonials?: boolean;
  @IsOptional() @IsString() @MaxLength(200) footerNote?: string;
}
