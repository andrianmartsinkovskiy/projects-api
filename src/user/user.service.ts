import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private user_repository: Repository<User>,
  ) {}

  async getAllUsers() {
    return await this.user_repository.find();
  }

  async getUser(id: number) {
    const user = await this.user_repository.findOne({ where: { id } });
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    return {
      user: {
        id: user.id,
        login: user.login,
      },
    };
  }
}
