import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'users/dto/create-user.dto';
import { UsersService } from 'users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'users/users.model';
import { JwtService } from '@nestjs/jwt';
import { TAuthResponse } from '../types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto): Promise<TAuthResponse> {
    const user: User = await this.validateUser(userDto);

    return {
      token: await this.generateToken(user),
      user,
    };
  }

  async registration(userDto: CreateUserDto): Promise<TAuthResponse> {
    const currentUserByEmail: User = await this.userService.getUserByEmail(
      userDto.email,
    );

    if (currentUserByEmail) {
      throw new HttpException(
        'A user with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user: User = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    return {
      token: await this.generateToken(user),
      user,
    };
  }

  private async generateToken(user: User): Promise<string> {
    const payload = { email: user.email, id: user.id };

    const token: string = this.jwtService.sign(payload, {
      secret: process.env.PRIVATE_KEY,
    });

    return token;
  }

  private async validateUser(userDto: CreateUserDto): Promise<User> {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({ massage: 'Incorrect email or password' });
  }
}
