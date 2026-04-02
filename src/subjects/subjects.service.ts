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

  async findAll(): Promise<any[]> {
    const subjects = await this.subjectModel.find().exec();
    return this.addProgressToSubjects(subjects);
  }

  async findAllByBatch(batchId: string): Promise<any[]> {
    console.log(`[SubjectsService] Finding subjects for batchId: ${batchId}`);
    const subjects = await this.subjectModel
      .find({ batchId: batchId as any })
      .exec();
    console.log(`[SubjectsService] Found ${subjects.length} subjects in DB`);
    return this.addProgressToSubjects(subjects);
  }

  private async addProgressToSubjects(subjects: SubjectDocument[]): Promise<any[]> {
    const subjectsWithProgress = await Promise.all(
      subjects.map(async (subject) => {
        const courses = await this.coursesService.findAllBySubject(
          (subject as any)._id.toString(),
        );
        const total = courses.length;
        const completed = courses.filter((c) => (c as any).progress === 100).length;
        
        // Calculate true percentage instead of rigid completion
        const progress = await this.coursesService.getSubjectProgress((subject as any)._id.toString());

        return {
          ...subject.toObject(),
          totalChapters: total,
          completedChapters: completed,
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
