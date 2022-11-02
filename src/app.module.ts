import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { JustifyController } from './justify/justify.controller';
import { JustifyService } from './justify/justify.service';
import { JoiPipeModule } from 'nestjs-joi';
import { APITokenController } from './apitoken/apitoken.controller';
import { APITokenService } from './apitoken/apitoken.service';
import { APITokenDao } from './apitoken/apitoken.dao';

@Module({
  imports: [JoiPipeModule, CacheModule.register()],
  controllers: [AppController, JustifyController, APITokenController],
  providers: [JustifyService, APITokenService, APITokenDao],
})
export class AppModule {}
