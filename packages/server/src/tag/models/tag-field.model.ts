import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { createUnionType, Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import mongoose from 'mongoose';
import { VideoField } from './video-field.model';
import { FreeTextField } from './free-text-field.model';
import { BooleanField } from './boolean-field.model';
import { NumericField } from './numeric-field.model';
import { SliderField } from './slider-field.model';
import { AslLexField } from './asl-lex-field.model';

export enum TagFieldType {
  ASL_LEX = 'ASL_LEX',
  AUTOCOMPLETE = 'AUTOCOMPLETE',
  BOOLEAN = 'BOOLEAN',
  EMBEDDED = 'EMBEDDED',
  FREE_TEXT = 'FREE_TEXT',
  NUMERIC = 'NUMERIC',
  SLIDER = 'SLIDER',
  VIDEO_RECORD = 'VIDEO_RECORD'
}

registerEnumType(TagFieldType, {
  name: 'TagFieldType'
});

export const TagFieldUnion = createUnionType({
  name: 'TagFieldUnion',
  types: () => [AslLexField, BooleanField, FreeTextField, NumericField, SliderField, VideoField] as const
});

@Schema()
@ObjectType()
export class TagField {
  /**
   * Used to determine what kind of field this tag field represents
   */
  @Prop({ required: true, enum: TagFieldType })
  @Field(() => TagFieldType)
  type!: TagFieldType;

  @Prop({ required: true })
  @Field()
  name!: string;

  /**
   * Holds the data itself, this can be an ID referencing a more complex
   * object or be the value itself. A factory method exists for converting
   * the data into the field the user is querying for
   */
  @Prop({ required: false, type: mongoose.Schema.Types.Mixed })
  data: any;

  /* Not shown is a resolve field for the representation of the data */
}

export const TagFieldSchema = SchemaFactory.createForClass(TagField);
