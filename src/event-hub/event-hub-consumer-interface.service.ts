import { ServiceBusClient } from '@azure/service-bus';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class MessageBusQueue {
  constructor() {}
  protected serviceBusClient = new ServiceBusClient(
    process.env.EVENT_SERVICE_BUS,
  );

  abstract sendMessage(message: any): void;
}

@Injectable()
export class VipQueue extends MessageBusQueue {
  private queueName = 'vipQueue';
  async sendMessage(message: any) {
    try {
      const sender = this.serviceBusClient.createSender(this.queueName);
      const message1 = {
        body: message,
      };
      await sender.sendMessages(message1);
    } catch (error) {
      console.log(error);
    }
  }
}

@Injectable()
export class NormalQueue extends MessageBusQueue {
  private queueName = 'normalQueue';
  async sendMessage(message: any) {
    try {
      const sender = this.serviceBusClient.createSender(this.queueName);
      const message1 = {
        body: message,
      };
      await sender.sendMessages(message1);
    } catch (error) {
      console.log(error);
    }
  }
}
