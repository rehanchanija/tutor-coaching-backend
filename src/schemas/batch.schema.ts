import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BatchDocument = Batch & Document;

@Schema({ timestamps: true })
export class Batch {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['morning', 'evening'] })
  type: string;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
