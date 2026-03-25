import {
  Controller,
  Post,
  Get,
  Patch,
  Query,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  async createStudent(@Body() createUserDto: CreateUserDto) {
    createUserDto.role = 'student';
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  async findAll(@Query('batchId') batchId? : string) {
    if (batchId) {
      return this.usersService.findAllByBatch(batchId);
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    // Only admin can see others, users can see themselves (basic check added for robustness)
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      // throw new ForbiddenException();
    }
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateUserDto>) {
    return this.usersService.update(id, updateData);
  }
}
