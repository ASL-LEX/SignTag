import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag } from '../models/tag.model';
import { Model, PipelineStage } from 'mongoose';
import { Study } from '../../study/study.model';
import { Entry } from '../../entry/models/entry.model';
import { StudyService } from '../../study/study.service';
import { MongooseMiddlewareService } from '../../shared/service/mongoose-callback.service';
import { TagTransformer } from './tag-transformer.service';
import { TokenPayload } from '../../jwt/token.dto';
import { TrainingSetService } from './training-set.service';
import { TrainingSet } from '../models/training-set';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: Model<Tag>,
    private readonly studyService: StudyService,
    middlewareService: MongooseMiddlewareService,
    private readonly tagTransformService: TagTransformer,
    private readonly trainingSetService: TrainingSetService
  ) {
    // Subscribe to study delete events
    middlewareService.register(Study.name, 'deleteOne', async (study: Study) => {
      await this.removeByStudy(study);
    });

    // Remove corresponding tags when an entry is deleted
    middlewareService.register(Entry.name, 'deleteOne', async (entry: Entry) => {
      await this.removeByEntry(entry);
    });
  }

  async find(id: string): Promise<Tag | null> {
    return this.tagModel.findOne({ _id: id });
  }

  /**
   * Create the tags for the study entry combination. This will create a tag
   * for each entry plus the number of tags per entry are expected.
   *
   * For example, if there are 5 entries with 2 tags per entry, 10 tags will
   * be created.
   */
  async createTags(study: Study, entries: Entry[]): Promise<Tag[]> {
    // TODO: In the future we want to support more sophisticated methods
    // for handling order of tags, for now run a basic shuffling
    for (let index = entries.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      const temp = entries[index];
      entries[index] = entries[randomIndex];
      entries[randomIndex] = temp;
    }

    const tags: Tag[] = [];
    for (const entry of entries) {
      for (let order = 0; order < study.tagsPerEntry; order++) {
        const newTag = await this.tagModel.create({
          entry: entry._id,
          study: study._id,
          complete: false,
          order,
          enabled: true,
          training: false
        });
        tags.push(newTag);
      }
    }
    return tags;
  }

  async assignTag(study: Study, user: string, isTrained: boolean): Promise<Tag | null> {
    return isTrained ? this.assignTagFull(study, user) : this.assignTrainingTag(study, user);
  }

  async getTrainingTags(study: Study, user: string, page?: number, pageSize?: number): Promise<Tag[]> {
    const query = this.tagModel.find({
      user,
      study: study._id,
      training: true
    });

    // Pagination support
    if (page !== undefined && pageSize != undefined) {
      const offset = page * pageSize;
      return await query.skip(offset).limit(pageSize);
    }

    return await query;
  }

  async countTrainingTagForStudy(study: Study, user: string): Promise<number> {
    return this.tagModel.countDocuments({ study: study._id, user: user, training: true });
  }

  /**
   * Assign the user a tag as part of the training set.
   */
  private async assignTrainingTag(study: Study, user: string): Promise<Tag | null> {
    // First get the training set associated with the study
    const trainingSet = await this.trainingSetService.findByStudy(study);

    // If the training set is null or the length of entries is 0, then no tag to assign
    if (!trainingSet || trainingSet.entries.length == 0) {
      return null;
    }

    // See if the user has any training tags. If we have reached this point in the code,
    // and no training tags exist, then they haven't been generated for this user yet.
    const existingTrainingTag = await this.tagModel.findOne({
      user,
      study: study._id,
      training: true
    });

    // If there is no existing training tag, generate the training set for the user
    if (!existingTrainingTag) {
      await this.createTrainingTags(study, user, trainingSet);
    }

    // At this point, the next incomplete training tag can be returned
    const tags = await this.tagModel
      .find({
        study: study._id,
        user,
        training: true,
        complete: false
      })
      .sort({ order: 1 })
      .limit(1);

    return tags[0];
  }

  private async createTrainingTags(study: Study, user: string, trainingSet: TrainingSet): Promise<Tag[]> {
    return await Promise.all(
      trainingSet.entries.map(async (entry, index) => {
        return this.tagModel.create({
          entry,
          study: study._id,
          complete: false,
          order: index,
          enabled: true,
          training: true,
          user
        });
      })
    );
  }

  /**
   * Assign tags based on the full (not training) data set.
   *
   * Assign the tag to the given user. If the user already has an incomplete
   * tag, return that tag to the user. If there are no more remaining tags,
   * null is returned.
   */
  private async assignTagFull(study: Study, user: string): Promise<Tag | null> {
    // Check for incomplete tags
    const incomplete = await this.getIncomplete(study, user);
    if (incomplete) {
      return incomplete;
    }

    // Handles additional pipeline logic which may need to take place when finding
    // the next tag
    let additionalOperations: PipelineStage[] = [];

    // For the case where the user is not allowed to tag entries which they
    // recorded, the entry needs to be expanded and filtered on
    if (study.studyConfig?.disableSameUserEntryTagging) {
      additionalOperations = [
        // Look up the entry from the entry ID stored on the tag object
        {
          $lookup: {
            from: 'entries',
            let: { entryID: { $toObjectId: '$entry' } },
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$entryID'] } } }],
            as: 'entryFull'
          }
        },
        // Now match where the user is not identified as the user who recorded the entry
        { $match: { 'entryFull.signlabRecording.user': { $ne: user } } }
      ];
    }

    // Handles sorting by entry ID
    let entryIDOperations: PipelineStage[] = [];
    if (study.studyConfig?.sortByEntryID) {
      entryIDOperations = [
        // Get ObjectID for enty
        { $addFields: { entryID: { $toObjectId: '$tag.entry' } } },
        // Expand entry
        {
          $lookup: {
            from: 'entries',
            localField: 'entryID',
            foreignField: '_id',
            as: 'entry'
          }
        },
        // Should only have a single match in the lookup array
        { $unwind: '$entry' },
        // Now sort by the user provied entry ID
        { $sort: { 'entry.entryID': 1 } }
      ];
    }

    // Atomically search for an incomplete tag and assign it the current
    // user
    await this.tagModel.db.transaction(async (): Promise<void> => {
      const searchResult = await this.tagModel.aggregate([
        // Only search on tags that are enabled for the current study
        { $match: { enabled: true, study: study._id.toString(), training: false } },
        // Grab tags that are unassigned (user field doesn't exist) or have been completed by the user
        { $match: { $or: [{ user: { $exists: false } }, { user: { $eq: user } }] } },
        // Add in any additional operations that may need to take place
        ...additionalOperations,
        // Group by the entrys and expand tags
        { $group: { _id: { entry: '$entry' }, tag: { $push: '$$ROOT' } } },
        // Now filter where user does not show up in the list of tags
        { $match: { 'tag.user': { $ne: user } } },
        // Unwind the tags
        { $unwind: '$tag' },
        // Sort by order
        { $sort: { 'tag.order': 1 } },
        ...entryIDOperations,
        // Limit to a single tag
        { $limit: 1 }
      ]);

      // No result found
      if (searchResult.length == 0) {
        return;
      }

      // Otherwise mark the tag as assigned
      await this.tagModel.findOneAndUpdate({ _id: searchResult[0].tag._id }, { $set: { user } });
    });

    // At this point, if a tag was found, it will be assigned to the user
    return this.getIncomplete(study, user);
  }

  /** Store the data and mark the tag as complete */
  async complete(tag: Tag, data: any, study: Study, user: TokenPayload): Promise<void> {
    // If the tag is already complete, it cannot be saved again
    if (tag.complete) {
      throw new BadRequestException(`Cannot re-save tag data`);
    }

    // Validate that the tag actually matches the study schema
    const valid = await this.studyService.validateData(tag.study, data);
    if (!valid) {
      throw new BadRequestException(`Tag data does not match study schema`);
    }

    // Handle any transformations
    const transformed = await this.tagTransformService.transformTagData(tag, data, study, user);

    // Save the tag information and mark the tag as complete
    await this.tagModel.findOneAndUpdate({ _id: tag._id }, { $set: { data: transformed, complete: true } });
  }

  async removeTag(tag: Tag): Promise<void> {
    if (!tag) {
      throw new BadRequestException(`Tag with ID ${tag} not found.`);
    }
    // Reset the data and mark the tag as incomplete
    if (!tag.training) {
      await this.tagModel.findOneAndUpdate(
        { _id: tag._id },
        { $set: { complete: false }, $unset: { data: '', user: '' } }
      );
    } else {
      await this.tagModel.findOneAndUpdate({ _id: tag._id }, { $set: { complete: false }, $unset: { data: '' } });
    }
  }

  async isEntryEnabled(study: Study, entry: Entry) {
    const existingTag = await this.tagModel.findOne({ entry: entry._id, study: study._id });
    return existingTag ? existingTag.enabled : false;
  }

  async setEnabled(study: Study, entry: Entry, enabled: boolean): Promise<boolean> {
    const existingTag = await this.tagModel.findOne({ entry: entry._id, study: study._id });
    if (existingTag) {
      await this.tagModel.updateMany({ entry: entry._id, study: study._id }, { $set: { enabled: enabled } });
    } else {
      for (let order = 0; order < study.tagsPerEntry; order++) {
        await this.tagModel.create({
          entry: entry._id,
          study: study._id,
          complete: false,
          order,
          enabled: enabled,
          training: false
        });
      }
    }
    return true;
  }

  async getTags(study: Study | string, page?: number, pageSize?: number): Promise<Tag[]> {
    let studyID = '';
    if (typeof study === 'string') {
      studyID = study;
    } else {
      studyID = study._id;
    }
    const query = this.tagModel.find({ study: studyID, training: false });

    // Pagination support
    if (page !== undefined && pageSize != undefined) {
      const offset = page * pageSize;
      return await query.skip(offset).limit(pageSize);
    }

    return await query;
  }

  async countForStudy(study: Study | string): Promise<number> {
    let studyID = '';
    if (typeof study === 'string') {
      studyID = study;
    } else {
      studyID = study._id;
    }

    return this.tagModel.countDocuments({ study: studyID, training: false });
  }

  async getCompleteTags(study: Study | string): Promise<Tag[]> {
    let studyID = '';
    if (typeof study === 'string') {
      studyID = study;
    } else {
      studyID = study._id;
    }
    return this.tagModel.find({ study: studyID, training: false, complete: true });
  }

  private async getIncomplete(study: Study, user: string): Promise<Tag | null> {
    const incomplete = await this.tagModel.findOne({ study: study._id, user, complete: false });

    // If no incomplete tag, return null
    if (!incomplete) {
      return incomplete;
    }

    // Make sure the tag is still enabled, otherwise remove the user association and return null
    if (!incomplete.enabled) {
      await this.tagModel.updateOne({ _id: incomplete._id }, { $unset: { user: '' } });
      return null;
    }

    // Otherwise, there is a tag that the user should complete
    return incomplete;
  }

  private async removeByStudy(study: Study): Promise<void> {
    await this.tagModel.deleteMany({ study: study._id });
  }

  private async removeByEntry(entry: Entry): Promise<void> {
    await this.tagModel.deleteMany({ entry: entry._id });
  }
}
