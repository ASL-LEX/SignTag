import { Args, ID, Resolver, Query, ResolveField, Parent, Mutation, Int } from '@nestjs/graphql';
import { Dataset } from '../../dataset/dataset.model';
import { Entry } from '../models/entry.model';
import { EntryService } from '../services/entry.service';
import { DatasetPipe } from '../../dataset/pipes/dataset.pipe';
import { UseGuards, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt/jwt.guard';
import { DatasetPermissions } from '../../permission/permissions/dataset';
import { CASBIN_PROVIDER } from '../../permission/casbin.provider';
import * as casbin from 'casbin';
import { TokenPayload } from '../../jwt/token.dto';
import { TokenContext } from '../../jwt/token.context';
import { OrganizationContext } from '../../organization/organization.context';
import { Organization } from '../../organization/organization.model';
import { EntryPipe } from '../pipes/entry.pipe';
import { OrganizationGuard } from '../../organization/organization.guard';
import { DatasetService } from '../../dataset/dataset.service';

@UseGuards(JwtAuthGuard, OrganizationGuard)
@Resolver(() => Entry)
export class EntryResolver {
  constructor(
    private readonly entryService: EntryService,
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer,
    private readonly datasetService: DatasetService
  ) {}

  @Query(() => [Entry])
  async entryForDataset(
    @Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset,
    @TokenContext() user: TokenPayload,
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('pageSize', { type: () => Int, nullable: true }) pageSize?: number
  ): Promise<Entry[]> {
    if (!(await this.enforcer.enforce(user.user_id, DatasetPermissions.READ, dataset._id.toString()))) {
      throw new UnauthorizedException('User cannot read entries on this dataset');
    }

    return this.entryService.findForDataset(dataset, page, pageSize);
  }

  @Query(() => Int)
  async countEntryForDataset(
    @Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset,
    @TokenContext() user: TokenPayload
  ): Promise<number> {
    if (!(await this.enforcer.enforce(user.user_id, DatasetPermissions.READ, dataset._id.toString()))) {
      throw new UnauthorizedException('User cannot read entries on this dataset');
    }

    return this.entryService.countForDataset(dataset);
  }

  @Query(() => Entry)
  async entryFromID(
    @Args('entry', { type: () => ID }, EntryPipe) entry: Entry,
    @TokenContext() user: TokenPayload
  ): Promise<Entry> {
    const dataset = await this.datasetService.findById(entry.dataset);
    if (!dataset) {
      throw new Error('Dataset not found for entry');
    }
    if (!(await this.enforcer.enforce(user.user_id, DatasetPermissions.READ, dataset._id.toString()))) {
      throw new UnauthorizedException('User cannot read entries on this dataset');
    }

    return entry;
  }

  @ResolveField(() => String)
  async signedUrl(@Parent() entry: Entry, @TokenContext() user: TokenPayload): Promise<string> {
    return this.entryService.getSignedUrl(entry);
  }

  // NOTE: With the current implementation, this is only really helpful
  //       if the request to `signedUrl` is made.
  @ResolveField(() => Number, { description: 'Get the number of milliseconds the signed URL is valid for.' })
  async signedUrlExpiration(@Parent() entry: Entry, @TokenContext() user: TokenPayload): Promise<number> {
    return this.entryService.getSignedUrlExpiration(entry);
  }

  @Mutation(() => Boolean)
  async deleteEntry(
    @Args('entry', { type: () => ID }, EntryPipe) entry: Entry,
    @TokenContext() user: TokenPayload,
    @OrganizationContext() organization: Organization
  ): Promise<boolean> {
    if (!(await this.enforcer.enforce(user.user_id, DatasetPermissions.DELETE, entry.dataset))) {
      throw new UnauthorizedException('User cannot delete entries on this dataset');
    }
    await this.entryService.delete(entry);
    return true;
  }
}
