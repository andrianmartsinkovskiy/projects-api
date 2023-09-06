import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
export class AddProjectDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  name: string;
}
