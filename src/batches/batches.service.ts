import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Batch, BatchDocument } from '../schemas/batch.schema';
import { CreateBatchDto } from './dto/create-batch.dto';
import { SubjectsService } from '../subjects/subjects.service';

@Injectable()
export class BatchesService {
  constructor(
    @InjectModel(Batch.name) private batchModel: Model<BatchDocument>,
    private subjectsService: SubjectsService,
  ) {}

  async create(createDto: CreateBatchDto): Promise<BatchDocument> {
    const batch = new this.batchModel(createDto);
    return batch.save();
  }

  async findAll(type?: string): Promise<any[]> {
    const filter = type ? { type } : {};
    const batches = await this.batchModel.find(filter).exec();
    const batchesWithProgress = await Promise.all(
      batches.map(async (batch) => {
        const progress = await this.subjectsService.getBatchProgress(
          batch._id.toString(),
        );
        return {
          ...batch.toObject(),
          progress,
        };
      }),
    );
    return batchesWithProgress;
  }

  async findById(id: string): Promise<any> {
    const batch = await this.batchModel.findById(id).exec();
    if (!batch) return null;
    const progress = await this.subjectsService.getBatchProgress(batch._id.toString());
    return {
      ...batch.toObject(),
      progress,
    };
  }
}
