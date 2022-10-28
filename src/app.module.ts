import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JustifyController } from './justify/justify.controller';
import { JustifyService } from './justify/justify.service';
import { JoiPipeModule } from 'nestjs-joi';

@Module({
  imports: [JoiPipeModule],
  controllers: [AppController, JustifyController],
  providers: [JustifyService],
})
export class AppModule {}
