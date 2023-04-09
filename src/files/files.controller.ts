import {
  Body,
  Controller,
  Delete,
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
  async createFile(@Body() fileDto: CreateFileDto): Promise<any> {
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

  @Post('/upload/:id')
  uploadFile(@Body() fileDto: CreateFileDto) {
    return this.filesService.uploadFile(fileDto).catch(() => {
      throw new HttpException(
        'File upload error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  @Delete('/delete/:id')
  deleteFile(@Body() fileDto: CreateFileDto): Promise<void> {
    return this.filesService.deleteFile(fileDto).catch(() => {
      throw new HttpException(
        'File delete error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }
}
