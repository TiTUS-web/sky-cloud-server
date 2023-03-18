import { DataType, Model, Table, Column, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { File } from 'files/files.model';

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique user ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'user@mail.ru', description: 'User mail' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @ApiProperty({ example: 'gregr_23ferg', description: 'User password' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => File)
  files: File[];

  @Column({ type: DataType.BIGINT, defaultValue: 1024 ** 3 * 10 })
  diskSpace: bigint;

  @Column({ type: DataType.BIGINT, defaultValue: 0 })
  usedSpace: bigint;
}
