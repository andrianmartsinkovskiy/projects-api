import { IsNotEmpty, IsNumber } from 'class-validator';
export class AssignTaskDto {
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  taskId: number;
}
