import { IsNotEmpty, IsString, IsMongoId, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  subjectId: string;
}

export class UpdateCourseProgressDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;
}
