import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Schema()
@ObjectType()
export class Project {
  @Field(() => ID)
  _id!: string;

  @Prop()
  @Field()
  name!: string;

  @Prop()
  organization!: string;

  @Prop()
  @Field()
  description!: string;

  @Prop()
  @Field()
  created!: Date;
}

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);
