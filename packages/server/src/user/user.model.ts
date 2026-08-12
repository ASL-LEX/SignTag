import { Field, ObjectType } from '@nestjs/graphql';
import { UserRecord } from 'firebase-admin/auth';

@ObjectType()
export class User extends UserRecord {
  @Field()
  uid!: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  photoURL?: string;
}
