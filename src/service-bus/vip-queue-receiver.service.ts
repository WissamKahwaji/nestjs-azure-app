import { Injectable } from '@nestjs/common';
import { ServiceBusConsumerService } from './service-bus-interface.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserBill } from 'src/schemas/UserBill.schema';

@Injectable()
export class VipQueueReceiverService extends ServiceBusConsumerService {
  constructor(
    @InjectModel(UserBill.name) private readonly userBillModel: Model<UserBill>,
  ) {
    super(process.env.EVENT_SERVICE_BUS, process.env.EVENT_HUB_QUEUE_NAME1);
  }

  async handleCustomMessage(message: any): Promise<void> {
    try {
      // Implement VIP queue logic to handle the received message
      // Create a new user bill document
      const newUserBill = new this.userBillModel({
        name: message.name,
        bill: message.bill,
        type: 'Vip User',
        time: Date.now(),
      });

      // Save the document to the database
      await newUserBill.save();
      console.log(`Received Message from VIP queue: ${message.name}`);
      console.log(`Bill amount: ${message.bill}`);

      // Example: Send an email to notify VIP customer
      // sendEmailToVIP(message.name, message.bill);

      // You can add more business logic based on the received message
    } catch (error) {
      console.error('Error handling message from VIP queue:', error);
      throw error; // Propagate the error to the caller
    }
  }
}
