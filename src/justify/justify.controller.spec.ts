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

describe('JustifyController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [JoiPipeModule],
      controllers: [JustifyController],
      providers: [JustifyService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('POST api/justify', () => {
    it('sending an empty request > should return an error expliciting that param "text" is expected', () => {
      return request(app.getHttpServer())
        .post('/api/justify')
        .expect(400)
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
        .send({ text: '' })
        .expect(201);
    });

    it('sending a sentence longer than 80 characters > should return the justified sentence', () => {
      return request(app.getHttpServer())
        .post('/api/justify')
        .send({ text: TEXT_WITH_81_CHARACTERS })
        .expect(201)
        .expect(TEXT_WITH_81_CHARACTERS_JUSTIFIED);
    });

    it('sending a text with more than 50000 characters > should return an error expliciting the size issue', () => {
      return request(app.getHttpServer())
        .post('/api/justify')
        .send({ text: 'a'.repeat(50001) })
        .expect(400)
        .expect({
          statusCode: 400,
          message:
            'Request validation of body failed, because: "text" length must be less than or equal to 50000 characters long',
          error: 'Bad Request',
        });
    });

    it('sending unexpected type > should return an error expliciting the typing issue', () => {
      return request(app.getHttpServer())
        .post('/api/justify')
        .send({ text: 1 })
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
