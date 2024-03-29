import {
  DataType,
  Model,
  Table,
  Column,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'users/users.model';

interface FileCreationAttrs {
  id: number;
  name: string;
  type: string;
  format: string;
  access: string;
  path: string;
  userId: number;
  parentId: number;
}

@Table({ tableName: 'files' })
export class File extends Model<File, FileCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  format: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  path: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'public',
  })
  access: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  size: number;

  @Column({
    type: DataType.DATE,
    defaultValue: Date.now(),
  })
  date: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ForeignKey(() => File)
  @Column({ type: DataType.INTEGER, defaultValue: null })
  parentId: number;
}
