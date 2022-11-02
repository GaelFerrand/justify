import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { countWords, justify } from '../utils/string.util';
import { today } from '../utils/date.util';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';

const LINE_MAX_LENGTH = 80;
const MAX_JUSTIFIED_WORD_PER_DAY = 80000;
export const KEYS_TTL = 3600 * 24; // 1 day

@Injectable()
export class JustifyService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async justify(text: string, token: string): Promise<string> {
    const wordsNbr = countWords(text);

    const canJustifyXMoreWordsToday = await this.canJustifyXMoreWordsToday(
      token,
      wordsNbr,
    );

    if (!canJustifyXMoreWordsToday) {
      throw new HttpException(
        `This request goes over your daily limit of ${MAX_JUSTIFIED_WORD_PER_DAY} words. You must switch to a paid subscription to use it any further`,
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    const justifiedText = justify(text, LINE_MAX_LENGTH);

    await this.addXJustifiedWordsToday(token, wordsNbr);

    return justifiedText;
  }

  async canJustifyXMoreWordsToday(
    apiToken: string,
    wordsNbr: number,
  ): Promise<boolean> {
    const cacheKey = `${apiToken}-${today()}`;
    const justifiedWordsToday = await this.cacheManager.get<number>(cacheKey);

    if (!justifiedWordsToday) return wordsNbr <= MAX_JUSTIFIED_WORD_PER_DAY;

    return justifiedWordsToday + wordsNbr <= MAX_JUSTIFIED_WORD_PER_DAY;
  }

  async addXJustifiedWordsToday(
    apiToken: string,
    wordsNbr: number,
  ): Promise<void> {
    const cacheKey = `${apiToken}-${today()}`;
    const justifiedWordsToday = await this.cacheManager.get<number>(cacheKey);

    const newJustifiedWordsNbr = (justifiedWordsToday || 0) + wordsNbr;
    return this.cacheManager.set(cacheKey, newJustifiedWordsNbr, KEYS_TTL);
  }
}
