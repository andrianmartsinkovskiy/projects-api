import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
export class ChangeTaskStatusDto {
  @IsNumber()
  @IsNotEmpty()
  taskId: number;

  @IsBoolean()
  @IsNotEmpty()
  isDone: boolean;
}
