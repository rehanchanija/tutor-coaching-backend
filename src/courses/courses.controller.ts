import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseProgressDto } from './dto/course.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles('admin')
  async create(@Body() createDto: CreateCourseDto) {
    return this.coursesService.create(createDto);
  }

  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  @Patch(':id')
  @Roles('admin')
  async updateProgress(
    @Param('id') id: string,
    @Body() updateDto: UpdateCourseProgressDto,
  ) {
    return this.coursesService.updateProgress(id, updateDto);
  }

  @Get(':subjectId')
  async findAllBySubject(@Param('subjectId') subjectId: string) {
    // For students, check batch might be needed but simple fetch for now
    return this.coursesService.findAllBySubject(subjectId);
  }
}
