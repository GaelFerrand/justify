import { Injectable } from '@nestjs/common';
import { APIToken } from './apitoken';
import { APITokenDao } from './apitoken.dao';

@Injectable()
export class APITokenService {
  constructor(private readonly apiTokenDao: APITokenDao) {}

  async getAPITokenByEmail(email: string): Promise<APIToken> {
    const apiToken = await this.apiTokenDao.getAPITokenByEmail(email);
    if (apiToken) return apiToken;

    return this.apiTokenDao.createAPIToken(email);
  }
}
