import { IsOptional, IsString } from 'class-validator';
import { Project } from '../project.model';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectUpdateV2 implements Partial<Omit<Project, '_id' | 'organization' | 'created'>> {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Human readable name to identify the project', required: false })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Description of the project for easier recognition', required: false })
  description?: string;
}
