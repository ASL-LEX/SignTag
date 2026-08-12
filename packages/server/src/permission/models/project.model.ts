import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/user.model';

@ObjectType()
export class ProjectPermissionModel {
  @Field(() => User)
  user!: string;

  @Field()
  isProjectAdmin!: boolean;

  @Field()
  editable!: boolean;
}
