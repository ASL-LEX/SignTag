import { BadRequestException, Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Study } from './study.model';
import { StudyCreate } from './dtos/create.dto';
import { StudyUpdateV2 } from './dtos/update.dto';
import { Validator } from 'jsonschema';
import { Project } from '../project/project.model';
import { MongooseMiddlewareService } from '../shared/service/mongoose-callback.service';
import { CASBIN_PROVIDER } from '../permission/casbin.provider';
import * as casbin from 'casbin';
import { PaginationResponse } from '@bu-sail/ra-query-core';
import { RAQuery } from '../shared/ra-query.dto';

@Injectable()
export class StudyService {
  constructor(
    @InjectModel(Study.name) private readonly studyModel: Model<Study>,
    middlewareService: MongooseMiddlewareService,
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer
  ) {
    // Remove corresponding studies when a project is deleted
    middlewareService.register(Project.name, 'deleteOne', async (project: Project) => {
      // TODO: Update Casbin policies
      await this.removeForProject(project);
    });
  }

  async create(study: StudyCreate, organization: string): Promise<Study> {
    const newStudy = await this.studyModel.create({ ...study, organization });

    // Make the study - project relation in the enforcer model
    await this.enforcer.addNamedGroupingPolicy('g2', study.project, newStudy._id.toString());

    return newStudy;
  }

  async findAll(project: Project): Promise<Study[]> {
    return this.studyModel.find({ project: project._id.toString() });
  }

  async get(_query: RAQuery, organizationID: string): Promise<PaginationResponse<Study>> {
    // TODO: Handle conversion of RAQuery into Mongoose query
    const studies = await this.studyModel.find({ organization: organizationID });

    // TODO: Include pagination results from proper query usage
    return {
      data: studies,
      count: studies.length,
      start: 0,
      end: studies.length
    };
  }

  async update(id: string, update: StudyUpdateV2): Promise<Study> {
    await this.studyModel.updateOne({ _id: id }, { $set: update });

    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException();
    }
    return updated;
  }

  async exists(studyName: string, project: string): Promise<boolean> {
    const study = await this.studyModel.findOne({ name: studyName, project });
    return !!study;
  }

  async existsById(id: string): Promise<boolean> {
    const study = await this.studyModel.findOne({ _id: id });
    return !!study;
  }

  async findById(id: string): Promise<Study | null> {
    return this.studyModel.findById(id);
  }

  /** Validate that the tag data matches the study defined schema */
  async validateData(id: string, data: any): Promise<boolean> {
    // Get the study/schema for the data
    const study = await this.findById(id);
    if (!study) {
      throw new Error(`Study with id ${id} does not exist`);
    }
    const schema = study.tagSchema.dataSchema;

    // Validate the schema
    const validator = new Validator();
    return validator.validate(data, schema).valid;
  }

  async changeName(study: Study, newName: string): Promise<Study> {
    // Ensure the study name is unique
    if (await this.exists(newName, study.project)) {
      throw new BadRequestException(`Study with the name ${newName} already exists on the project ${study.project}`);
    }
    await this.studyModel.updateOne({ _id: study._id }, { $set: { name: newName } });
    return (await this.findById(study._id))!;
  }

  async changeDescription(study: Study, newDescription: string): Promise<Study> {
    await this.studyModel.updateOne({ _id: study._id }, { $set: { description: newDescription } });
    return (await this.findById(study._id))!;
  }

  async delete(study: Study): Promise<void> {
    await this.studyModel.deleteOne({ _id: study._id });
  }

  private async removeForProject(project: Project): Promise<void> {
    const studies = await this.findAll(project);
    for (const study of studies) {
      await this.delete(study);
    }
  }
}
