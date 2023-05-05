import { CreateDirDto } from './dto/create-dir.dto';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { File } from './files.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import fileUpload from 'express-fileupload';

const fs = require('fs');

@Injectable()
export class FilesService {
  constructor(@InjectModel(File) private fileRepository: typeof File) {}

  async createDir(dto: CreateDirDto): Promise<File> {
    const { id, name, type, format, path, access, userId, parentId } = dto;
    const file: File = new File({
      id,
      name,
      type,
      format,
      path,
      access,
      userId,
      parentId,
    });

    const existingDirectory: File = await this.checkExistingDirectory(
      file.name,
    );

    if (existingDirectory) {
      throw new ConflictException('Directory name already exists');
    }

    await file.save();
    return await this.uploadFile(file.id);
  }

  async getFiles(
    userId: number,
    parentId: string = null,
    sort: string = null,
  ): Promise<File[]> {
    const files: File[] = await this.fileRepository.findAll({
      where: { userId: userId, parentId: parentId },
      order: this.getOrderSort(sort) as any,
    });

    return files;
  }

  async uploadFile(id: number): Promise<fileUpload.UploadFile> {
    const file: fileUpload.UploadFile = (await File.findOne({
      where: { id: id },
    })) as fileUpload.UploadFile;

    const user: User = await User.findOne({ where: { id: file.userId } });

    if (user.usedSpace + file.size > user.diskSpace) {
      throw new HttpException('No disk space', HttpStatus.BAD_REQUEST);
    }

    user.usedSpace = user.usedSpace + file.size;
    const path: string = this.getPath(file.userId, file.path);

    if (fs.existsSync(path)) {
      throw new HttpException('File already exist', HttpStatus.BAD_REQUEST);
    }

    fs.mkdirSync(path, { recursive: true });

    file.save();
    user.save();

    return file;
  }

  async deleteFile(id: number): Promise<string> {
    const file: File = await File.findOne({ where: { id: id } });

    const path: string = this.getPath(file.userId, file.path);

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

  private getPath(userId: number, path: string): string {
    return `files/USER ${userId}${path}`;
  }

  private async checkExistingDirectory(sFilename: string): Promise<File> {
    const file: File = await File.findOne({
      where: { name: sFilename },
    });

    return file;
  }

  private getOrderSort(sort: string): string[][] {
    if (!sort) return null;

    const oSort: object = sort
      .split(',')
      .reduce((result: object, sort: string) => {
        const [key, value] = sort.split(':');
        result[key] = value;

        return result;
      }, {});

    const arSort: string[][] = Object.entries(oSort).map(
      ([key, value]: string[]) => [key, value],
    );

    return arSort;
  }
}
