import { Injectable, Logger } from '@nestjs/common';
import { EventHubProducerClient } from '@azure/event-hubs';
import { User } from 'src/schemas/User.schema';
import * as dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.EVENT_HUB_CONNECTION;
const eventHubName = process.env.EVENT_HUB_NAME;

@Injectable()
export class EventHubService {
  private producerClient: EventHubProducerClient;
  private readonly logger = new Logger(EventHubService.name);

  constructor() {
    this.producerClient = new EventHubProducerClient(
      connectionString,
      eventHubName,
    );
  }

  async sendEventToEventHub(eventBody: User): Promise<void> {
    try {
      this.logger.log(
        'Trying to send event to Event Hub',
        JSON.stringify(eventBody),
      );

      const eventDataBatch = await this.producerClient.createBatch();
      eventDataBatch.tryAdd({ body: JSON.stringify(eventBody) });

      await this.producerClient.sendBatch(eventDataBatch);

      this.logger.log(
        'Event sent to Azure Event Hub',
        JSON.stringify(eventBody),
      );
    } catch (error) {
      this.logger.error(
        `Failed to send event to Azure Event Hub: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
