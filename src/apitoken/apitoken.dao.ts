import { Injectable } from '@nestjs/common';
import Database from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import { APIToken } from './apitoken';

@Injectable()
export class APITokenDao {
  async getAPITokenByEmail(email: string): Promise<any> {
    return Database.get<APIToken>('SELECT * FROM apitokens WHERE email  = ?', [
      email,
    ]);
  }

  async createAPIToken(email: string): Promise<APIToken> {
    const newAPIToken = { email, token: uuidv4() };

    const id = await Database.insert(
      'INSERT INTO apitokens(email, token) VALUES(?, ?)',
      [newAPIToken.email, newAPIToken.token],
    );

    return { ...newAPIToken, id };
  }
}
