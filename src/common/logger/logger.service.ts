import { Injectable, Logger as NestLogger } from '@nestjs/common';
import {
  createLogger,
  Logger as WinstonLogger,
  transports,
  format,
} from 'winston';

@Injectable()
export class Logger {
  private winstonLogger: WinstonLogger;

  constructor() {
    this.winstonLogger = createLogger({
      transports: [
        new transports.Console({
          format: format.combine(format.timestamp(), format.json()),
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.winstonLogger.info(message, { context });
    NestLogger.log(message, context);
  }

  error(message: string, trace: string, context?: string) {
    this.winstonLogger.error(message, { context, trace });
    NestLogger.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    this.winstonLogger.warn(message, { context });
    NestLogger.warn(message, context);
  }
}
