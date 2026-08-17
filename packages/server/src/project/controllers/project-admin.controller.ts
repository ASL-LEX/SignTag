import { Controller, Delete, Post, Put, Get, Query, Response, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FeatureFlag } from '../../feature-flag/feature-flag.decorator';
import { RAQuery } from '../../shared/ra-query.dto';
import { Response as Res } from 'express';
import { ProjectService } from '../project.service';
import { makeContentRange } from '@bu-sail/ra-query-core';
import { ProjectCreateV2 } from '../dtos/create.dto';
import { Project } from '../project.model';

@Controller('api/admin/project')
@ApiTags('Project (Admin)')
export class AdminProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @FeatureFlag('SIGNTAG_ADMIN_PROJECT_ENDPOINT')
  async create(@Body() newProject: ProjectCreateV2): Promise<Project> {
    // TODO: Check permissions

    // TODO: Get organization ID from auth guard
    return this.projectService.create(newProject, '6a832a3d17d5333f9f601db3')
  }

  @Get()
  @ApiOperation({ summary: 'Get many projects' })
  @FeatureFlag('SIGNTAG_ADMIN_PROJECT_ENDPOINT')
  async getMany(@Query() query: RAQuery, @Response() response: Res): Promise<any> {
    // TODO: Check permissions

    // TODO: Get organization ID from auth guard
    const projects = await this.projectService.get(query, '6a832a3d17d5333f9f601db3');

    response.setHeader('Content-Range', makeContentRange('projects', projects));

    return response.json(projects.data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single project' })
  @FeatureFlag('SIGNTAG_ADMIN_PROJECT_ENDPOINT')
  async get() {}

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing project' })
  @FeatureFlag('SIGNTAG_ADMIN_PROJECT_ENDPOINT')
  async update() {}

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing project' })
  @FeatureFlag('SIGNTAG_ADMIN_PROJECT_ENDPOINT')
  async delete() {}
}
