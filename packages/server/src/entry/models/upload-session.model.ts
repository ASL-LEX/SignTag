import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * Represents a single user uploading against a dataset.
 */
@Schema()
@ObjectType()
export class UploadSession {
  @Field(() => ID, { description: 'The ID of the upload session' })
  _id!: string;

  // TODO: Add in user
  // @Prop({ required: true })
  // user: string;

  @Prop({ required: true })
  @Field()
  dataset!: string;

  @Prop({ required: true })
  @Field()
  created!: Date;

  @Prop()
  bucketPrefix!: string;

  /** URL To the CSV within the bucket storage */
  @Prop({ required: false, type: String })
  csvURL!: string | null;

  @Prop({ required: false, type: String })
  entryPrefix!: string | null;

  @Prop()
  organization!: string;
}

export type UploadSessionDocument = UploadSession & Document;
export const UploadSessionSchema = SchemaFactory.createForClass(UploadSession);
