import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { imageUploadOptions, publicUrlFor, requireFile } from '../common/upload';
import { AmenitiesService } from './amenities.service';
import { AMENITY_ICONS } from './amenity.entity';
import { CreateAmenityDto, UpdateAmenityDto } from './dto/amenity.dto';

@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenities: AmenitiesService) {}

  @Get()
  list(@Query('group') group?: string) {
    return this.amenities.listPublic(group);
  }
}

@Controller('admin/amenities')
@UseGuards(JwtAuthGuard)
export class AmenitiesAdminController {
  constructor(private readonly amenities: AmenitiesService) {}

  @Get()
  list(@Query('search') search?: string, @Query('group') group?: string) {
    return this.amenities.listAdmin(search, group);
  }

  @Get('meta')
  async meta() {
    return { icons: AMENITY_ICONS, groups: await this.amenities.groups() };
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.amenities.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAmenityDto) {
    return this.amenities.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAmenityDto) {
    return this.amenities.update(id, dto);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions()))
  upload(@Param('id', ParseIntPipe) id: number, @UploadedFile() file?: Express.Multer.File) {
    return this.amenities.setImage(id, publicUrlFor(requireFile(file).filename));
  }

  @Delete(':id/image')
  clearImage(@Param('id', ParseIntPipe) id: number) {
    return this.amenities.setImage(id, null);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.amenities.remove(id);
  }
}
