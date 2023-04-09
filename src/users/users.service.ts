import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private usersRepository: typeof User) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user: User = await this.usersRepository.create(dto);
    return user;
  }

  async getUsers(): Promise<User[]> {
    const users: User[] = await this.usersRepository.findAll();
    return users;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user: User = await this.usersRepository.findOne({ where: { email } });
    return user;
  }
}
