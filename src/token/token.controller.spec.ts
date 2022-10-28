import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JoiPipeModule } from 'nestjs-joi';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import * as request from 'supertest';
import { TokenDao } from './token.dao';

const UUID_V4_REGEX = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
);

describe('TokenController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [JoiPipeModule],
      controllers: [TokenController],
      providers: [TokenService, TokenDao],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('POST api/token', () => {
    it('sending an empty request > should return an error expliciting that param "email" is expected', () => {
      return request(app.getHttpServer())
        .post('/api/token')
        .expect(400)
        .expect({
          statusCode: 400,
          message:
            'Request validation of body failed, because: "email" is required',
          error: 'Bad Request',
        });
    });

    it('sending a request with an invalid email > should return an error expliciting that param "email" should be an email', () => {
      return request(app.getHttpServer())
        .post('/api/token')
        .send({ email: 'this is definitely not an email' })
        .expect(400)
        .expect({
          statusCode: 400,
          message:
            'Request validation of body failed, because: "email" must be a valid email',
          error: 'Bad Request',
        });
    });

    it('sending too long an email in the request > should return an error expliciting that param "email" should be be smaller', () => {
      return request(app.getHttpServer())
        .post('/api/token')
        .send({ email: `${'a'.repeat(292)}@mail.com` })
        .expect(400)
        .expect({
          statusCode: 400,
          message:
            'Request validation of body failed, because: "email" must be a valid email, "email" length must be less than or equal to 300 characters long',
          error: 'Bad Request',
        });
    });

    it('sending a valid request > should return a valid token', () => {
      return request(app.getHttpServer())
        .post('/api/token')
        .send({ email: `user1@mail.com` })
        .then((response) => {
          expect(response.body.token).toBeTruthy();
          expect(UUID_V4_REGEX.test(response.body.token)).toBeTruthy();
        });
    });

    it('sending two requests with same user email > should return the same valid token', () => {
      return request(app.getHttpServer())
        .post('/api/token')
        .send({ email: `user1@mail.com` })
        .then((response) => {
          const token1 = response.body.token;

          request(app.getHttpServer())
            .post('/api/token')
            .send({ email: `user1@mail.com` })
            .then((response) => {
              const token2 = response.body.token;

              expect(token1).toEqual(token2);
            });
        });
    });

    it("sending two requests with different users' emails > should return different valid tokens", () => {
      return request(app.getHttpServer())
        .post('/api/token')
        .send({ email: `user1@mail.com` })
        .then((response) => {
          const token1 = response.body.token;

          request(app.getHttpServer())
            .post('/api/token')
            .send({ email: `user2@mail.com` })
            .then((response) => {
              const token2 = response.body.token;

              expect(token1).not.toEqual(token2);
            });
        });
    });
  });
});
