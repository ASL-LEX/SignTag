import { Injectable } from '@nestjs/common';
import { TagField, TagFieldUnion, TagFieldType } from '../models/tag-field.model';
import { BooleanField } from '../models/boolean-field.model';
import { FreeTextField } from '../models/free-text-field.model';
import { NumericField } from '../models/numeric-field.model';
import { SliderField } from '../models/slider-field.model';
import { VideoField } from '../models/video-field.model';
import { AslLexField, LexiconEntry } from '../models/asl-lex-field.model';
import { ConfigService } from '@nestjs/config';
import { VideoFieldService } from './video-field.service';

/**
 * Handles turning the rawdata fields into TagFields
 */
@Injectable()
export class TagFieldService {
  constructor(
    private readonly configService: ConfigService,
    private readonly videoFieldService: VideoFieldService
  ) {}

  async produceField(tagField: TagField): Promise<typeof TagFieldUnion | null> {
    if (!tagField.data) {
      return null;
    }
    switch (tagField.type) {
      case TagFieldType.ASL_LEX:
        return this.getAslLexField(tagField);
      case TagFieldType.BOOLEAN:
        return new BooleanField(tagField.data);
      case TagFieldType.FREE_TEXT:
        return new FreeTextField(tagField.data);
      case TagFieldType.NUMERIC:
        return new NumericField(tagField.data);
      case TagFieldType.SLIDER:
        return new SliderField(tagField.data);
      case TagFieldType.VIDEO_RECORD:
        return this.getVideoField(tagField);
      default:
        throw new Error(`Unsupported tag field type: ${tagField.type}`);
    }
  }

  private async getVideoField(tagField: TagField): Promise<VideoField | null> {
    // The GraphQL union is resolved based on the class name, so a concrete object
    // needs to be made from the document result
    const videoFieldRaw = await this.videoFieldService.find(tagField.data);
    if (!videoFieldRaw) {
      return null;
    }
    const videoField = new VideoField((videoFieldRaw as any).toObject());

    return videoField;
  }

  private async getAslLexField(tagField: TagField): Promise<AslLexField> {
    const lexEntry = tagField.data;
    return new AslLexField(new LexiconEntry(lexEntry.key, lexEntry.lexicon));
  }
}
