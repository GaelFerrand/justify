import { Body, Controller, Post } from '@nestjs/common';
import * as Joi from 'joi';
import { JoiSchemaOptions, JoiSchema } from 'nestjs-joi';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { TokenService } from './token.service';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class TokenEmailDto {
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
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @ApiResponse({
    description: "The user's token.",
  })
  @Post('api/token')
  async justify(
    @Body() tokenEmailDto: TokenEmailDto,
  ): Promise<{ token: string }> {
    const token = await this.tokenService.getTokenByEmail(tokenEmailDto.email);
    return { token: token.token };
  }
}
