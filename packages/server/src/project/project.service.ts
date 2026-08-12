import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.model';
import { ProjectCreate } from './dtos/create.dto';
import { CASBIN_PROVIDER } from '../permission/casbin.provider';
import * as casbin from 'casbin';
import { TokenPayload } from 'src/jwt/token.dto';
import { ProjectPermissions } from 'src/permission/permissions/project';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
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
