import { Controller, Delete, Post, Put, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FeatureFlag } from '../../feature-flag/feature-flag.decorator';

@Controller('api/admin/project')
@ApiTags('Project (Admin)')
export class AdminProjectController {
  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @FeatureFlag('SIGNTAG_ADMIN_PROJECT_ENDPOINT')
  async create() {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a single project' })
  @FeatureFlag('SIGNTAG_ADMIN_PROJECT_ENDPOINT')
  async get() {}

  @Get()
  @ApiOperation({ summary: 'Get many projects' })
  @FeatureFlag('SIGNTAG_ADMIN_PROJECT_ENDPOINT')
  async getMany() {}

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing project' })
  @FeatureFlag('SIGNTAG_ADMIN_PROJECT_ENDPOINT')
  async update() {}

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing project' })
  @FeatureFlag('SIGNTAG_ADMIN_PROJECT_ENDPOINT')
  async delete() {}
}
