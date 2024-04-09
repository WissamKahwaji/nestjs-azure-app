/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  EventHubConsumerClient,
  PartitionContext,
  ReceivedEventData,
} from '@azure/event-hubs';
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { NormalQueue, VipQueue } from './event-hub-consumer-interface.service';
import { User } from 'src/schemas/User.schema';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EventHubConsumerService implements OnModuleInit {
  private consumerClient: EventHubConsumerClient;
  private readonly logger = new Logger(EventHubConsumerService.name);

  constructor(
    private readonly vipQueue: VipQueue,
    private readonly normalQueue: NormalQueue,
  ) {
    const connectionString = process.env.EVENT_HUB_CONSUMER_CONNECTION;
    const consumerGroupName = process.env.EVENT_HUB_GROUP;

    this.consumerClient = new EventHubConsumerClient(
      consumerGroupName,
      connectionString,
    );
  }

  async onModuleInit() {
    try {
      this.consumerClient.subscribe({
        processEvents: async (
          events: ReceivedEventData[],
          context: PartitionContext,
        ) => {
          this.logger.log(
            'EVENTS RECEIVED FROM AZURE EVENT HUB',
            EventHubConsumerService.name,
          );

          for (const event of events) {
            try {
              const eventData = JSON.parse(event.body.toString()) as User;
              this.logger.log(
                `Received event: ${JSON.stringify(eventData)}`,
                EventHubConsumerService.name,
              );

              if (eventData.bill > 5000) {
                this.logger.log(
                  'Handling VIP event',
                  EventHubConsumerService.name,
                );
                await this.vipQueue.sendMessage(eventData);
              } else {
                this.logger.log(
                  'Handling NORMAL event',
                  EventHubConsumerService.name,
                );
                await this.normalQueue.sendMessage(eventData);
              }
            } catch (error) {
              this.logger.error(
                `Error processing event: ${error.message}`,
                error.stack,
                EventHubConsumerService.name,
              );
            }
          }
        },
        processError: async (err: Error) => {
          this.logger.error(
            'Error processing events:',
            err,
            EventHubConsumerService.name,
          );
        },
      });
    } catch (error) {
      this.logger.error(
        'Error subscribing to Azure Event Hub:',
        error,
        EventHubConsumerService.name,
      );
    }
  }
}
