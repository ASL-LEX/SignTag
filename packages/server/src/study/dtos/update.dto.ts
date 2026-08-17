import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Study } from '../study.model';
import { StudyConfigCreateV2, TagSchemaCreateV2 } from './create.dto';

export class StudyUpdateV2 implements Partial<Omit<Study, '_id' | 'organization'>> {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Human readable name to identify the study', required: false })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Description of the study for easier recognition', required: false })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Instructions presented to contributors labeling the study', required: false })
  instructions?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TagSchemaCreateV2)
  @ApiProperty({
    description: 'Schema defining the tag that is collected for each entry',
    type: TagSchemaCreateV2,
    required: false
  })
  tagSchema?: TagSchemaCreateV2;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'ID of the project this study belongs to', required: false })
  project?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Number of tags to be collected per entry', required: false })
  tagsPerEntry?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => StudyConfigCreateV2)
  @ApiProperty({
    description: 'Additional configuration options for the study',
    type: StudyConfigCreateV2,
    required: false
  })
  studyConfig?: StudyConfigCreateV2;
}
