import { IsNotEmpty, IsNumber } from 'class-validator';
export class RemoveUserFromProjectDto {
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
