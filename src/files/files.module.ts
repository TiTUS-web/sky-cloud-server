import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { File } from './files.model';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [SequelizeModule.forFeature([File])],
  exports: [FilesService],
})
export class FilesModule {}
