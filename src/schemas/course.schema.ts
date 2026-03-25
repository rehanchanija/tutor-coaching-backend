import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Subject } from './subject.schema';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Subject', required: true })
  subjectId: Subject;

  @Prop({ default: 0, min: 0, max: 100 })
  progress: number;

  @Prop({
    default: 'not_started',
    enum: ['not_started', 'ongoing', 'completed'],
  })
  status: string;

  @Prop({ type: Date, optional: true })
  completionDate?: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
