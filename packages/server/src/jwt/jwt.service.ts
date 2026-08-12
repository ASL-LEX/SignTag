import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';

interface PublicKeys {
  [key: string]: string;
}

@Injectable()
export class JwtService {
  private publicKeys: PublicKeys | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  private async queryForPublicKey(): Promise<PublicKeys> {
    const query = this.configService.getOrThrow('auth.publicKeyUrl');

    const response = await firstValueFrom(this.httpService.get<{ [key: string]: string }>(query));
    return response.data;
  }

  // TODO: Handle when key rotation has taken place
  async getPublicKey(rawToken: string | null | Buffer | object): Promise<string | null> {
    // Make sure the tokn is the correct type
    if (!rawToken) {
      return null;
    }
    if (typeof rawToken === 'object') {
      return null;
    }

    // Decode the token to get the kid
    const token = jwt.decode(rawToken, { complete: true });
    if (!token) {
      return null;
    }

    // Get the kid from the token
    const kid = token.header.kid;
    if (!kid) {
      return null;
    }

    // If we don't have the public keys yet or the kid isn't in the public keys, query for the public keys
    if (!this.publicKeys || !this.publicKeys[kid]) {
      this.publicKeys = await this.queryForPublicKey();
    }

    // Return the public key
    return this.publicKeys[kid] || null;
  }
}
