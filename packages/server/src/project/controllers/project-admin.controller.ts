import { Controller, Delete, Post, Put, Get, Query, Response, Body, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FeatureFlag } from '../../feature-flag/feature-flag.decorator';
import { RAQuery } from '../../shared/ra-query.dto';
import { Response as Res } from 'express';
import { ProjectService } from '../project.service';
import { makeContentRange } from '@bu-sail/ra-query-core';
import { ProjectCreateV2 } from '../dtos/create.dto';
import { Project } from '../project.model';
import { ProjectUpdateV2 } from '../dtos/update.dto';
import { ProjectPipe } from '../pipes/project.pipe';

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
  @ApiParam({ name: 'id', description: 'ID of the project to retrieve' })
  @FeatureFlag('SIGNTAG_ADMIN_PROJECT_ENDPOINT')
  async get(@Param('id') id: string): Promise<Project> {
    // TODO: Check permissions

    const project = await this.projectService.findById(id)
    if (!project) {
      throw new NotFoundException();
    }
    return project;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing project' })
  @ApiParam({ name: 'id', description: 'ID of the project to update', type: String })
  @FeatureFlag('SIGNTAG_ADMIN_PROJECT_ENDPOINT')
  async update(@Param('id', ProjectPipe) project: Project, @Body() update: ProjectUpdateV2) {
    // TODO; Check permissions
    return this.projectService.update(project._id, update);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing project' })
  @FeatureFlag('SIGNTAG_ADMIN_PROJECT_ENDPOINT')
  @ApiParam({ name: 'id', type: String })
  async delete(@Param('id', ProjectPipe) project: Project): Promise<Project> {
    await this.projectService.delete(project);
    return project;
  }
}
