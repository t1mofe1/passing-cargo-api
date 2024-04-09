import { LOG_LEVEL } from '../enums';
import { SimpleFormatter } from '../formatters';
import { Formatter } from '../interfaces';

export interface TransportOptions {
  formatter: Formatter;
  threshold: LOG_LEVEL;
}

export interface TransportPayload {
  message: string;
}

export abstract class Transport {
  public options: TransportOptions;

  constructor(options?: Partial<TransportOptions>) {
    this.options = {
      formatter: options?.formatter || new SimpleFormatter(),
      threshold: options?.threshold || LOG_LEVEL.DEBUG,
    };
  }

  abstract handle(payload: TransportPayload): void;
}
