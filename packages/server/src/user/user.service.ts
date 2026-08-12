import { Inject, Injectable } from '@nestjs/common';
import { FIREBASE_PROVIDER } from '../gcp/providers/firebase.provider';
import { App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@Inject(FIREBASE_PROVIDER) private readonly firebase: App) {}

  async getUsersForTenant(tenantId: string): Promise<User[]> {
    const tenantAuth = getAuth(this.firebase).tenantManager().authForTenant(tenantId);

    const users = await tenantAuth.listUsers();
    return users.users;
  }

  async getUserById(tenantId: string, userId: string): Promise<User> {
    const tenantAuth = getAuth(this.firebase).tenantManager().authForTenant(tenantId);

    return tenantAuth.getUser(userId);
  }
}
