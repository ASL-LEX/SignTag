import { NotFoundException, UseGuards } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Tag } from '../../tag/models/tag.model';
import { JwtAuthGuard } from '../../jwt/jwt.guard';
import { SignLabRecorded } from '../models/entry.model';
import { TagService } from '../../tag/services/tag.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => SignLabRecorded)
export class SignLabRecordingResolver {
  constructor(private readonly tagService: TagService) {}

  @ResolveField(() => Tag)
  async tag(@Parent() signlabRecorded: SignLabRecorded): Promise<Tag> {
    const tag = await this.tagService.find(signlabRecorded.tag);
    if (!tag) {
      throw new NotFoundException(`Tag with id ${signlabRecorded.tag} not found`);
    }
    return tag;
  }
}
