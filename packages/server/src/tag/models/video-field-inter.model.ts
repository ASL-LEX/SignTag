import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

/**
 * Represents a single video field in a study. This is used for temporarily
 * storing the recording video data before the tag is submitted and the video
 * is turned into an Entry.
 */
@Schema()
@ObjectType()
export class VideoFieldIntermediate {
  @Field()
  _id!: string;

  /** The tag the video field is a part of */
  @Prop()
  tag!: string;

  /** The field of the tag the video field is a part of */
  @Prop()
  field!: string;

  /** The index of the video field in the tag */
  @Prop()
  index!: number;

  /** Where within the bucket the video is stored */
  @Prop()
  bucketLocation!: string;

  @Prop()
  organization!: string;
}

export type VideoFieldIntermediateDocument = VideoFieldIntermediate & Document;
export const VideoFieldIntermediateSchema = SchemaFactory.createForClass(VideoFieldIntermediate);
