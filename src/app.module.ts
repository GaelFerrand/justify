import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JustifyController } from './justify/justify.controller';
import { JustifyService } from './justify/justify.service';
import { JoiPipeModule } from 'nestjs-joi';
import { TokenController } from './token/token.controller';
import { TokenService } from './token/token.service';
import { TokenDao } from './token/token.dao';

@Module({
  imports: [JoiPipeModule],
  controllers: [AppController, JustifyController, TokenController],
  providers: [JustifyService, TokenService, TokenDao],
})
export class AppModule {}
