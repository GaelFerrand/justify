import { Injectable } from '@nestjs/common';
import Database from '../db/database';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenDao {
  async getTokenByEmail(email: string): Promise<any> {
    return Database.get<Token>('SELECT * FROM tokens WHERE email  = ?', [
      email,
    ]);
  }

  async createToken(email: string): Promise<Token> {
    const newToken = { email, token: uuidv4() };

    const id = await Database.insert(
      'INSERT INTO tokens(email, token) VALUES(?, ?)',
      [newToken.email, newToken.token],
    );

    return { ...newToken, id };
  }
}
