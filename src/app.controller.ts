import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  get(): string {
    return 'Justify API. See /doc for the documentation';
  }
}
