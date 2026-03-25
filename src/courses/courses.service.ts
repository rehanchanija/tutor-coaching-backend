import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../schemas/course.schema';
import { CreateCourseDto, UpdateCourseProgressDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) {}

  async create(createCourseDto: CreateCourseDto): Promise<CourseDocument> {
    const course = new this.courseModel(createCourseDto);
    return course.save();
  }

  async findAllBySubject(subjectId: string): Promise<CourseDocument[]> {
    return this.courseModel.find({ subjectId: subjectId as any }).exec();
  }

  async updateProgress(
    id: string,
    updateDto: UpdateCourseProgressDto,
  ): Promise<CourseDocument> {
    const { progress } = updateDto;
    let status = 'not_started';
    let completionDate: Date | undefined = undefined;

    if (progress === 100) {
      status = 'completed';
      completionDate = new Date();
    } else if (progress > 0) {
      status = 'ongoing';
    }

    const course = (await this.courseModel
      .findByIdAndUpdate(
        id,
        { progress, status, completionDate },
        { new: true },
      )
      .exec()) as CourseDocument;

    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async getSubjectProgress(subjectId: string): Promise<number> {
    const courses: CourseDocument[] = await this.courseModel
      .find({ subjectId: subjectId as any })
      .exec();
    if (courses.length === 0) return 0;
    const totalProgress = courses.reduce(
      (sum, c) => sum + (c.progress || 0),
      0,
    );
    return totalProgress / courses.length;
  }
}
