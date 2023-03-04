import { CreateFileDto } from './dto/create-file.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { File } from './files.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File) private fileRepository: typeof File) {}

  async createFile(dto: CreateFileDto) {
    const { id, name, type, userId, parentId } = dto;
    const file = new File({ id, name, type, userId, parentId });

    const parentFile = await File.findOne({ where: { id: file.parentId } });
    const childsIds = parentFile.childIds;

    file.path = parentFile ? `${parentFile.path}/${file.name}` : file.name;

    await file.save();

    if (parentFile) {
      parentFile.childIds = null;
      parentFile.childIds = childsIds;
      parentFile.childIds.push(file.id);

      await parentFile.save();
    }

    return file;
  }

  async getFiles() {
    const files = await this.fileRepository.findAll();
    return files;
  }
}
