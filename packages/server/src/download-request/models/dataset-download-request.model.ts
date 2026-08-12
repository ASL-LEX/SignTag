import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DownloadStatus, DownloadRequest } from './download-request.model';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

export enum DatasetDownloadField {
  ENTRY_ZIP = 'ENTRY_ZIP'
}

registerEnumType(DatasetDownloadField, {
  name: 'DatasetDownloadField'
});

@Schema()
@ObjectType()
export class DatasetDownloadRequest implements DownloadRequest {
  @Field()
  _id!: string;

  @Prop({ required: true })
  organization!: string;

  @Prop({ required: true })
  @Field()
  date!: Date;

  @Prop({ required: true, enum: DownloadStatus })
  @Field(() => DownloadStatus)
  status!: DownloadStatus;

  @Prop({ required: true })
  dataset!: string;

  @Prop({ required: false })
  entryZIPLocation?: string;

  @Prop({ required: false })
  bucketLocation?: string;

  @Prop({ required: false })
  entryJSONLocation?: string;

  @Prop({ required: false })
  webhookPayloadLocation?: string;

  @Prop({ required: true })
  entryZipComplete!: boolean;

  @Prop({ required: true })
  verificationCode!: string;
}

export type DatasetDownloadRequestDocument = Document & DatasetDownloadRequest;
export const DatasetDownloadRequestSchema = SchemaFactory.createForClass(DatasetDownloadRequest);
