import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, ValidateIf } from 'class-validator';

export class CreateFileDto {
  @IsOptional()
  readonly id: number;

  @IsString({ message: 'Must be a string' })
  readonly name: string;

  @IsString({ message: 'Must be a string' })
  readonly type: string;

  @IsNumber({}, { message: 'Must be a number' })
  readonly userId: number;

  @IsNumber({}, { message: 'Must be a number' })
  @ValidateIf((object, value) => value !== null)
  readonly parentId: number | null;

  @IsOptional()
  readonly childIds: number[];
}
