import { Controller, Delete, Post, Put, Get } from '@nestjs/common';

@Controller('api/admin/project')
export class AdminProjectController {
  @Post()
  async create() {}

  @Get(':id')
  async get() {}

  @Get()
  async getAll() {}

  @Put(':id')
  async update() {}

  @Delete(':id')
  async delete() {}
}
