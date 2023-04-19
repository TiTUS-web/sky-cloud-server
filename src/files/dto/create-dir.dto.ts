import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, ValidateIf } from 'class-validator';

export class CreateDirDto {
  @IsOptional()
  readonly id: number;

  @IsString({ message: 'Must be a string' })
  readonly name: string;

  @IsString({ message: 'Must be a string' })
  readonly type: string;

  @IsString({ message: 'Must be a string' })
  readonly format: string;

  @IsString({ message: 'Must be a string' })
  readonly access: string;

  @IsString({ message: 'Must be a string' })
  readonly path: string;

  @IsNumber({}, { message: 'Must be a number' })
  readonly userId: number;

  @IsNumber({}, { message: 'Must be a number' })
  @ValidateIf((object, value) => value !== null)
  readonly parentId: number | null;
}
