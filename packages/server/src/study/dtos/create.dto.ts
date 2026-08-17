import { Field, InputType, OmitType, ID } from '@nestjs/graphql';
import { Study, TagSchema, StudyConfig } from '../study.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Layout, JsonSchema as JSONSchema } from '@jsonforms/core';

@InputType()
class TagSchemaInput extends OmitType(TagSchema, [] as const, InputType) {}

@InputType()
class StudyConfigInput extends OmitType(StudyConfig, [] as const, InputType) {}

@InputType()
export class StudyCreate extends OmitType(
  Study,
  ['_id', 'organization', 'project', 'tagSchema', 'studyConfig'] as const,
  InputType
) {
  @Field(() => ID)
  project!: string;

  @Field()
  tagSchema!: TagSchemaInput;

  @Field({ nullable: true })
  studyConfig?: StudyConfigInput;
}

export class TagSchemaCreateV2 implements TagSchema {
  @IsObject()
  @ApiProperty({ description: 'JSON schema describing the shape of the data collected for a single tag' })
  dataSchema!: JSONSchema;

  @IsObject()
  @ApiProperty({ description: 'JSON Forms UI schema controlling how the tag input is rendered' })
  uiSchema!: Layout;
}

export class StudyConfigCreateV2 implements StudyConfig {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'When set, users who recorded a given entry, cannot then tag on that entry',
    required: false
  })
  disableSameUserEntryTagging?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'When set, the tags that are served are sorted based on the entry ID', required: false })
  sortByEntryID?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'If set, the clear button will not be present in the UI of the study', required: false })
  disableClear?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description:
      'If set, and if the entry presented to the user was originally recorded in SignTag, the user will be presented with the cue entry that resulted in the entry they are now labeling',
    required: false
  })
  showPriorCue?: boolean;
}

export class StudyCreateV2 implements Omit<Study, '_id' | 'organization'> {
  @IsString()
  @ApiProperty({ description: 'Human readable name to identify the study' })
  name!: string;

  @IsString()
  @ApiProperty({ description: 'Description of the study for easier recognition' })
  description!: string;

  @IsString()
  @ApiProperty({ description: 'Instructions presented to contributors labeling the study' })
  instructions!: string;

  @ValidateNested()
  @Type(() => TagSchemaCreateV2)
  @ApiProperty({ description: 'Schema defining the tag that is collected for each entry', type: TagSchemaCreateV2 })
  tagSchema!: TagSchemaCreateV2;

  @IsString()
  @ApiProperty({ description: 'ID of the project this study belongs to' })
  project!: string;

  @IsNumber()
  @ApiProperty({ description: 'Number of tags to be collected per entry' })
  tagsPerEntry!: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => StudyConfigCreateV2)
  @ApiProperty({
    description: 'Additional configuration options for the study',
    type: StudyConfigCreateV2,
    required: false
  })
  studyConfig?: StudyConfigCreateV2;
}
