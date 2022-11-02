import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { JustifyService } from './justify.service';
import { ApiResponse } from '@nestjs/swagger';
import { APITokenService } from '../apitoken/apitoken.service';
import { JustifyTextDto } from './justify.dtos';

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

    return this.justifyService.justify(
      justifyTextDto.text,
      justifyTextDto.token,
    );
  }
}
