import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import mongoose, { Document } from 'mongoose';
import JSON from 'graphql-type-json';
import { Tag } from '../../tag/models/tag.model';

@Schema()
@ObjectType()
export class SignLabRecorded {
  /** The tag the recording is associated with */
  @Prop({ required: true })
  @Field(() => Tag)
  tag!: string;

  /** The name of the field within the tag */
  @Prop({ requied: true })
  @Field()
  fieldName!: string;

  /** The study the entry was recorded as part of */
  @Prop()
  study!: string;

  @Prop({ required: true })
  videoNumber!: number;

  /** The user who made the recording */
  @Prop({ required: false })
  user?: string;
}

export const SignLabRecordedSchema = SchemaFactory.createForClass(SignLabRecorded);

@Schema()
@ObjectType()
export class Entry {
  @Field()
  _id!: string;

  // TODO: Add GraphQL reference back to organization
  @Prop()
  @Field(() => ID)
  organization!: string;

  @Prop({ required: true, trim: true })
  @Field()
  entryID!: string;

  @Prop({ trim: true })
  bucketLocation!: string;

  @Prop({ required: true, trim: true })
  @Field()
  contentType!: string;

  @Prop({ required: true })
  recordedInSignLab!: boolean;

  @Prop({ type: SignLabRecorded })
  @Field(() => SignLabRecorded, { nullable: true })
  signlabRecording?: SignLabRecorded;

  // TODO: Add GraphQL reference back to dataset object
  @Prop()
  @Field(() => ID)
  dataset!: string;

  // TODO: Add GraphQL reference back to user object
  @Prop()
  @Field(() => ID)
  creator!: string;

  @Prop()
  @Field()
  dateCreated!: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  @Field(() => JSON, { nullable: true })
  meta: any;

  @Prop({ required: false })
  signedURLExpiration!: Date;

  @Prop()
  @Field()
  isTraining!: boolean;

  // TODO: Add creator field
}

export type EntryDocument = Entry & Document;
export const EntrySchema = SchemaFactory.createForClass(Entry);
