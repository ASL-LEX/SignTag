import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, applicationDefault, cert, initializeApp } from 'firebase-admin/app';

export const FIREBASE_PROVIDER = 'FIREBASE_ADMIN';

export const firebaseProvider: Provider<App> = {
  provide: FIREBASE_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const keyFileName: string | undefined = configService.get<string>('gcp.storage.keyFilename');

    // If no key file is provided, use the default credentials
    if (!keyFileName) {
      return initializeApp({
        credential: applicationDefault()
      });
    }

    // Otherwise, use the provided key file
    return initializeApp({
      credential: cert(keyFileName)
    });
  },
  inject: [ConfigService]
};
