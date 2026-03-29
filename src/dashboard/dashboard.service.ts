import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Batch } from 'src/schemas/batch.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('Batch') private readonly batchModel: Model<Batch>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async getStats() {
    const [totalBatches, totalStudents] = await Promise.all([
      this.batchModel.countDocuments(),
      this.userModel.countDocuments({ role: 'student' }),
    ]);

    return {
      totalBatches,
      totalStudents,
    };
  }
}
