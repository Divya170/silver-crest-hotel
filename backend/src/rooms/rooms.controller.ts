import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { imageUploadOptions, publicUrlFor, requireFile } from '../common/upload';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly rooms: RoomsService) {}

  @Get()
  list() {
    return this.rooms.listPublic();
  }

  @Get(':slug')
  get(@Param('slug') slug: string) {
    return this.rooms.findPublicBySlug(slug);
  }
}

@Controller('admin/rooms')
@UseGuards(JwtAuthGuard)
export class RoomsAdminController {
  constructor(private readonly rooms: RoomsService) {}

  @Get()
  list(@Query('search') search?: string, @Query('status') status?: 'published' | 'hidden') {
    return this.rooms.listAdmin(search, status);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.rooms.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateRoomDto) {
    return this.rooms.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoomDto) {
    return this.rooms.update(id, dto);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions()))
  upload(@Param('id', ParseIntPipe) id: number, @UploadedFile() file?: Express.Multer.File) {
    return this.rooms.setImage(id, publicUrlFor(requireFile(file).filename));
  }

  @Delete(':id/image')
  clearImage(@Param('id', ParseIntPipe) id: number) {
    return this.rooms.clearImage(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rooms.remove(id);
  }
}
