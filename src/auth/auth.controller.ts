import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth_service: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('/register')
  async registerUser(
    @Req() req: Request,
    @Body() dto: RegisterUserDto,
    @Res() res: Response,
  ) {
    const data = await this.auth_service.registerUser(dto);

    return res.json(data);
  }

  @UsePipes(new ValidationPipe())
  @Post('/login')
  async login(
    @Req() req: Request,
    @Body() dto: LoginUserDto,
    @Res() res: Response,
  ) {
    const data = await this.auth_service.login(dto);

    res.cookie('refreshToken', data.tokens.refreshToken, {
      maxAge: 60 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).send({
      status: 'success',
      userId: data.user.id,
      accessToken: data.tokens.accessToken,
      message: 'you successful login',
    });
  }
}
