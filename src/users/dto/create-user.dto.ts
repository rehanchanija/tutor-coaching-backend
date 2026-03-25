import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, IsMongoId } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password?: string;

  @IsEnum(['admin', 'student'])
  @IsOptional()
  role?: string;

  @IsMongoId()
  @IsOptional()
  batchId?: string;
}
