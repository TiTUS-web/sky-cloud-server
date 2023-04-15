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

  async createFile(dto: CreateFileDto): Promise<File> {
    const { id, name, type, format, userId, parentId } = dto;
    const file: File = new File({ id, name, type, format, userId, parentId });

    const parentFile: File = await File.findOne({
      where: { id: file.parentId },
    });
    const parentChildsIds: number[] | [] = parentFile
      ? parentFile.childIds
      : [];

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

  async getFiles(): Promise<File[]> {
    const files: File[] = await this.fileRepository.findAll();
    return files;
  }

  async uploadFile(id: number): Promise<fileUpload.UploadFile> {
    const file: fileUpload.UploadFile = (await File.findOne({
      where: { id: id },
    })) as fileUpload.UploadFile;

    const parentFile: File = await File.findOne({
      where: { id: file.parentId },
    });
    const user: User = await User.findOne({ where: { id: file.userId } });

    if (user.usedSpace + file.size > user.diskSpace) {
      throw new HttpException('No disk space', HttpStatus.BAD_REQUEST);
    }

    user.usedSpace = user.usedSpace + file.size;

    // TODO You need to pass the current file path
    const oldPath = file.currentPath;
    const newPath: string = this.getPath(file, parentFile);

    if (fs.existsSync(newPath)) {
      throw new HttpException('File already exist', HttpStatus.BAD_REQUEST);
    }

    fs.mkdirSync(path.dirname(newPath), { recursive: true });
    fs.renameSync(oldPath, newPath);

    file.save();
    user.save();

    return file;
  }

  async deleteFile(id: number): Promise<string> {
    const file: File = await File.findOne({ where: { id: id } });

    const parentFile: File = await File.findOne({
      where: { id: file.parentId },
    });

    const path: string = this.getPath(file, parentFile);

    if (file.type === 'dir') {
      fs.rmdirSync(path);
    } else {
      fs.unlinkSync(path);
    }

    await File.destroy({
      where: { id: file.id },
    });

    return file.name;
  }

  getPath(file: File, parentFile: File): string {
    if (parentFile) {
      return `${process.env.FILE_PATH}/USER ${file.userId}/${parentFile.path}/${file.name}.${file.format}`;
    } else {
      if (file.format === 'dir') {
        return `${process.env.FILE_PATH}/USER ${file.userId}/${file.name}`;
      } else {
        return `${process.env.FILE_PATH}/USER ${file.userId}/${file.name}.${file.format}`;
      }
    }
  }
}
