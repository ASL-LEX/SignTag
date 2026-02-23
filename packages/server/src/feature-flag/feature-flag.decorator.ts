import { Reflector } from '@nestjs/core';

export const FeatureFlag = Reflector.createDecorator<string>();
