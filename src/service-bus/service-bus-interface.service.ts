import { ServiceBusClient, ServiceBusReceiver } from '@azure/service-bus';
import { OnModuleInit, Injectable, Logger } from '@nestjs/common';

@Injectable()
export abstract class ServiceBusConsumerService implements OnModuleInit {
  private serviceBusClient: ServiceBusClient;
  private receiver: ServiceBusReceiver;
  private readonly logger = new Logger(ServiceBusConsumerService.name);

  constructor(connectionString: string, queueName: string) {
    this.serviceBusClient = new ServiceBusClient(connectionString);
    this.receiver = this.serviceBusClient.createReceiver(queueName);
  }

  abstract handleCustomMessage(message: any): Promise<void>;

  async handleMessage(message: any): Promise<void> {
    try {
      let discount = 0;
      if (message.bill > 5000) {
        discount = 100;
      }
      message.bill -= discount;
      this.logger.log(
        'Message processed successfully',
        ServiceBusConsumerService.name,
      );
      await this.handleCustomMessage(message);
    } catch (error) {
      this.logger.error(
        `Failed to handle message: ${error.message}`,
        error.stack,
        ServiceBusConsumerService.name,
      );
      throw error; // Propagate the error to the caller
    }
  }

  onModuleInit() {
    this.receiver.subscribe({
      processMessage: async (messageReceived) => {
        try {
          const messageBody = messageReceived.body;
          await this.handleMessage(messageBody);
        } catch (error) {
          this.logger.error(
            `Error processing message: ${error.message}`,
            error.stack,
            ServiceBusConsumerService.name,
          );
        }
      },
      processError: async (error) => {
        this.logger.error(
          `ServiceBusClient error: ${error}`,
          ServiceBusConsumerService.name,
        );
      },
    });
  }

  async closeReceiver(): Promise<void> {
    try {
      await this.receiver.close();
      await this.serviceBusClient.close();
      this.logger.log(
        'Service Bus Receiver closed successfully',
        ServiceBusConsumerService.name,
      );
    } catch (error) {
      this.logger.error(
        `Error closing Service Bus Receiver: ${error.message}`,
        error.stack,
        ServiceBusConsumerService.name,
      );
    }
  }
}
