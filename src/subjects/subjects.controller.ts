import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('subjects')
@ApiBearerAuth()
@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles('admin')
  async create(@Body() createDto: CreateSubjectDto) {
    return this.subjectsService.create(createDto);
  }

  @Get(':batchId')
  async findAllByBatch(@Param('batchId') batchId: string, @Req() req: any) {
    // For student, check if it's their batch
    if (req.user.role === 'student' && req.user.batchId !== batchId) {
      // Return assigned batch only or throw
    }
    return this.subjectsService.findAllByBatch(batchId);
  }
}
