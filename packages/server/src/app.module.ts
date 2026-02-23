import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriverConfig, ApolloFederationDriver } from '@nestjs/apollo';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationModule } from './organization/organization.module';
import { DatasetModule } from './dataset/dataset.module';
import { ProjectModule } from './project/project.module';
import { StudyModule } from './study/study.module';
import { EntryModule } from './entry/entry.module';
import { TagModule } from './tag/tag.module';
import { SharedModule } from './shared/shared.module';
import { JwtModule } from './jwt/jwt.module';
import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';
import { BucketModule } from './bucket/bucket.module';
import { DownloadRequestModule } from './download-request/download-request.module';
import { HealthModule } from './health/health.module';
import { APP_GUARD } from '@nestjs/core';
import { FeatureFlagGuard } from './feature-flag/feature-flag.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      ignoreEnvVars: false
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      autoSchemaFile: {
        federation: 2
      },
      driver: ApolloFederationDriver
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('mongo.uri')
      })
    }),
    OrganizationModule,
    DatasetModule,
    ProjectModule,
    StudyModule,
    EntryModule,
    TagModule,
    SharedModule,
    JwtModule,
    PermissionModule,
    UserModule,
    BucketModule,
    DownloadRequestModule,
    HealthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: FeatureFlagGuard
    }
  ]
})
export class AppModule {}
