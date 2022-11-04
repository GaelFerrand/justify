import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JoiPipeModule } from 'nestjs-joi';
import { JustifyController } from './justify.controller';
import { JustifyService } from './justify.service';
import * as request from 'supertest';
import { CacheModule } from '@nestjs/common';
import { APITokenService } from '../apitoken/apitoken.service';
import {
  LONG_TEXT_WITH_LONG_WORD,
  LONG_TEXT_WITH_LONG_WORD_JUSTIFIED,
} from '../utils/string.util.mocks';

describe('JustifyController', () => {
  describe('POST api/justify', () => {
    describe("param 'token' validation", () => {
      let app: INestApplication;
      let moduleRef: TestingModule;
      const apiTokenServiceMock = { getAPITokenByToken: () => undefined };

      beforeEach(async () => {
        moduleRef = await Test.createTestingModule({
          imports: [JoiPipeModule, CacheModule.register()],
          controllers: [JustifyController],
          providers: [JustifyService, APITokenService],
        })
          .overrideProvider(APITokenService)
          .useValue(apiTokenServiceMock)
          .compile();

        app = moduleRef.createNestApplication({ rawBody: true });
        await app.init();
      });

      it('sending a request with no token > should return an error expliciting that param "token" is expected', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .expect(400)
          .send('')
          .expect({
            statusCode: 400,
            message: '"token" is required',
          });
      });

      it('sending a request with a token too short > should return an error expliciting that param "token" is too short', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .expect(400)
          .set({ token: 1 })
          .send('')
          .expect({
            statusCode: 400,
            message: '"token" length must be 36 characters long',
          });
      });

      it('sending a request with a non-uuidv4 token > should return an error expliciting that param "token" does not match regex', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .expect(400)
          .set({ token: 'xxxxxxxx not a valid token xxxxxxxxx' })
          .send('')
          .expect({
            statusCode: 400,
            message:
              '"token" with value "xxxxxxxx not a valid token xxxxxxxxx" fails to match the required pattern: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i',
          });
      });

      it('sending a request with a well-formed but non-existing token > should return a 401 error expliciting that param "token" is invalid', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .expect(401)
          .set({ token: '0bc65b7d-23f1-4c44-bbc6-7a54f9114862' })
          .send('')
          .expect({
            statusCode: 401,
            message: `Invalid token '0bc65b7d-23f1-4c44-bbc6-7a54f9114862'`,
          });
      });
    });

    describe("param 'text' validation", () => {
      let app: INestApplication;
      let moduleRef: TestingModule;
      const API_TOKEN = {
        id: 1,
        email: 'user1@mail.com',
        token: '0bc65b7d-23f1-4c44-bbc6-7a54f9114862',
      };
      const apiTokenServiceMock = { getAPITokenByToken: () => API_TOKEN };

      beforeEach(async () => {
        moduleRef = await Test.createTestingModule({
          imports: [JoiPipeModule, CacheModule.register()],
          controllers: [JustifyController],
          providers: [JustifyService, APITokenService],
        })
          .overrideProvider(APITokenService)
          .useValue(apiTokenServiceMock)
          .compile();

        app = moduleRef.createNestApplication({ rawBody: true });
        await app.init();
      });

      it('sending too long a text > should return an error expliciting that param "text" is too long', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .expect(400)
          .set({ token: API_TOKEN.token })
          .send('a'.repeat(50001))
          .expect({
            statusCode: 400,
            message:
              '"text" length must be less than or equal to 50000 characters long',
          });
      });
    });

    describe('valid parameters', () => {
      let app: INestApplication;
      let moduleRef: TestingModule;
      const API_TOKEN = {
        id: 1,
        email: 'user1@mail.com',
        token: '0bc65b7d-23f1-4c44-bbc6-7a54f9114862',
      };
      const apiTokenServiceMock = { getAPITokenByToken: () => API_TOKEN };
      const justifyServiceMock = {
        justify: () => Promise.resolve(LONG_TEXT_WITH_LONG_WORD_JUSTIFIED),
      };

      beforeEach(async () => {
        moduleRef = await Test.createTestingModule({
          imports: [JoiPipeModule, CacheModule.register()],
          controllers: [JustifyController],
          providers: [JustifyService, APITokenService],
        })
          .overrideProvider(APITokenService)
          .useValue(apiTokenServiceMock)
          .overrideProvider(JustifyService)
          .useValue(justifyServiceMock)
          .compile();

        app = moduleRef.createNestApplication({ rawBody: true });
        await app.init();
      });

      it('sending valid text & token > should call justifyService & return justified text', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .set({ token: API_TOKEN.token })
          .send(LONG_TEXT_WITH_LONG_WORD)
          .expect(201)
          .expect(LONG_TEXT_WITH_LONG_WORD_JUSTIFIED);
      });
    });
  });
});
