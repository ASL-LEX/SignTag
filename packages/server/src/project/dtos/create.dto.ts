import { InputType, OmitType } from '@nestjs/graphql';
import { Project } from '../project.model';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class ProjectCreate extends OmitType(Project, ['_id', 'created', 'organization'] as const, InputType) {}

export class ProjectCreateV2 implements Omit<Project, '_id' | 'created' | 'organization'> {
  @ApiProperty({ description: 'Human readable name to identify the project' })
  name!: string;

  @ApiProperty({ description: 'Description of the project for easier recognition' })
  description!: string;
}
