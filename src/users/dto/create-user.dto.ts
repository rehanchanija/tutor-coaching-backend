import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'password123', description: 'User password (optional on update)' })
  @IsNotEmpty()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'student', enum: ['admin', 'student'], default: 'student' })
  @IsEnum(['admin', 'student'])
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ example: '65f1234567890abcdef12345', description: 'The MongoDB ObjectId of the batch' })
  @IsMongoId()
  @IsOptional()
  batchId?: string;
}
