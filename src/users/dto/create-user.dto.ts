import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'User mail' })
  readonly email: string;

  @ApiProperty({ example: 'gregr_23ferg', description: 'User password' })
  readonly password: string;
}
