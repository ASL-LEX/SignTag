import { Controller, Delete, Get, Post, Put } from "@nestjs/common";

@Controller('api/admin/project')
export class ProjectAdminController {
  constructor() {}

  @Post()
  async create(): Promise<void> {

  }

  @Get(':id')
  async getOne(): Promise<void> {

  }

  @Get()
  async getMany(): Promise<void> {

  }

  @Put(':id')
  async update(): Promise<void> {

  }

  @Delete(':id')
  async delete(): Promise<void> {

  }
}
