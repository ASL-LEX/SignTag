import { Module, forwardRef } from '@nestjs/common';
import { TagService } from './services/tag.service';
import { TagResolver } from './resolvers/tag.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from './models/tag.model';
import { StudyModule } from '../study/study.module';
import { EntryModule } from '../entry/entry.module';
import { TagPipe } from './pipes/tag.pipe';
import { SharedModule } from '../shared/shared.module';
import { PermissionModule } from '../permission/permission.module';
import { VideoFieldIntermediate, VideoFieldIntermediateSchema } from './models/video-field-inter.model';
import { VideoFieldIntermediateService } from './services/video-field-inter.service';
import { VideoFieldIntermediateResolver } from './resolvers/video-field-inter.resolver';
import { GcpModule } from '../gcp/gcp.module';
import { TagTransformer } from './services/tag-transformer.service';
import { FieldTransformerFactory } from './transformers/field-transformer-factory';
import { VideoFieldTransformer } from './transformers/video-field-transformer';
import { DatasetModule } from '../dataset/dataset.module';
import { TrainingSet, TrainingSetSchema } from './models/training-set';
import { TrainingSetResolver } from './resolvers/training-set.resolver';
import { TrainingSetService } from './services/training-set.service';
import { BucketModule } from 'src/bucket/bucket.module';
import { BooleanFieldTransformer } from './transformers/boolean-transformer';
import { FreeTextFieldTransformer } from './transformers/free-text.transformer';
import { NumericFieldTransformer } from './transformers/numeric-transformer';
import { SliderFieldTransformer } from './transformers/slider-transformer';
import { TagFieldResolver } from './resolvers/tag-field.resolver';
import { TagFieldService } from './services/tag-field.service';
import { AslLexFieldTransformer } from './transformers/asl-lex-transformer';
import { VideoField, VideoFieldSchema } from './models/video-field.model';
import { VideoFieldService } from './services/video-field.service';
import { VideoFieldResolver } from './resolvers/video-field.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tag.name, schema: TagSchema },
      { name: VideoFieldIntermediate.name, schema: VideoFieldIntermediateSchema },
      { name: TrainingSet.name, schema: TrainingSetSchema },
      { name: VideoField.name, schema: VideoFieldSchema }
    ]),
    StudyModule,
    forwardRef(() => EntryModule),
    SharedModule,
    PermissionModule,
    GcpModule,
    DatasetModule,
    BucketModule
  ],
  providers: [
    TagService,
    TagResolver,
    TagFieldResolver,
    TagPipe,
    VideoFieldIntermediateService,
    VideoFieldIntermediateResolver,
    TagTransformer,
    FieldTransformerFactory,
    VideoFieldTransformer,
    TrainingSetResolver,
    TrainingSetService,
    BooleanFieldTransformer,
    FreeTextFieldTransformer,
    NumericFieldTransformer,
    SliderFieldTransformer,
    TagFieldService,
    AslLexFieldTransformer,
    VideoFieldService,
    VideoFieldResolver
  ],
  exports: [TagService, VideoFieldService]
})
export class TagModule {}
