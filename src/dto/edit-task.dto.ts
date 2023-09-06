import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class EditTaskDto {
  @IsNotEmpty()
  @IsNumber()
  taskId: number;

  @IsNotEmpty()
  @IsString()
  title: string;
}
