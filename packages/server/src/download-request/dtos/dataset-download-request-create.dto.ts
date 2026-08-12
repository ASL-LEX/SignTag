import { Field, ID, InputType, OmitType } from '@nestjs/graphql';
import { DatasetDownloadRequest } from '../models/dataset-download-request.model';

@InputType()
export class CreateDatasetDownloadRequest extends OmitType(
  DatasetDownloadRequest,
  [
    '_id',
    'date',
    'status',
    'entryZIPLocation',
    'bucketLocation',
    'entryJSONLocation',
    'webhookPayloadLocation'
  ] as const,
  InputType
) {
  @Field(() => ID)
  dataset!: string;
}
