import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'User mail' })
  @IsString({ message: 'Must be a string' })
  @IsEmail({}, { message: 'Incorrect email' })
  readonly email: string;

  @ApiProperty({ example: 'gregr_23ferg', description: 'User password' })
  @IsString({ message: 'Must be a string' })
  @Length(6, 16, {
    message: 'Password must be at least 6 and no more than 16 characters long',
  })
  readonly password: string;
}
