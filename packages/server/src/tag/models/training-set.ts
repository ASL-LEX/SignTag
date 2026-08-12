import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TrainingSet {
  @Prop()
  study!: string;

  @Prop()
  entries!: string[];
}

export type TrainingSetDocument = TrainingSet & Document;
export const TrainingSetSchema = SchemaFactory.createForClass(TrainingSet);
