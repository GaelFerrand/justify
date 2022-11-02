import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiOperation({
    summary: `Healthcheck route. Browse /doc for the documentation`,
  })
  @Get()
  get(): string {
    return 'Justify API. See /doc for the documentation';
  }
}
