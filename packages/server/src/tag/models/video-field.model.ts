import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { Entry } from 'src/entry/models/entry.model';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export class VideoField {
  _id!: string;

  @Field(() => [Entry])
  @Prop()
  entries!: string[];

  constructor(obj: any) {
    Object.assign(this, obj);
  }
}

export type VideoFieldDocument = VideoField & Document;
export const VideoFieldSchema = SchemaFactory.createForClass(VideoField);
