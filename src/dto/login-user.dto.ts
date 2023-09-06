import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  login: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  password: string;
}
