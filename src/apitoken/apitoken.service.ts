import { Injectable } from '@nestjs/common';
import { APIToken } from './apitoken';
import { APITokenDao } from './apitoken.dao';

@Injectable()
export class APITokenService {
  constructor(private readonly apiTokenDao: APITokenDao) {}

  async getOrCreateAPITokenByEmail(email: string): Promise<APIToken> {
    const apiToken = await this.apiTokenDao.getAPITokenByEmail(email);
    if (apiToken) return apiToken;

    return this.apiTokenDao.createAPIToken(email);
  }

  async getAPITokenByToken(token: string): Promise<APIToken | undefined> {
    return this.apiTokenDao.getAPITokenByToken(token);
  }
}
