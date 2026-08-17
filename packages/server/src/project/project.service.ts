import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './project.model';
import { ProjectCreate } from './dtos/create.dto';
import { CASBIN_PROVIDER } from '../permission/casbin.provider';
import * as casbin from 'casbin';
import { TokenPayload } from 'src/jwt/token.dto';
import { ProjectPermissions } from 'src/permission/permissions/project';
import { PaginationResponse } from '@bu-sail/ra-query-core';
import { RAQuery } from '../shared/ra-query.dto';
import { ProjectUpdateV2 } from './dtos/update.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer
  ) {}

  async create(project: ProjectCreate, organization: string): Promise<Project> {
    const newProject = await this.projectModel.create({
      ...project,
      organization,
      created: new Date()
    });

    // Make the project - organization relation in the enforcer model
    await this.enforcer.addNamedGroupingPolicy('g2', organization, newProject._id.toString());

    return newProject;
  }

  async get(_query: RAQuery, organizationID: string): Promise<PaginationResponse<Project>> {
    // TODO: Handle conversion of RAQuery into Mongoose query
    const projects = await this.projectModel.find({ organization: organizationID });

    // TODO: Include pagination results from proper query usage
    return {
      data: projects,
      count: projects.length,
      start: 0,
      end: projects.length
    };
  }

  async findById(id: string): Promise<Project | null> {
    return this.projectModel.findById(id);
  }

  async exists(name: string, organization: string): Promise<boolean> {
    const project = await this.projectModel.findOne({ name, organization });
    return !!project;
  }

  async findAll(organization: string): Promise<Project[]> {
    return this.projectModel.find({ organization }).exec();
  }

  async delete(project: Project): Promise<void> {
    await this.projectModel.findByIdAndDelete(project._id);
  }

  async update(id: string, update: ProjectUpdateV2): Promise<Project> {
    await this.projectModel.updateOne({ _id: id }, { $set: update });

    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException();
    }
    return updated;
  }

  async findAllForUser(user: TokenPayload, organization: string): Promise<Project[]> {
    await this.enforcer.loadPolicy();
    const projects = await this.findAll(organization);
    const allowedProjects: Project[] = [];
    for (const project of projects) {
      const hasAccess = await this.enforcer.enforce(user.user_id, ProjectPermissions.READ, project._id.toString());
      if (hasAccess) {
        allowedProjects.push(project);
      }
    }
    return allowedProjects;
  }
}
