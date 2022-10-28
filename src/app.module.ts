import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JustifyController } from './justify/justify.controller';
import { JustifyService } from './justify/justify.service';
import { JoiPipeModule } from 'nestjs-joi';
import { APITokenController } from './apitoken/apitoken.controller';
import { APITokenService } from './apitoken/apitoken.service';
import { APITokenDao } from './apitoken/apitoken.dao';

@Module({
  imports: [JoiPipeModule],
  controllers: [AppController, JustifyController, APITokenController],
  providers: [JustifyService, APITokenService, APITokenDao],
})
export class AppModule {}
