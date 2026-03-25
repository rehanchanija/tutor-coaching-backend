import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { Batch, BatchSchema } from '../schemas/batch.schema';
import { SubjectsModule } from '../subjects/subjects.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Batch.name, schema: BatchSchema }]),
    SubjectsModule,
    UsersModule,
  ],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService],
})
export class BatchesModule {}
