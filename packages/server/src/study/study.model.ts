import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import mongoose, { Document } from 'mongoose';
import JSON from 'graphql-type-json';
import { Layout, JsonSchema as JSONSchema } from '@jsonforms/core';

/** Definition for the tag in JSON schema */
@Schema()
@ObjectType()
export class TagSchema {
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  @Field(() => JSON)
  dataSchema: JSONSchema;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  @Field(() => JSON)
  uiSchema: Layout;
}

const TagSchemaSchema = SchemaFactory.createForClass(TagSchema);

@Schema()
@ObjectType()
export class StudyConfig {
  /**
   * When set, users who recorded a given entry, cannot then
   * tag on that entry
   */
  @Prop({ required: false })
  @Field({ nullable: true })
  disableSameUserEntryTagging?: boolean;

  /**
   * When set, the tags that are served are sorted based on the entryID
   */
  @Prop({ required: false })
  @Field({ nullable: true })
  sortByEntryID?: boolean;

  /**
   * If set, clear button will not be present in the UI of the study
   */
  @Prop({ required: false })
  @Field({ nullable: true })
  disableClear?: boolean;

  /**
   * If set, and if the entry prosented from the user was originally
   * recorded in SignTag, the user will be presented with the cue
   * entry that resulted in the entry they are now labeling
   */
  @Prop({ required: false })
  @Field({ nullable: true })
  showPriorCue?: boolean;
}

const StudyConfigSchema = SchemaFactory.createForClass(StudyConfig);

@Schema()
@ObjectType()
export class Study {
  @Field(() => ID)
  _id: string;

  @Prop()
  @Field()
  name: string;

  @Prop()
  organization: string;

  @Prop()
  @Field()
  description: string;

  @Prop()
  @Field()
  instructions: string;

  @Prop({ type: TagSchemaSchema, required: true })
  @Field(() => TagSchema)
  tagSchema: TagSchema;

  // TODO: Add resolver for project field
  @Prop()
  @Field(() => ID)
  project: string;

  @Prop()
  @Field()
  tagsPerEntry: number;

  @Prop({ type: StudyConfigSchema, requried: false })
  @Field(() => StudyConfig, { nullable: true })
  studyConfig?: StudyConfig;
}

export type StudyDocument = Study & Document;
export const StudySchema = SchemaFactory.createForClass(Study);
