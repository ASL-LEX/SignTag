import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/user.model';

@ObjectType()
export class StudyPermissionModel {
  @Field(() => User)
  user!: string;

  @Field()
  isStudyAdmin!: boolean;

  @Field()
  isStudyAdminEditable!: boolean;

  @Field()
  isContributor!: boolean;

  @Field()
  isContributorEditable!: boolean;

  @Field()
  isTrained!: boolean;

  @Field()
  isTrainedEditable!: boolean;
}
