import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventHubService } from '../event-hub/event-hub.service';
import { User } from 'src/schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly eventHubService: EventHubService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async sendUserBillsToEventHub() {
    try {
      this.logger.log('Service cron started');

      const users: User[] = [];

      // Generate random bills for users
      for (let i = 0; i < 10; i++) {
        const user = new this.userModel({
          name: `User${i + 1}`,
          bill: (Math.floor(Math.random() * 10) + 1) * 1000,
        });
        users.push(user);
      }

      // Send user bills to Azure Event Hub
      for (const user of users) {
        this.logger.debug(`Sending bill ${user.bill} for user ${user.name}`);
        await this.eventHubService.sendEventToEventHub({
          name: user.name,
          bill: user.bill,
        });
      }

      this.logger.log('Service cron completed');
    } catch (error) {
      this.logger.error(
        `Error in sendUserBillsToEventHub: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to process user bills');
    }
  }
}
