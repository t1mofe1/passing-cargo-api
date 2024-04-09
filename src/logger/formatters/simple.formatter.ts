import * as chalk from 'chalk';
import { FormatterReturn } from '../enums';
import { Formatter, FormatterPayload } from '../interfaces';
import { DEFAULT_LOG_LEVEL_COLORS, getTimestamp } from '../utils';

export class SimpleFormatter implements Formatter {
  returnType = FormatterReturn.TEXT;

  format(payload: FormatterPayload<FormatterReturn.TEXT>): string {
    const {
      includePid,
      includeTimeDifference,
      level,
      loggerName,
      message,
      pid,
      timeDifference,
      timestamp,
      customColors,
      customMessageHandler,
    } = payload;

    const logLevelColors = {
      ...DEFAULT_LOG_LEVEL_COLORS,
      ...customColors,
    };

    const msgTimestamp = chalk.bold.magenta(getTimestamp(timestamp));
    const msgLoggerName = chalk.bold.green(`[${loggerName}]`);
    const msgPid = chalk.bold.blue(pid);
    const msgLogLevel = logLevelColors[level](level.toUpperCase());
    const msgTimeDifference = chalk.bold.yellow(`+${timeDifference}ms`);

    const defaultMessage = [
      msgLoggerName,
      includePid ? ` ${msgPid}` : '',
      ` ${msgLogLevel}`,
      ` ${msgTimestamp}`,
      ` ${message}`,
      includeTimeDifference ? ` ${msgTimeDifference}` : '',
    ].join('');

    const logMessage =
      customMessageHandler?.({
        level,
        loggerName,
        message,
        pid,
        timeDifference,
        timestamp,
        type: FormatterReturn.TEXT,
      }) ?? defaultMessage;

    return logMessage;
  }
}
