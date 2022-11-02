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

        app = moduleRef.createNestApplication();
        await app.init();
      });

      it('sending a request with no token > should return an error expliciting that param "token" is expected', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .expect(400)
          .send({ text: '' })
          .expect({
            statusCode: 400,
            message:
              'Request validation of body failed, because: "token" is required',
            error: 'Bad Request',
          });
      });

      it('sending a request with an invalid type for token > should return an error expliciting that param "token" should be a string', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .expect(400)
          .send({ token: 1, text: '' })
          .expect({
            statusCode: 400,
            message:
              'Request validation of body failed, because: "token" must be a string',
            error: 'Bad Request',
          });
      });

      it('sending a request with an invalid-string token > should return an error expliciting that param "token" does not match regex', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .expect(400)
          .send({ token: 'not a valid token', text: '' })
          .expect({
            statusCode: 400,
            message:
              'Request validation of body failed, because: "token" length must be 36 characters long, "token" with value "not a valid token" fails to match the required pattern: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i',
            error: 'Bad Request',
          });
      });

      it('sending a request with a well-formed but non-existing token > should return a 401 error expliciting that param "token" is invalid', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .expect(401)
          .send({ token: '0bc65b7d-23f1-4c44-bbc6-7a54f9114862', text: '' })
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

        app = moduleRef.createNestApplication();
        await app.init();
      });

      it('sending a request with no text > should return an error expliciting that param "text" is expected', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .expect(400)
          .send({ token: API_TOKEN.token })
          .expect({
            statusCode: 400,
            message:
              'Request validation of body failed, because: "text" is required',
            error: 'Bad Request',
          });
      });

      it('sending unexpected type > should return an error expliciting that text must be a string', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .send({ token: API_TOKEN.token, text: 1 })
          .expect(400)
          .expect({
            statusCode: 400,
            message:
              'Request validation of body failed, because: "text" must be a string',
            error: 'Bad Request',
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

        app = moduleRef.createNestApplication();
        await app.init();
      });

      it('sending text > should call justifyService & return justified text', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .send({ token: API_TOKEN.token, text: LONG_TEXT_WITH_LONG_WORD })
          .expect(201)
          .expect(LONG_TEXT_WITH_LONG_WORD_JUSTIFIED);
      });
    });
  });
});
