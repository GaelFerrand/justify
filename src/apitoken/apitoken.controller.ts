import { Body, Controller, Post } from '@nestjs/common';
import * as Joi from 'joi';
import { JoiSchemaOptions, JoiSchema } from 'nestjs-joi';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { APITokenService } from './apitoken.service';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class APITokenEmailDto {
  @ApiProperty({
    description: "The user's email.",
    minLength: 0,
    maxLength: 300,
    required: true,
    example: 'foo.bar@mail.com',
  })
  @JoiSchema(Joi.string().email().min(0).max(300).required())
  email: string;
}

@Controller()
export class APITokenController {
  constructor(private readonly apiTokenService: APITokenService) {}

  @ApiOperation({
    summary: `Will return a unique token (uuidv4-like), associated with provided email.`,
  })
  @ApiResponse({
    description: "The user's token.",
  })
  @Post('api/token')
  async getAPIToken(
    @Body() apiTokenEmailDto: APITokenEmailDto,
  ): Promise<{ token: string }> {
    const apiToken = await this.apiTokenService.getOrCreateAPITokenByEmail(
      apiTokenEmailDto.email,
    );
    return { token: apiToken.token };
  }
}
