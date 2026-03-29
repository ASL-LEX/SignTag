import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';
import { Study } from '../../study/study.model';
import { Entry } from '../../entry/models/entry.model';
import { TagFieldSchema, TagField } from './tag-field.model';

@Schema()
@ObjectType()
export class Tag {
  @Field()
  _id: string;

  @Prop()
  @Field(() => Entry)
  entry: string;

  @Prop()
  @Field(() => Study)
  study: string;

  @Prop()
  @Field()
  complete: boolean;

  @Prop({ required: false })
  @Field({ nullable: true, description: 'The user assigned to the tag ' })
  user?: string;

  @Prop({ requried: false, type: [TagFieldSchema] })
  @Field(() => [TagField], {
    nullable: true,
    description: 'The data stored in the tag, not populated until a contributor has tagged'
  })
  data?: TagField[];

  @Prop()
  @Field({ description: 'Way to rank tags based on order to be tagged' })
  order: number;

  @Prop()
  @Field({ description: 'If the tag is enabled as part of the study, way to disable certain tags' })
  enabled: boolean;

  @Prop()
  @Field({ description: 'If the tag is part of a training' })
  training: boolean;

  @Prop()
  @Field({ description: 'Indicates if the tag is a catch trial' })
  isCatchTrial: boolean;
}

export type TagDocument = Tag & Document;
export const TagSchema = SchemaFactory.createForClass(Tag);
