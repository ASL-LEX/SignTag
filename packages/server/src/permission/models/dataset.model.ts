import { ObjectType, Field } from '@nestjs/graphql';
import { Dataset } from '../../dataset/dataset.model';

@ObjectType()
export class DatasetProjectPermission {
  @Field(() => Dataset)
  dataset!: string;

  @Field()
  projectHasAccess!: boolean;
}
