import { InputType, OmitType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Project } from '../project.model';

@InputType()
export class ProjectCreate extends OmitType(Project, ['_id', 'created', 'organization'] as const, InputType) {}

export class ProjectCreateRest implements Omit<Project, '_id' | 'created' | 'organization'> {
  @IsString()
  name: string;
  
  @IsString()
  description: string;
}
