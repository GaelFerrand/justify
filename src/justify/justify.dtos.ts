import * as Joi from 'joi';
import { JoiSchemaOptions, JoiSchema } from 'nestjs-joi';
import { ApiProperty } from '@nestjs/swagger';
import {
  TEXT_WITH_TWO_PARAGRAPHS,
  LONG_TEXT_WITH_LONG_WORD_AND_MORE_TEXT_JUSTIFIED,
} from '../utils/string.util.mocks';

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
    example: `${TEXT_WITH_TWO_PARAGRAPHS}\n\n${LONG_TEXT_WITH_LONG_WORD_AND_MORE_TEXT_JUSTIFIED}`,
  })
  @JoiSchema(Joi.string().min(0).max(50000).required())
  text: string;

  @ApiProperty({
    description:
      'The user token (uuidv4). Each user can justify up to 80 000 words for free per day - then a paying subscription is needed',
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
