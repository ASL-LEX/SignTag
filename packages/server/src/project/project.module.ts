import { Module, forwardRef } from '@nestjs/common';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './project.model';
import { ProjectPipe } from './pipes/project.pipe';
import { MongooseMiddlewareService } from 'src/shared/service/mongoose-callback.service';
import { SharedModule } from 'src/shared/shared.module';
import { JwtModule } from '../jwt/jwt.module';
import { PermissionModule } from '../permission/permission.module';
import { OrganizationModule } from '../organization/organization.module';
import { ProjectAdminController } from './controllers/project-admin.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Project.name,
        useFactory: (middlewareService: MongooseMiddlewareService) => {
          const schema = ProjectSchema;

          schema.pre('deleteOne', async function () {
            const project = await this.model.findOne(this.getQuery());
            await middlewareService.apply(Project.name, 'deleteOne', project);
          });

          return schema;
        },
        imports: [SharedModule],
        inject: [MongooseMiddlewareService]
      }
    ]),
    JwtModule,
    forwardRef(() => PermissionModule),
    OrganizationModule
  ],
  providers: [ProjectResolver, ProjectService, ProjectPipe],
  exports: [ProjectPipe, ProjectService],
  controllers: [ProjectAdminController]
})
export class ProjectModule {}
