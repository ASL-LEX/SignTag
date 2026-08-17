import { Controller, Delete, Post, Put, Get, Query, Response, Body, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FeatureFlag } from '../../feature-flag/feature-flag.decorator';
import { RAQuery } from '../../shared/ra-query.dto';
import { Response as Res } from 'express';
import { StudyService } from '../study.service';
import { makeContentRange } from '@bu-sail/ra-query-core';
import { StudyCreateV2 } from '../dtos/create.dto';
import { Study } from '../study.model';
import { StudyUpdateV2 } from '../dtos/update.dto';
import { StudyPipe } from '../pipes/study.pipe';

@Controller('api/v1/admin/studies')
@ApiTags('Study (Admin)')
export class AdminStudyController {
  constructor(private readonly studyService: StudyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new study' })
  @FeatureFlag('SIGNTAG_ADMIN_STUDY_ENDPOINT')
  async create(@Body() newStudy: StudyCreateV2): Promise<Study> {
    // TODO: Check permissions

    // TODO: Get organization ID from auth guard
    return this.studyService.create(newStudy, '6a832a3d17d5333f9f601db3');
  }

  @Get()
  @ApiOperation({ summary: 'Get many studies' })
  @FeatureFlag('SIGNTAG_ADMIN_STUDY_ENDPOINT')
  async getMany(@Query() query: RAQuery, @Response() response: Res): Promise<any> {
    // TODO: Check permissions

    // TODO: Get organization ID from auth guard
    const studies = await this.studyService.get(query, '6a832a3d17d5333f9f601db3');

    response.setHeader('Content-Range', makeContentRange('studies', studies));

    return response.json(studies.data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single study' })
  @ApiParam({ name: 'id', description: 'ID of the study to retrieve' })
  @FeatureFlag('SIGNTAG_ADMIN_STUDY_ENDPOINT')
  async get(@Param('id') id: string): Promise<Study> {
    // TODO: Check permissions

    const study = await this.studyService.findById(id);
    if (!study) {
      throw new NotFoundException();
    }
    return study;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing study' })
  @ApiParam({ name: 'id', description: 'ID of the study to update', type: String })
  @FeatureFlag('SIGNTAG_ADMIN_STUDY_ENDPOINT')
  async update(@Param('id', StudyPipe) study: Study, @Body() update: StudyUpdateV2) {
    // TODO: Check permissions
    return this.studyService.update(study._id, update);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing study' })
  @FeatureFlag('SIGNTAG_ADMIN_STUDY_ENDPOINT')
  @ApiParam({ name: 'id', type: String })
  async delete(@Param('id', StudyPipe) study: Study): Promise<Study> {
    // TODO: Check permissions
    await this.studyService.delete(study);
    return study;
  }
}
