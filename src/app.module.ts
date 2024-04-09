import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventHubService } from './event-hub/event-hub.service';
import { User, UserSchema } from './schemas/User.schema';
import { NormalQueueReceiverService } from './service-bus/normal-queue-receiver.service';
import { VipQueueReceiverService } from './service-bus/vip-queue-receiver.service';
import { UserService } from './user/user.service';
import { EventHubConsumerService } from './event-hub/event-hub-consumer.service';
import { ScheduleModule } from '@nestjs/schedule';
import {
  NormalQueue,
  VipQueue,
} from './event-hub/event-hub-consumer-interface.service';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { Logger } from './common/logger/logger.service';
import { UserBill, UserBillSchema } from './schemas/UserBill.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserBill.name, schema: UserBillSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    Logger,
    EventHubService,
    NormalQueueReceiverService,
    VipQueueReceiverService,
    VipQueue,
    NormalQueue,
    UserService,
    EventHubConsumerService,
  ],
})
export class AppModule {}
