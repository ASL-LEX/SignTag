import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { parseRange, parseSort, parseFilter, type FilterItem, type Sort, type Range } from '@bu-sail/ra-query-core';
import { ApiProperty } from '@nestjs/swagger';

export class RAQuery {
  @IsOptional()
  @Transform(parseSort)
  @ApiProperty({
    required: false,
    type: String,
    description: "Way to determine how to sort the results, follows FakeRest's sort specification",
    example: '["title", "asc"]'
  })
  sort?: Sort;

  @IsOptional()
  @Transform(parseRange)
  @ApiProperty({
    required: false,
    type: String,
    description: "Used to restrict results to fall within a range, follows FakeRest's range specification",
    example: '[0-9]'
  })
  range?: Range;

  @IsOptional()
  @Transform(parseFilter)
  @ApiProperty({
    required: false,
    type: String,
    description: "For filtering results, follows FakeRest's filter specficiation",
    example: '{"title": "Section 1-A"}'
  })
  filter?: FilterItem[];
}
