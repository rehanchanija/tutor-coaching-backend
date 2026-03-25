import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UsersService } from '../users/users.service';

@ApiTags('batches')
@ApiBearerAuth()
@Controller('batches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BatchesController {
  constructor(
    private readonly batchesService: BatchesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @Roles('admin')
  async create(@Body() createDto: CreateBatchDto) {
    return this.batchesService.create(createDto);
  }

  @Get()
  async findAll(@Req() req: any, @Query('type') type?: string) {
    if (req.user.role === 'admin') {
      return this.batchesService.findAll(type);
    } else {
      // For student, only their assigned batch
      const user = await this.usersService.findById(req.user.userId);
      if (user && user.batchId) {
        const batch = await this.batchesService.findById(
          (user.batchId as any)._id.toString(),
        );
        return [batch];
      }
      return [];
    }
  }
}
