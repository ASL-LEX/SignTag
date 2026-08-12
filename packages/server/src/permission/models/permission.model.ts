import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Permission {
  @Field()
  owner!: boolean;

  @Field()
  projectAdmin!: boolean;

  @Field()
  studyAdmin!: boolean;

  @Field()
  trainedContributor!: boolean;

  @Field()
  contributor!: boolean;
}
