import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  batchId: string;
}
