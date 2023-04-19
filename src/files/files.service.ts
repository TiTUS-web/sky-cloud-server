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
const fs = require('fs');
import fileUpload from 'express-fileupload';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File) private fileRepository: typeof File) {}

  async createDir(dto: CreateDirDto): Promise<void> {
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
    await this.uploadFile(file.id);
  }

  async getFiles(): Promise<File[]> {
    const files: File[] = await this.fileRepository.findAll();
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
    const path: string = this.getPath(file.path);

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

    const path: string = this.getPath(file.path);

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

  private getPath(path: string): string {
    return `files/${path}`;
  }

  private async checkExistingDirectory(sFilename: string): Promise<File> {
    const file: File = await File.findOne({
      where: { name: sFilename },
    });

    return file;
  }
}
