import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ProjectPipe } from 'src/project/pipes/project.pipe';
import { StudyCreate } from '../dtos/create.dto';
import { StudyService } from '../study.service';

@Injectable()
export class StudyCreatePipe implements PipeTransform<StudyCreate, Promise<StudyCreate>> {
  constructor(
    private readonly studyService: StudyService,
    private readonly projectPipe: ProjectPipe
  ) {}

  async transform(value: StudyCreate): Promise<StudyCreate> {
    // Validate that the project exists
    await this.projectPipe.transform(value.project);

    // Validate that the study name is unique
    if (await this.studyService.exists(value.name, value.project)) {
      throw new BadRequestException(`Study with the name ${value.name} already exists on project ${value.project}`);
    }

    return value;
  }
}
