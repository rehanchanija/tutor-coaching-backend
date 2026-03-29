import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateBatchDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(['morning', 'evening'])
  type: string;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  completionDate: string;
}
