import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateDirDto } from './dto/create-dir.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post()
  async createDir(@Body() fileDto: CreateDirDto): Promise<any> {
    return this.filesService.createDir(fileDto).catch((err) => {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  @Get('/:id')
  getFiles(@Param() param, @Query() query: { parent: string; sort: string }) {
    const { parent, sort } = query;

    return this.filesService.getFiles(param.id, parent, sort).catch((err) => {
      console.log(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  @Post('/upload/:id')
  uploadFile(@Param() param) {
    return this.filesService.uploadFile(param.id).catch((err) => {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  @Delete('/delete/:id')
  deleteFile(@Param() param): Promise<string> {
    return this.filesService.deleteFile(param.id).catch((err) => {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}
