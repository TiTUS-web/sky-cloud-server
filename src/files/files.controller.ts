import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post()
  async createFile(@Body() fileDto: CreateFileDto) {
    return this.filesService.createFile(fileDto).catch(() => {
      throw new HttpException(
        'An error occurred while writing the file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  @Get()
  getFiles() {
    return this.filesService.getFiles();
  }
}
