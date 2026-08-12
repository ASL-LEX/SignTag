import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum BucketType {
  GCP = 'GCP',
  S3 = 'S3'
}

/**
 * Represents information on a cloud storage endpoint used
 * for an organization
 */
@Schema()
export class BucketInfo {
  _id!: string;

  @Prop()
  bucketName!: string;

  @Prop({ type: String, enum: BucketType })
  bucketType!: BucketType;

  /** The GCP Secret Manager name for the bucket credentials */
  @Prop()
  secretName!: string;

  /** Organization the bucket is associated with */
  @Prop()
  organization!: string;
}

export type BucketInfoDocument = BucketInfo & Document;
export const BucketInfoSchema = SchemaFactory.createForClass(BucketInfo);
