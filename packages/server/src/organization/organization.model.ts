import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Schema()
@ObjectType()
export class Organization {
  @Field(() => ID)
  _id!: string;

  @Prop()
  @Field()
  name!: string;

  @Prop()
  @Field({ description: 'Tenant ID in the Identity Platform' })
  tenantID!: string;

  @Prop()
  @Field({ description: 'URL where the user logs in against' })
  authURL!: string;
}

export type OrganizationDocument = Organization & Document;
export const OrganizationSchema = SchemaFactory.createForClass(Organization);
