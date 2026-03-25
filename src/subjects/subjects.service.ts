import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject, SubjectDocument } from '../schemas/subject.schema';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
    private coursesService: CoursesService,
  ) {}

  async create(createDto: CreateSubjectDto): Promise<SubjectDocument> {
    const subject = new this.subjectModel(createDto);
    return subject.save();
  }

  async findAllByBatch(batchId: string): Promise<any[]> {
    const subjects = await this.subjectModel
      .find({ batchId: batchId as any })
      .exec();
    const subjectsWithProgress = await Promise.all(
      subjects.map(async (subject) => {
        const progress = await this.coursesService.getSubjectProgress(
          (subject as any)._id.toString(),
        );
        return {
          ...subject.toObject(),
          progress,
        };
      }),
    );
    return subjectsWithProgress;
  }

  async getBatchProgress(batchId: string): Promise<number> {
    const subjects = await this.findAllByBatch(batchId);
    if (subjects.length === 0) return 0;
    const totalProgress = subjects.reduce(
      (sum, s) => sum + (s.progress || 0),
      0,
    );
    return totalProgress / subjects.length;
  }
}
