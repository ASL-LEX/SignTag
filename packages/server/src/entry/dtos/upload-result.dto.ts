import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum UploadStatus {
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success'
}

registerEnumType(UploadStatus, {
  name: 'UploadStatus'
});

@ObjectType()
export class UploadResult {
  @Field(() => UploadStatus)
  status!: UploadStatus;

  @Field({ nullable: true })
  message?: string;
}
