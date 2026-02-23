import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { StudyService } from '../../study/study.service';
import { CreateStudyDownloadRequest } from '../dtos/study-download-request-create.dto';

@Injectable()
export class CreateStudyDownloadPipe implements PipeTransform<
  CreateStudyDownloadRequest,
  Promise<CreateStudyDownloadRequest>
> {
  constructor(private readonly studyService: StudyService) {}

  async transform(value: CreateStudyDownloadRequest): Promise<CreateStudyDownloadRequest> {
    const exists = await this.studyService.existsById(value.study);
    if (!exists) {
      throw new BadRequestException(`Study with id ${value.study} does not exist`);
    }
    return value;
  }
}
