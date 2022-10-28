import { Injectable } from '@nestjs/common';
import { TokenDao } from './token.dao';

@Injectable()
export class TokenService {
  constructor(private readonly tokenDao: TokenDao) {}

  async getTokenByEmail(email: string): Promise<Token> {
    const token = await this.tokenDao.getTokenByEmail(email);
    if (token) return token;

    return this.tokenDao.createToken(email);
  }
}
