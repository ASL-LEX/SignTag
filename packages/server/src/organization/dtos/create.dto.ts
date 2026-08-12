import { InputType, OmitType, Field } from '@nestjs/graphql';
import { Organization } from '../organization.model';

@InputType()
export class OrganizationCreate extends OmitType(Organization, ['_id'] as const, InputType) {
  /**
   * This is mirroring the field in `Organization` model, should only be
   * available during creation.
   */
  @Field()
  projectId!: string;
}
