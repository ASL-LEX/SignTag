import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DownloadRequest, DownloadStatus } from './download-request.model';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum StudyDownloadField {
  ENTRY_ZIP = 'ENTRY_ZIP',
  TAGGED_ENTRIES_ZIP = 'TAGGED_ENTRIES_ZIP'
}

registerEnumType(StudyDownloadField, {
  name: 'StudyDownloadField'
});

@Schema()
@ObjectType()
export class StudyDownloadRequest implements DownloadRequest {
  @Field()
  _id!: string;

  @Prop({ required: true })
  organization!: string;

  @Prop({ required: true })
  @Field()
  date!: Date;

  @Prop({ required: true, enum: DownloadStatus })
  @Field()
  status!: DownloadStatus;

  @Prop({ required: true })
  study!: string;

  /** Location in a bucket where the tag data as a CSV should be stored */
  @Prop({ requied: false })
  tagCSVLocation?: string;

  /** Location in a bucket where any entries recorded as part of a study will be */
  @Prop({ required: false })
  entryZIPLocation?: string;

  /** Location in a bucket where to place the user mappings */
  @Prop({ required: false })
  userCSVLocation?: string;

  /** The prefix for all bucket locations */
  @Prop({ required: false })
  bucketLocation?: string;

  /** Where the JSON list of entries recorded as part of the study will be */
  @Prop({ required: false })
  entryJSONLocation?: string;

  /** Webhook payload to be called when the zipping of entries recorded in the study is complete */
  @Prop({ required: false })
  webhookPayloadLocation?: string;

  /** Location in a bucket where the entries tagged will be stored */
  @Prop({ required: false })
  taggedEntriesZipLocation?: string;

  /** Location in a bucket where the JSON list of entries tagged as part of the study will be */
  @Prop({ required: false })
  taggedEntriesJSONLocation?: string;

  /** Webhook payload to be used when the zipping of tagged entries is complete */
  @Prop({ required: false })
  taggedEntryWebhookPayloadLocation?: string;

  @Prop({ required: true })
  entryZipComplete!: boolean;

  @Prop({ required: true })
  taggedEntryZipComplete!: boolean;

  @Prop({ required: true })
  verificationCode!: string;
}

export type StudyDownloadRequestDocument = Document & StudyDownloadRequest;
export const StudyDownloadRequestSchema = SchemaFactory.createForClass(StudyDownloadRequest);
