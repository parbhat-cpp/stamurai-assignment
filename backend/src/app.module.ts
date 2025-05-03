import { Module } from '@nestjs/common';

// Controllers import
import { AppController } from './app.controller';

// Service imports
import { AppService } from './app.service';

// Module imports
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { OrganisationModule } from './organisation/organisation.module';
import { TaskModule } from './task/task.module';

// Config file
import config from './config';

@Module({
  imports: [
    MongooseModule.forRoot(config.DB_URL),
    UserModule,
    OrganisationModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
