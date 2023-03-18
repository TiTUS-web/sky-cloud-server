import { CreateFileDto } from './dto/create-file.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { File } from './files.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/users.model';
const fs = require('fs');
import fileUpload from 'express-fileupload';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File) private fileRepository: typeof File) {}

  async createFile(dto: CreateFileDto) {
    const { id, name, type, format, userId, parentId } = dto;
    const file = new File({ id, name, type, format, userId, parentId });

    const parentFile = await File.findOne({ where: { id: file.parentId } });
    const parentChildsIds = parentFile.childIds;

    file.path = parentFile ? `${parentFile.path}/${file.name}` : file.name;

    await file.save();

    if (parentFile) {
      // TODO It must be null, because sequelize cannot track changes in the array
      parentFile.childIds = null;
      parentFile.childIds = parentChildsIds;
      parentFile.childIds.push(file.id);

      await parentFile.save();
    }

    return file;
  }

  async getFiles() {
    const files = await this.fileRepository.findAll();
    return files;
  }

  async uploadFile(dto: CreateFileDto) {
    const { id } = dto;
    const file = (await File.findOne({
      where: { id: id },
    })) as fileUpload.UploadFile;

    const parentFile = await File.findOne({ where: { id: file.parentId } });
    const user = await User.findOne({ where: { id: file.userId } });

    if (user.usedSpace + file.size > user.diskSpace) {
      throw new HttpException('No disk space', HttpStatus.BAD_REQUEST);
    }

    user.usedSpace = user.usedSpace + file.size;

    // TODO You need to pass the current file path
    const oldPath = file.currentPath;
    const newPath = parentFile
      ? `${process.env.FILE_PATH}/USER ${user.id}/${parentFile.path}/${file.name}${file.format}`
      : `${process.env.FILE_PATH}/USER ${user.id}/${file.name}${file.format}`;

    if (fs.existsSync(newPath)) {
      throw new HttpException('File already exist', HttpStatus.BAD_REQUEST);
    }

    fs.mkdirSync(path.dirname(newPath), { recursive: true });
    fs.renameSync(oldPath, newPath);

    file.save();
    user.save();

    return file;
  }
}
