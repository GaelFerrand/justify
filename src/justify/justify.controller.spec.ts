import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JoiPipeModule } from 'nestjs-joi';
import { JustifyController } from './justify.controller';
import { JustifyService } from './justify.service';
import * as request from 'supertest';
import {
  TEXT_WITH_81_CHARACTERS,
  TEXT_WITH_81_CHARACTERS_JUSTIFIED,
} from './justify.mocks';
import { APITokenService } from '../apitoken/apitoken.service';

describe('JustifyController', () => {
  describe('POST api/justify', () => {
    describe('token validation', () => {
      let app: INestApplication;
      let moduleRef: TestingModule;
      const apiTokenServiceMock = { getAPITokenByToken: () => undefined };

      beforeEach(async () => {
        moduleRef = await Test.createTestingModule({
          imports: [JoiPipeModule],
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

      it('sending a request with a non-existing token > should return a 401 error expliciting that param "token" is invalid', () => {
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

    describe('text validation & justify', () => {
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
          imports: [JoiPipeModule],
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

      it('sending an empty string > should return empty string', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .send({ token: API_TOKEN.token, text: '' })
          .expect(201);
      });

      it('sending a sentence longer than 80 characters > should return the justified sentence', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .send({ token: API_TOKEN.token, text: TEXT_WITH_81_CHARACTERS })
          .expect(201)
          .expect(TEXT_WITH_81_CHARACTERS_JUSTIFIED);
      });

      it('sending a text with more than 50000 characters > should return an error expliciting the size issue', () => {
        return request(app.getHttpServer())
          .post('/api/justify')
          .send({ token: API_TOKEN.token, text: 'a'.repeat(50001) })
          .expect(400)
          .expect({
            statusCode: 400,
            message:
              'Request validation of body failed, because: "text" length must be less than or equal to 50000 characters long',
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
  });
});
