import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export class Dataset {
  @Field(() => ID)
  _id!: string;

  @Prop()
  organization!: string;

  @Prop({ required: true })
  @Field()
  name!: string;

  @Prop({ required: true })
  @Field()
  description!: string;

  @Prop()
  bucketPrefix!: string;
}

export type DatasetDocument = Dataset & Document;
export const DatasetSchema = SchemaFactory.createForClass(Dataset);
