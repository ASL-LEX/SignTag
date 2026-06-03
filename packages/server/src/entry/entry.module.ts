import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Entry, EntrySchema } from './models/entry.model';
import { EntryResolver } from './resolvers/entry.resolver';
import { EntryService } from './services/entry.service';
import { DatasetModule } from '../dataset/dataset.module';
import { EntryPipe, EntriesPipe } from './pipes/entry.pipe';
import { UploadSession, UploadSessionSchema } from './models/upload-session.model';
import { EntryUpload, EntryUploadSchema } from './models/entry-upload.model';
import { UploadSessionResolver } from './resolvers/upload-session.resolver';
import { UploadSessionService } from './services/upload-session.service';
import { EntryUploadService } from './services/entry-upload.service';
import { UploadSessionPipe } from './pipes/upload-session.pipe';
import { GcpModule } from '../gcp/gcp.module';
import { CsvValidationService } from './services/csv-validation.service';
import { PermissionModule } from '../permission/permission.module';
import { JwtModule } from '../jwt/jwt.module';
import { MongooseMiddlewareService } from '../shared/service/mongoose-callback.service';
import { SharedModule } from '../shared/shared.module';
import { OrganizationModule } from '../organization/organization.module';
import { BucketModule } from 'src/bucket/bucket.module';
import { SignLabRecordingResolver } from './resolvers/signlab-recording.resolver';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Entry.name,
        useFactory: (middlewareService: MongooseMiddlewareService) => {
          const schema = EntrySchema;
          schema.pre('deleteOne', async function () {
            const entry = await this.model.findOne(this.getQuery());
            await middlewareService.apply(Entry.name, 'deleteOne', entry);
          });
          return schema;
        },
        imports: [SharedModule],
        inject: [MongooseMiddlewareService]
      }
    ]),
    MongooseModule.forFeature([
      { name: UploadSession.name, schema: UploadSessionSchema },
      { name: EntryUpload.name, schema: EntryUploadSchema }
    ]),
    DatasetModule,
    GcpModule,
    PermissionModule,
    JwtModule,
    OrganizationModule,
    BucketModule,
    forwardRef(() => TagModule)
  ],
  providers: [
    EntryResolver,
    EntryService,
    EntryPipe,
    EntriesPipe,
    UploadSessionService,
    UploadSessionResolver,
    UploadSessionPipe,
    EntryUploadService,
    CsvValidationService,
    SignLabRecordingResolver
  ],
  exports: [EntryPipe, EntriesPipe, EntryService]
})
export class EntryModule {}
