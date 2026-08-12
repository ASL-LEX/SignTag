import { Field, InputType, OmitType, ID } from '@nestjs/graphql';
import { Study, TagSchema, StudyConfig } from '../study.model';

@InputType()
class TagSchemaInput extends OmitType(TagSchema, [] as const, InputType) {}

@InputType()
class StudyConfigInput extends OmitType(StudyConfig, [] as const, InputType) {}

@InputType()
export class StudyCreate extends OmitType(Study, ['_id', 'project', 'tagSchema', 'studyConfig'] as const, InputType) {
  @Field(() => ID)
  project!: string;

  @Field()
  tagSchema!: TagSchemaInput;

  @Field({ nullable: true })
  studyConfig?: StudyConfigInput;
}
