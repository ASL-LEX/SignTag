import { Injectable } from '@nestjs/common';
import { StudyDownloadField, StudyDownloadRequest } from '../models/study-download-request.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudyDownloadRequest } from '../dtos/study-download-request-create.dto';
import { DownloadStatus } from '../models/download-request.model';
import { Organization } from '../../organization/organization.model';
import { DownloadRequestService } from './download-request.service';
import { EntryService } from '../../entry/services/entry.service';
import { BucketFactory } from '../../bucket/bucket-factory.service';
import { ConfigService } from '@nestjs/config';
import { TagService } from '../../tag/services/tag.service';
import { VideoFieldService } from '../../tag/services/video-field.service';
import { BucketObjectAction } from '../../bucket/bucket';
import { Entry } from '../../entry/models/entry.model';
import { Study } from '../../study/study.model';
import { randomUUID } from 'crypto';
import { CsvField } from '../types/csv-field';
import { videoCsvTest, VideoCsvTransformer } from '../pipes/csv/video-field.pipe';
import { basicCsvTest, BasicCsvTransformer } from '../pipes/csv/basic-field.pipe';
import { StudyService } from '../../study/study.service';
import { UserService } from '../../user/user.service';
import { lexiconCsvTest, LexiconCsvTransformer } from '../pipes/csv/lexicon-field.pipe';

@Injectable()
export class StudyDownloadService {
  private readonly expiration = this.configService.getOrThrow<number>('entry.signedURLExpiration');
  private readonly gatewayEndpoint = this.configService.getOrThrow<string>('endpoints.gateway');

  /** The mutation to execute for marking a field as complete */
  private readonly markCompleteMutation = `
    mutation markStudyFieldComplete($downloadRequest: ID!, $studyField: StudyDownloadField!, $code: String!) {
      markStudyFieldComplete(downloadRequest: $downloadRequest, studyField: $studyField, code: $code)
    }
  `;

  constructor(
    @InjectModel(StudyDownloadRequest.name)
    private readonly downloadRequestModel: Model<StudyDownloadRequest>,
    private readonly downloadService: DownloadRequestService,
    private readonly entryService: EntryService,
    private readonly bucketFactory: BucketFactory,
    private readonly configService: ConfigService,
    private readonly tagService: TagService,
    private readonly videoFieldService: VideoFieldService,
    private readonly basicCsvTransformer: BasicCsvTransformer,
    private readonly videoCsvTransformer: VideoCsvTransformer,
    private readonly studyService: StudyService,
    private readonly userService: UserService,
    private readonly lexiconCsvTransformer: LexiconCsvTransformer
  ) {}

  async createDownloadRequest(
    downloadRequest: CreateStudyDownloadRequest,
    organization: Organization,
    textOnly: boolean
  ): Promise<StudyDownloadRequest> {
    if (textOnly) {
      return this.createTextOnlyDownload(downloadRequest, organization);
    } else {
      return this.createFullDownload(downloadRequest, organization);
    }
  }

  /** Full download includes zipping up the target videos */
  async createFullDownload(
    downloadRequest: CreateStudyDownloadRequest,
    organization: Organization
  ): Promise<StudyDownloadRequest> {
    let request = await this.downloadRequestModel.create({
      ...downloadRequest,
      date: new Date(),
      status: DownloadStatus.IN_PROGRESS,
      organization: organization._id,
      entryZipComplete: false,
      taggedEntryZipComplete: false,
      verificationCode: randomUUID()
    });

    const bucketLocation = `${this.downloadService.getPrefix()}/${request._id}`;

    // Create the locations for all the artifacts
    const zipLocation = `${bucketLocation}/entries.zip`;
    const entryJSONLocation = `${bucketLocation}/entries.json`;
    const userCSVLocation = `${bucketLocation}/user.csv`;
    const webhookPayloadLocation = `${bucketLocation}/webhook.json`;
    const tagCSVLocation = `${bucketLocation}/tag.csv`;
    const taggedEntriesZipLocation = `${bucketLocation}/tagged_entries.zip`;
    const taggedEntriesJSONLocation = `${bucketLocation}/tagged_entries.json`;
    const taggedEntryWebhookPayloadLocation = `${bucketLocation}/tagged_entries_webhook.json`;

    await this.downloadRequestModel.updateOne(
      { _id: request._id },
      {
        $set: {
          bucketLocation: bucketLocation,
          entryZIPLocation: zipLocation,
          entryJSONLocation: entryJSONLocation,
          userCSVLocation: userCSVLocation,
          webhookPayloadLocation: webhookPayloadLocation,
          tagCSVLocation: tagCSVLocation,
          taggedEntriesZipLocation: taggedEntriesZipLocation,
          taggedEntriesJSONLocation: taggedEntriesJSONLocation,
          taggedEntryWebhookPayloadLocation: taggedEntryWebhookPayloadLocation
        }
      }
    );
    request = (await this.downloadRequestModel.findById(request._id))!;

    const labeldEntries = await this.getLabeledEntries(request);
    const bucket = (await this.bucketFactory.getBucket(request.organization))!;

    // Download the entries that were generated as part of this study
    await this.downloadService.startZipJob({
      entryJSONLocation: request.entryJSONLocation!,
      entryZIPLocation: request.entryZIPLocation!,
      webhookPayloadLocation: request.webhookPayloadLocation!,
      webhookPayload: JSON.stringify({
        query: this.markCompleteMutation,
        variables: {
          downloadRequest: request._id,
          studyField: StudyDownloadField.ENTRY_ZIP.toString(),
          code: request.verificationCode
        }
      }),
      webhook: this.gatewayEndpoint,
      entries: await this.entryService.getEntriesForStudy(request.study),
      bucket: bucket,
      organization: request.organization
    });
    // Download the tag data as a CSV
    await this.generateCSV(request);
    // Download the user data
    await this.generateUserCSV(request, organization);
    // Download the entries that were tagged in this study
    await this.downloadService.startZipJob({
      entryJSONLocation: request.taggedEntriesJSONLocation!,
      entryZIPLocation: request.taggedEntriesZipLocation!,
      webhookPayloadLocation: request.taggedEntryWebhookPayloadLocation!,
      webhookPayload: JSON.stringify({
        query: this.markCompleteMutation,
        variables: {
          downloadRequest: request._id,
          studyField: StudyDownloadField.TAGGED_ENTRIES_ZIP.toString(),
          code: request.verificationCode
        }
      }),
      webhook: this.gatewayEndpoint,
      entries: labeldEntries,
      bucket: bucket,
      organization: request.organization
    });

    return request;
  }

  /** Text only download only grabs the CSV and the list of videos associated with the study */
  async createTextOnlyDownload(
    downloadRequest: CreateStudyDownloadRequest,
    organization: Organization
  ): Promise<StudyDownloadRequest> {
    let request = await this.downloadRequestModel.create({
      ...downloadRequest,
      date: new Date(),
      status: DownloadStatus.IN_PROGRESS,
      organization: organization._id,
      entryZipComplete: false,
      taggedEntryZipComplete: false,
      verificationCode: randomUUID()
    });

    const bucketLocation = `${this.downloadService.getPrefix()}/${request._id}`;

    // Create the locations for all the artifacts
    const entryJSONLocation = `${bucketLocation}/entries.json`;
    const userCSVLocation = `${bucketLocation}/user.csv`;
    const webhookPayloadLocation = `${bucketLocation}/webhook.json`;
    const tagCSVLocation = `${bucketLocation}/tag.csv`;
    const taggedEntriesJSONLocation = `${bucketLocation}/tagged_entries.json`;
    const taggedEntryWebhookPayloadLocation = `${bucketLocation}/tagged_entries_webhook.json`;

    // We use the "ZIP" field even tho it is storing the JSON of entries
    await this.downloadRequestModel.updateOne(
      { _id: request._id },
      {
        $set: {
          bucketLocation: bucketLocation,
          entryZIPLocation: entryJSONLocation,
          entryJSONLocation: entryJSONLocation,
          userCSVLocation: userCSVLocation,
          webhookPayloadLocation: webhookPayloadLocation,
          tagCSVLocation: tagCSVLocation,
          taggedEntriesZipLocation: taggedEntriesJSONLocation,
          taggedEntriesJSONLocation: taggedEntriesJSONLocation,
          taggedEntryWebhookPayloadLocation: taggedEntryWebhookPayloadLocation
        }
      }
    );
    request = (await this.downloadRequestModel.findById(request._id))!;

    const labeldEntries = await this.getLabeledEntries(request);
    const bucket = (await this.bucketFactory.getBucket(request.organization))!;

    // Save the list of entries that were labeled in the study
    bucket.writeText(
      request.taggedEntriesZipLocation!,
      JSON.stringify({ entries: labeldEntries.map((entry) => entry.bucketLocation) })
    );
    // Save the list of entries recorded in the study
    const createdEntries = await this.entryService.getEntriesForStudy(downloadRequest.study);
    bucket.writeText(
      request.entryZIPLocation!,
      JSON.stringify({ entries: createdEntries.map((entry) => entry.bucketLocation) })
    );
    // Download the tag data as a CSV
    await this.generateCSV(request);
    // Download the user data
    await this.generateUserCSV(request, organization);
    // Mark the request as complete
    await this.downloadRequestModel.updateOne({ _id: request._id }, { $set: { status: DownloadStatus.READY } });

    return request;
  }

  async getStudyDownloads(study: Study): Promise<StudyDownloadRequest[]> {
    return this.downloadRequestModel.find({ study: study._id });
  }

  async find(id: string): Promise<StudyDownloadRequest | null> {
    return this.downloadRequestModel.findById(id);
  }

  /**
   * Handles flagging when a field is complete and then updating the status when all fields are complete
   */
  async markStudyFieldComplete(downloadRequest: StudyDownloadRequest, studyField: StudyDownloadField): Promise<void> {
    // Mark the field as complete
    switch (studyField) {
      case StudyDownloadField.ENTRY_ZIP:
        console.log('here');
        await this.downloadRequestModel.updateOne({ _id: downloadRequest._id }, { $set: { entryZipComplete: true } });
        break;
      case StudyDownloadField.TAGGED_ENTRIES_ZIP:
        await this.downloadRequestModel.updateOne(
          { _id: downloadRequest._id },
          { $set: { taggedEntryZipComplete: true } }
        );
        break;
      default:
        throw new Error(`Unknown field ${studyField}`);
    }

    const request = (await this.downloadRequestModel.findOne({ _id: downloadRequest._id }))!;

    // Check if all components are complete
    if (request.taggedEntryZipComplete && request.entryZipComplete) {
      // Mark as complete
      await this.downloadRequestModel.updateOne({ _id: request._id }, { $set: { status: DownloadStatus.READY } });
    }
  }

  /**
   * Handles generating the CSV for the tag data. This approach is a sub-optimal one.
   *
   * The overall need is to convert the tag information into a flat CSV format where
   * any external information (like videos that are downloaded as a zip) can be associated
   * with the data.
   *
   * For example, video fields need to be linked to the videos that are downloaded,
   * therefore the video fields show up as multiple columns, one for each video recorded.
   *
   * This approach is sub-optimal for a number of reasons
   * 1. The code should be isolated into different handlers that each know how to make
   *    the CSV representation for that field.
   * 2. Expansion of video fields can be time consuming. This may need to be a process
   *    that runs in the background.
   * 3. ASL-LEX fields are not expanded. Currently only the ID of the field will be
   *    stored
   */
  private async generateCSV(downloadRequest: StudyDownloadRequest): Promise<void> {
    const tags = await this.tagService.getCompleteTags(downloadRequest.study);
    const study = await this.studyService.findById(downloadRequest.study);
    if (!study) {
      throw new Error(`Study with id ${downloadRequest.study} not found`);
    }

    // Convert the data into a CSV
    const csvFields = await this.getFieldTransformers(study);
    const headers = csvFields.map((csvField) => csvField.header).join(',');

    let body = '';
    for (const tag of tags) {
      const row: string[] = [];
      for (const csvField of csvFields) {
        row.push(await csvField.convertField(tag));
      }
      body = body + row.join(',') + '\n';
    }

    const dataString = headers + '\n' + body;

    // Store the CSV in the expected location in the bucket
    const bucket = await this.bucketFactory.getBucket(downloadRequest.organization);
    if (!bucket) {
      throw new Error(`No bucket found for organization ${downloadRequest.organization}`);
    }
    await bucket.writeText(downloadRequest.tagCSVLocation!, dataString);
  }

  /**
   * Generate the CSV of the user ID to email mappings
   */
  private async generateUserCSV(downloadRequest: StudyDownloadRequest, organization: Organization): Promise<void> {
    const users = await this.userService.getUsersForTenant(organization.tenantID);

    let body = '';
    for (const user of users) {
      body += `${user.uid},${user.email || ''}\n`;
    }
    const dataString = 'id,email\n' + body;

    // Store the CSV in the expected location in the bucket
    const bucket = await this.bucketFactory.getBucket(downloadRequest.organization);
    if (!bucket) {
      throw new Error(`No bucket found for organization ${downloadRequest.organization}`);
    }
    await bucket.writeText(downloadRequest.userCSVLocation!, dataString);
  }

  async getEntryZipUrl(downloadRequest: StudyDownloadRequest): Promise<string> {
    return this.getSignedURL(downloadRequest, downloadRequest.entryZIPLocation!);
  }

  async getUserCsvUrl(downloadRequest: StudyDownloadRequest): Promise<string | null> {
    if (!downloadRequest.userCSVLocation) {
      return null;
    }
    return this.getSignedURL(downloadRequest, downloadRequest.userCSVLocation!);
  }

  async getTagCSVUrl(downloadRequest: StudyDownloadRequest): Promise<string> {
    return this.getSignedURL(downloadRequest, downloadRequest.tagCSVLocation!);
  }

  async getTaggedEntriesUrl(downloadRequest: StudyDownloadRequest): Promise<string> {
    return this.getSignedURL(downloadRequest, downloadRequest.taggedEntriesZipLocation!);
  }

  private async getSignedURL(downloadRequest: StudyDownloadRequest, location: string): Promise<string> {
    const bucket = await this.bucketFactory.getBucket(downloadRequest.organization);
    if (!bucket) {
      throw new Error(`Bucket not found for organization ${downloadRequest.organization}`);
    }
    return bucket.getSignedUrl(location, BucketObjectAction.READ, new Date(Date.now() + this.expiration));
  }

  /**
   * Get the entries taged as part of the study
   */
  private async getLabeledEntries(downloadRequest: StudyDownloadRequest): Promise<Entry[]> {
    // Get the complete tags
    const tags = await this.tagService.getCompleteTags(downloadRequest.study);

    // Get the entries, make sure they are unique
    let entryIDs: string[] = tags.map((tag) => tag.entry);
    entryIDs = Array.from(new Set(entryIDs));

    // Get all the entries
    return Promise.all(
      entryIDs.map(async (id) => {
        const entry = await this.entryService.find(id);
        if (!entry) {
          throw new Error(`Invalid id for entry: ${id}`);
        }
        return entry;
      })
    );
  }

  /** Get the list of CSV tranformers that can convert the tag data */
  private async getFieldTransformers(study: Study): Promise<CsvField[]> {
    const csvFields: CsvField[] = [
      {
        header: 'prompt',
        convertField: async (tag) => {
          const entry = await this.entryService.find(tag.entry);
          if (!entry) {
            throw new Error(`Entry with id ${tag.entry} not found`);
          }
          return entry.bucketLocation.split('/').pop() || '';
        }
      },
      {
        header: 'entryID',
        convertField: async (tag) => {
          const entry = await this.entryService.find(tag.entry);
          if (!entry) {
            throw new Error(`Entry with id ${tag.entry} not found`);
          }
          return entry.entryID;
        }
      },
      {
        header: 'user',
        convertField: async (tag) => {
          return tag.user || '';
        }
      }
    ];

    // Go through all the properties in the data schema
    const propertyNames = Object.getOwnPropertyNames(study.tagSchema.dataSchema.properties);

    for (const propertyName of propertyNames) {
      // Get the data schema and the ui schema
      const dataSchema = study.tagSchema.dataSchema.properties![propertyName];
      const uiSchema = study.tagSchema.uiSchema.elements.find(
        (element: any) => element.scope === `#/properties/${propertyName}`
      );

      if (!dataSchema || !uiSchema) {
        throw new Error(`Could not find schema for property ${propertyName}`);
      }

      // Now determine the proper way to represent the given field
      if (videoCsvTest(uiSchema, dataSchema)) {
        const minVideos = uiSchema.options!.minimumRequired!;

        let maxVideos = uiSchema.options!.maximumOptional;
        if (!maxVideos) {
          maxVideos = minVideos;
        }

        for (let i = 0; i < maxVideos; i++) {
          csvFields.push({
            header: `${propertyName}-video-${i + 1}`,
            convertField: async (tag) => {
              // Get the corresponding tag field
              const tagField = tag.data?.find((field) => field.name == propertyName);
              if (!tagField) {
                throw new Error(`Tag field ${propertyName} not found`);
              }

              // Get the video field
              const videoField = await this.videoFieldService.find(tagField.data);
              if (!videoField) {
                throw new Error(`Could not find video field ${tagField.data}`);
              }

              // Transform the video field at the given index into a CSV friendly format
              return this.videoCsvTransformer.transform(videoField.entries[i]);
            }
          });
        }
      } else if (lexiconCsvTest(uiSchema, dataSchema)) {
        csvFields.push({
          header: propertyName,
          convertField: async (tag) => {
            const tagField = tag.data?.find((field) => field.name == propertyName);
            if (!tagField) {
              throw new Error(`Tag field ${propertyName} not found`);
            }

            return await this.lexiconCsvTransformer.transform(tagField.data);
          }
        });
      } else if (basicCsvTest(uiSchema, dataSchema)) {
        csvFields.push({
          header: propertyName,
          convertField: async (tag) => {
            const tagField = tag.data?.find((field) => field.name == propertyName);
            if (!tagField) {
              throw new Error(`Tag field ${propertyName} not found`);
            }

            return await this.basicCsvTransformer.transform(tagField.data);
          }
        });
      } else {
        throw new Error(`Cannot convert property ${propertyName} into a CSV format`);
      }
    }

    return csvFields;
  }
}
