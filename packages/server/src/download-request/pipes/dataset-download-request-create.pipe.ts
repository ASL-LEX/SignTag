import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { DatasetService } from 'src/dataset/dataset.service';
import { CreateDatasetDownloadRequest } from '../dtos/dataset-download-request-create.dto';

@Injectable()
export class CreateDatasetDownloadPipe implements PipeTransform<
  CreateDatasetDownloadRequest,
  Promise<CreateDatasetDownloadRequest>
> {
  constructor(private readonly datasetService: DatasetService) {}

  async transform(value: CreateDatasetDownloadRequest): Promise<CreateDatasetDownloadRequest> {
    const exists = await this.datasetService.existsById(value.dataset);
    if (!exists) {
      throw new BadRequestException(`Dataset with ID ${value.dataset} does not exist`);
    }
    return value;
  }
}
