import { Field, ID, InputType, OmitType } from '@nestjs/graphql';
import { StudyDownloadRequest } from '../models/study-download-request.model';

@InputType()
export class CreateStudyDownloadRequest extends OmitType(
  StudyDownloadRequest,
  [
    '_id',
    'date',
    'status',
    'tagCSVLocation',
    'entryZIPLocation',
    'bucketLocation',
    'entryZIPLocation',
    'webhookPayloadLocation',
    'taggedEntriesJSONLocation',
    'taggedEntriesZipLocation',
    'taggedEntryWebhookPayloadLocation'
  ] as const,
  InputType
) {
  @Field(() => ID)
  study!: string;
}
