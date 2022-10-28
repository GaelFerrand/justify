import { Body, Controller, Post } from '@nestjs/common';
import { JustifyService } from './justify.service';
import * as Joi from 'joi';
import { JoiSchemaOptions, JoiSchema } from 'nestjs-joi';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { TEXT_WITH_TWO_PARAGRAPHS_JUSTIFIED } from './justify.mocks';

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
}

@Controller()
export class JustifyController {
  constructor(private readonly justifyService: JustifyService) {}

  @ApiResponse({
    description: 'The justified text.',
  })
  @Post('api/justify')
  justify(@Body() justifyTextDto: JustifyTextDto): string {
    return this.justifyService.justify(justifyTextDto.text);
  }
}
