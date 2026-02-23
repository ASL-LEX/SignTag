import { Controller, Delete, Post, Put, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('api/admin/project')
@ApiTags('Project (Admin)')
export class AdminProjectController {
  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  async create() {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a single project' })
  async get() {}

  @Get()
  @ApiOperation({ summary: 'Get many projects' })
  async getMany() {}

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing project' })
  async update() {}

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing project' })
  async delete() {}
}
