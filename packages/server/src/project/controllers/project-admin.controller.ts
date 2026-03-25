import { Controller, Delete, Get, Inject, Post, Put, Response, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Response as Res } from 'express';
import { OrganizationGuard } from "../../organization/organization.guard";
import { OrganizationContext } from "../../organization/organization.context";
import { ProjectService } from "../project.service";
import { JwtAuthGuard } from "../../jwt/jwt.guard";
import { Organization } from "../../organization/organization.model";
import { TokenContext } from "../../jwt/token.context";
import { TokenPayload } from "../../jwt/token.dto";
import { CASBIN_PROVIDER } from "../../permission/casbin.provider";
import * as casbin from 'casbin';
import { ProjectPermissions } from "src/permission/permissions/project";


@Controller('api/admin/projects')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class ProjectAdminController {
  constructor(private readonly projectService: ProjectService, @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer) {}

  @Post()
  async create(): Promise<void> {

  }

  @Get(':id')
  async getOne(): Promise<void> {

  }

  @Get()
  async getMany(@Response() response: Res, @OrganizationContext() organization: Organization, @TokenContext() user: TokenPayload): Promise<any> {
    if (!(await this.enforcer.enforce(user.user_id, ProjectPermissions.READ, organization._id))) {
      throw new UnauthorizedException('User does not have permissions to read all projects');
    }
    const projects = await this.projectService.findAll(organization._id);

    response.setHeader('Content-Range', `projects 0-${projects.length}/${projects.length}`);

    return response.json(projects);
  }

  @Put(':id')
  async update(): Promise<void> {

  }

  @Delete(':id')
  async delete(): Promise<void> {

  }
}
