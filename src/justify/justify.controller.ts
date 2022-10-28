import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { JustifyService } from './justify.service';
import * as Joi from 'joi';
import { JoiSchemaOptions, JoiSchema } from 'nestjs-joi';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { TEXT_WITH_TWO_PARAGRAPHS_JUSTIFIED } from './justify.mocks';
import { APITokenService } from '../apitoken/apitoken.service';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class JustifyTextDto {
  @ApiProperty({
    description:
      'The text to justify. Each line will contain 80 characters max.',
    minLength: 0,
    maxLength: 50000,
    required: true,
    example: TEXT_WITH_TWO_PARAGRAPHS_JUSTIFIED,
  })
  @JoiSchema(Joi.string().min(0).max(50000).required())
  text: string;

  @ApiProperty({
    description:
      'The user token (uuidv4). Each user can do up to 80000 requests per day',
    minLength: 36,
    maxLength: 36,
    pattern:
      '^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$',
    example: 'd938bf44-e7cc-42bd-86df-ec57950188ce',
  })
  @JoiSchema(
    Joi.string()
      .length(36)
      .regex(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
      )
      .required(),
  )
  token: string;
}

@Controller()
export class JustifyController {
  constructor(
    private readonly justifyService: JustifyService,
    private readonly apiTokenService: APITokenService,
  ) {}

  @ApiResponse({
    description: 'The justified text.',
  })
  @Post('api/justify')
  async justify(@Body() justifyTextDto: JustifyTextDto): Promise<string> {
    const apiToken = await this.apiTokenService.getAPITokenByToken(
      justifyTextDto.token,
    );

    if (!apiToken)
      throw new HttpException(
        `Invalid token '${justifyTextDto.token}'`,
        HttpStatus.UNAUTHORIZED,
      );

    return this.justifyService.justify(justifyTextDto.text);
  }
}
