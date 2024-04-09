import * as chalk from 'chalk';
import { LOG_LEVEL } from './enums';
import { Logger } from './logger';

type NestLoggerOptions = {
  muteCategories?: string[];
};

export class NestLogger {
  private logger = new Logger('Nest');

  constructor(private readonly options?: NestLoggerOptions) {
    this.logger.options.includeTimeDifference = true;
  }

  public debug(message: string, category: string) {
    this.sendLog(LOG_LEVEL.DEBUG, message, category);
  }
  public log(message: string, category: string) {
    this.sendLog(LOG_LEVEL.LOG, message, category);
  }
  public warn(message: string, category: string) {
    this.sendLog(LOG_LEVEL.WARN, message, category);
  }
  public error(message: string, category: string) {
    this.sendLog(LOG_LEVEL.ERROR, message, category);
  }

  private sendLog(log_level: LOG_LEVEL, message: string, category: string) {
    if (this.options?.muteCategories?.includes(category)) return;

    const msgCategory = chalk.bold.yellow(`[${category}]`);
    const msg = `${msgCategory} ${message}`;

    this.logger[log_level](msg);
  }
}
