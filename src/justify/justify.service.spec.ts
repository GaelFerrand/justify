import { JustifyService, KEYS_TTL } from './justify.service';
import { Test } from '@nestjs/testing';
import { APITokenService } from '../apitoken/apitoken.service';
import { CacheModule } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

jest.mock('../utils/string.util', () => {
  const original = jest.requireActual('../utils/string.util');
  return {
    ...original,
    justify: jest.fn().mockReturnValue('justified text'),
  };
});

jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

describe('JustifyService', () => {
  let justifyService: JustifyService;
  let cache: Cache;

  const apiTokenServiceMock = { getAPITokenByToken: () => '' };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [JustifyService, APITokenService],
    })
      .overrideProvider(APITokenService)
      .useValue(apiTokenServiceMock)
      .compile();

    justifyService = moduleRef.get<JustifyService>(JustifyService);
    cache = moduleRef.get(CACHE_MANAGER);
  });

  describe('canJustifyXMoreWordsToday', () => {
    it('key does not exist > should return true', async () => {
      // Given
      jest
        .spyOn(cache, 'get')
        .mockImplementation((cacheKey: string): Promise<unknown> => {
          if (cacheKey === 'API-TOKEN-2020-01-01')
            return Promise.resolve(undefined);
          else return Promise.resolve(100000);
        });

      // When
      const output = await justifyService.canJustifyXMoreWordsToday(
        'API-TOKEN',
        100,
      );

      // Then
      expect(output).toBe(true);
    });

    it('key does not exist but words number is too great > should return false', async () => {
      // Given
      jest
        .spyOn(cache, 'get')
        .mockImplementation((cacheKey: string): Promise<unknown> => {
          if (cacheKey === 'API-TOKEN-2020-01-01')
            return Promise.resolve(undefined);
          else return Promise.resolve(100000);
        });

      // When
      const output = await justifyService.canJustifyXMoreWordsToday(
        'API-TOKEN',
        100000,
      );

      // Then
      expect(output).toBe(false);
    });

    it('key has value 0 and words nbr is low > should return true', async () => {
      // Given
      jest
        .spyOn(cache, 'get')
        .mockImplementation((cacheKey: string): Promise<unknown> => {
          if (cacheKey === 'API-TOKEN-2020-01-01') return Promise.resolve(0);
          else return Promise.resolve(100000);
        });

      // When
      const output = await justifyService.canJustifyXMoreWordsToday(
        'API-TOKEN',
        80000,
      );

      // Then
      expect(output).toBe(true);
    });

    it('key has value 0 and words nbr is greater than limit > should return false', async () => {
      // Given
      jest
        .spyOn(cache, 'get')
        .mockImplementation((cacheKey: string): Promise<unknown> => {
          if (cacheKey === 'API-TOKEN-2020-01-01') return Promise.resolve(0);
          else return Promise.resolve(100000);
        });

      // When
      const output = await justifyService.canJustifyXMoreWordsToday(
        'API-TOKEN',
        80001,
      );

      // Then
      expect(output).toBe(false);
    });

    it('key has value >0 and words nbr is low > should return true', async () => {
      // Given
      jest
        .spyOn(cache, 'get')
        .mockImplementation((cacheKey: string): Promise<unknown> => {
          if (cacheKey === 'API-TOKEN-2020-01-01')
            return Promise.resolve(40000);
          else return Promise.resolve(100000);
        });

      // When
      const output = await justifyService.canJustifyXMoreWordsToday(
        'API-TOKEN',
        40000,
      );

      // Then
      expect(output).toBe(true);
    });

    it('key has value >0 and words nbr is great > should return false', async () => {
      // Given
      jest
        .spyOn(cache, 'get')
        .mockImplementation((cacheKey: string): Promise<unknown> => {
          if (cacheKey === 'API-TOKEN-2020-01-01')
            return Promise.resolve(40000);
          else return Promise.resolve(0);
        });

      // When
      const output = await justifyService.canJustifyXMoreWordsToday(
        'API-TOKEN',
        40001,
      );

      // Then
      expect(output).toBe(false);
    });

    it('key has value >limit and words nbr is 1 > should return false', async () => {
      // Given
      jest
        .spyOn(cache, 'get')
        .mockImplementation((cacheKey: string): Promise<unknown> => {
          if (cacheKey === 'API-TOKEN-2020-01-01')
            return Promise.resolve(80000);
          else return Promise.resolve(0);
        });

      // When
      const output = await justifyService.canJustifyXMoreWordsToday(
        'API-TOKEN',
        1,
      );

      // Then
      expect(output).toBe(false);
    });

    it('key exists but for another day, words nbr is low > should return true', async () => {
      // Given
      jest
        .spyOn(cache, 'get')
        .mockImplementation((cacheKey: string): Promise<unknown> => {
          if (cacheKey === 'API-TOKEN-2019-12-30')
            return Promise.resolve(80000);
          else return Promise.resolve(undefined);
        });

      // When
      const output = await justifyService.canJustifyXMoreWordsToday(
        'API-TOKEN',
        1,
      );

      // Then
      expect(output).toBe(true);
    });
  });

  describe('addXJustifiedWordsToday', () => {
    it('keys does not exist > should create a new one with word nbr', async () => {
      // Given
      jest
        .spyOn(cache, 'get')
        .mockImplementation((cacheKey: string): Promise<unknown> => {
          if (cacheKey === 'API-TOKEN-2020-01-01')
            return Promise.resolve(undefined);
          else return Promise.resolve(40000);
        });
      const cacheSetMock = jest.fn();
      jest.spyOn(cache, 'set').mockImplementation(cacheSetMock);

      // When
      await justifyService.addXJustifiedWordsToday('API-TOKEN', 10);

      // Then
      expect(cacheSetMock).toBeCalledWith('API-TOKEN-2020-01-01', 10, KEYS_TTL);
    });

    it('keys exists > should increment it with word nbr', async () => {
      // Given
      jest
        .spyOn(cache, 'get')
        .mockImplementation((cacheKey: string): Promise<unknown> => {
          if (cacheKey === 'API-TOKEN-2020-01-01') return Promise.resolve(500);
          else return Promise.resolve(40000);
        });
      const cacheSetMock = jest.fn();
      jest.spyOn(cache, 'set').mockImplementation(cacheSetMock);

      // When
      await justifyService.addXJustifiedWordsToday('API-TOKEN', 10);

      // Then
      expect(cacheSetMock).toBeCalledWith(
        'API-TOKEN-2020-01-01',
        510,
        KEYS_TTL,
      );
    });
  });

  describe('justify', () => {
    it('token does not allow any more justifying > should throw', async () => {
      // Given
      jest
        .spyOn(justifyService, 'canJustifyXMoreWordsToday')
        .mockResolvedValueOnce(false);

      // When
      try {
        await justifyService.justify('text', 'API-TOKEN');

        fail();
      } catch (e) {
        // Then
        expect(e.status).toBe(402);
        expect(e.response).toBe(
          'This request goes over your daily limit of 80000 words. You must switch to a paid subscription to use it any further',
        );
      }
    });

    it('token allows justifying > should returned justified text & increase cached word count', async () => {
      // Given
      jest
        .spyOn(justifyService, 'canJustifyXMoreWordsToday')
        .mockResolvedValueOnce(true);

      const addXJustifiedWordsTodayMock = jest.fn();
      jest
        .spyOn(justifyService, 'addXJustifiedWordsToday')
        .mockImplementation(addXJustifiedWordsTodayMock);

      // When
      const output = await justifyService.justify('text', 'API-TOKEN');

      // Then
      // expect(justifyMock).toBeCalledWith('text', 80);
      expect(addXJustifiedWordsTodayMock).toBeCalledWith('API-TOKEN', 1);
      expect(output).toBe('justified text');
    });
  });
});
