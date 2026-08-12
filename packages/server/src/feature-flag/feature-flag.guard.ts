import { CanActivate, ExecutionContext, Injectable, NotImplementedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FeatureFlag } from './feature-flag.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const targetFeatureFlagName = this.reflector.get(FeatureFlag, context.getHandler());
    const failureState = new NotImplementedException('This feature is not currently enabled');

    // If no target feature is applied, then assume no feature flag
    // is gating this endpoint
    if (targetFeatureFlagName === undefined) {
      return true;
    }

    // Next try to find a matching environment variable from the config service
    const featureFlagValue = this.configService.get<string>(targetFeatureFlagName);

    // If the value is undefined then we are considering the feature flag as being false
    if (featureFlagValue === undefined) {
      throw failureState;
    }

    // Otherwise we need the flag value to be some capitalization of 'true'
    if (featureFlagValue.toLowerCase() === 'true') {
      return true;
    }
    throw failureState;
  }
}
