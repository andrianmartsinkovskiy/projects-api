import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserToken } from 'src/entities/user-token.entity';
import { Repository } from 'typeorm';
import { sign, verify } from 'jsonwebtoken';
import { UserRole } from 'src/types/user-roles.type';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from '../dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserToken)
    private userToken_repository: Repository<UserToken>,
    @InjectRepository(User) private users_repository: Repository<User>,
  ) {}

  async registerUser(dto: RegisterUserDto) {
    // validation
    const { login, password } = dto;
    const isLoginExist = await this.findOneByLogin(login);
    if (isLoginExist) {
      throw new BadRequestException('User already exists.');
    }

    // create user
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.create({
      login: dto.login,
      role: UserRole.USER,
      password: hashedPassword,
    });

    // save token
    const tokens = this.generateTokenPayload(
      user.id,
      user.role,
      user.isAuthenticated,
      user.login,
    );
    await this.saveToken(user.id, tokens.refreshToken);

    return {
      message: 'Successfully register',
      accessToken: tokens.accessToken,
    };
  }

  async login(dto) {
    const user = await this.findOneByLogin(dto.login);

    // validation
    if (!user) {
      throw new BadRequestException('invalid credentials');
    }
    if (!(await bcrypt.compare(dto.password, user.password))) {
      throw new BadRequestException('invalid password');
    }

    // save token
    const tokens = this.generateTokenPayload(
      user.id,
      user.role,
      user.isAuthenticated,
      user.login,
    );
    await this.saveToken(user.id, tokens.refreshToken);

    return {
      user: user,
      tokens: tokens,
    };
  }

  async findById(id: number): Promise<User> {
    return this.users_repository.findOne({ where: { id } });
  }

  async findOneByLogin(login: string): Promise<User> {
    return this.users_repository.findOne({ where: { login } });
  }

  verifyRefreshToken(token: string) {
    try {
      return verify(token, process.env.JWT_SECRET);
    } catch {
      return null;
    }
  }

  async create(user: {
    password: any;
    role: UserRole;
    login: string;
  }): Promise<User> {
    const newUser = await this.users_repository.create(user);
    await this.users_repository.save(newUser);

    return newUser;
  }

  async findTokenInDataBase(refreshToken: string) {
    return await this.userToken_repository.findOne({
      where: {
        refreshToken: refreshToken,
      },
    });
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(
        'You dont authorized,please sign or sign up',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userData = this.verifyRefreshToken(refreshToken);
    const userTokenFromDb = this.findTokenInDataBase(refreshToken);
    if (!userData || !userTokenFromDb) {
      throw new HttpException(
        'You dont authorized,please sign or sign up',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.users_repository.findOne(userData.id);
    const tokens = this.generateTokenPayload(
      user.id,
      user.role,
      user.isAuthenticated,
      user.login,
    );
    await this.saveToken(user.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user.id,
    };
  }

  generateTokenPayload(
    userId: number,
    role: UserRole,
    isVerified: boolean,
    name: string,
  ) {
    const accessToken = sign(
      { userId, role, isVerified, name },
      process.env.JWT_SECRET,
      {
        expiresIn: '10d',
      },
    );

    const refreshToken = sign(
      { userId, role, isVerified, name },
      process.env.JWT_SECRET,
      {
        expiresIn: '60d',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: number, refreshToken: string) {
    const user = await this.users_repository.findOne({ where: { id: userId } });
    const tokenData = await this.userToken_repository
      .createQueryBuilder('UserToken')
      .leftJoinAndSelect('UserToken.users', 'User')
      .where('User.id = :userId', { userId })
      .getOne();

    if (tokenData) {
      Object.assign(tokenData, { refreshToken: refreshToken });
      return await this.userToken_repository.save(tokenData);
    }

    const token = new UserToken();
    token.refreshToken = refreshToken;
    token.users = user;
    return await this.userToken_repository.save(token);
  }
}
