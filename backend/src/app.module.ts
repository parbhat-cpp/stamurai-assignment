import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import config from './config';

@Module({
  imports: [MongooseModule.forRoot(config.DB_URL), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
