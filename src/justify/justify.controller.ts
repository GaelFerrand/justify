import {
  Controller,
  HttpException,
  HttpStatus,
  Headers,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { JustifyService } from './justify.service';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { APITokenService } from '../apitoken/apitoken.service';
import { Request } from 'express';
import * as rawbody from 'raw-body';
import { justifyTextDto } from './justify.dtos';
import {
  TEXT_WITH_TWO_PARAGRAPHS,
  LONG_TEXT_WITH_LONG_WORD_AND_MORE_TEXT,
} from '../utils/string.util.mocks';

@Controller()
export class JustifyController {
  constructor(
    private readonly justifyService: JustifyService,
    private readonly apiTokenService: APITokenService,
  ) {}

  // Side-note: documentation via @annotations seems cumbersome, yaml
  // would probably be better
  @Post('api/justify')
  @ApiConsumes('text/plain')
  @ApiBody({
    description:
      'The text to justify. Each line will contain 80 characters max.',
    schema: { minLength: 0, maxLength: 50000 },
    examples: {
      'Long text': {
        value: `${TEXT_WITH_TWO_PARAGRAPHS}`,
      },
      'Long text with long words within': {
        value: `${TEXT_WITH_TWO_PARAGRAPHS}\n\n${LONG_TEXT_WITH_LONG_WORD_AND_MORE_TEXT}`,
      },
    },
  })
  @ApiHeader({
    name: 'token',
    example: 'd938bf44-e7cc-42bd-86df-ec57950188ce',
    schema: {
      minLength: 36,
      maxLength: 36,
      pattern:
        '[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$',
    },
    description:
      'The API token (uuidv4). See route /api/token to generate one.',
  })
  @ApiOperation({
    summary: `Enables to justify a text. The justified text will have 80-characters lines max. 
      An API token must be provided, and each token enables to justify up to 80000 words per day. 
      Beyond that rate a paying subscription is required. The request must be a plain/text raw 
      request, and the API token must be provided in the headers like 'token=xxx'`,
  })
  @ApiResponse({
    description: 'The justified text.',
  })
  async justify(
    @Req() req: RawBodyRequest<Request>,
    @Headers('token') token: string,
  ): Promise<string> {
    const text = await this.rawBody(req);

    const validation = await justifyTextDto.validate({ text, token });
    if (validation.error) {
      const errorMessage = validation.error.details
        .map((detail) => detail.message)
        .join(', ');
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    const apiToken = await this.apiTokenService.getAPITokenByToken(token);
    if (!apiToken)
      throw new HttpException(
        `Invalid token '${token}'`,
        HttpStatus.UNAUTHORIZED,
      );

    return this.justifyService.justify(text, token);
  }

  // Little 'hack', as the doc for raw requests does not seem to function
  // out-of-the-box: https://docs.nestjs.com/faq/raw-body
  // Supertest seems to make it work fine, whereas postman / doc doesn't,
  // hence the 2 different use-cases
  async rawBody(req: RawBodyRequest<Request>): Promise<string> {
    if (req.rawBody) {
      return req.rawBody.toString('utf-8');
    }

    if (req.readable) {
      const raw = await rawbody(req);
      return raw.toString().trim();
    }

    return '';
  }
}
