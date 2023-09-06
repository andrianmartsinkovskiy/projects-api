import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class EditProjectDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
