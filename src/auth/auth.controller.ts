import { CreateUserDto } from 'users/dto/create-user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TAuthResponse } from '../types/auth.types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Allows users to log in' })
  @ApiResponse({ status: 200 })
  @Post('/login')
  login(@Body() userDto: CreateUserDto): Promise<TAuthResponse> {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'Allows users to register in the system' })
  @ApiResponse({ status: 200 })
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto): Promise<TAuthResponse> {
    return this.authService.registration(userDto);
  }
}
