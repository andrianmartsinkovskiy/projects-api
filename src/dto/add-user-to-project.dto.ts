import { IsNotEmpty, IsNumber } from 'class-validator';
export class AddUserToProjectDto {
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
