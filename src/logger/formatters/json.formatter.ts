import { FormatterReturn } from '../enums';
import { Formatter, FormatterPayload } from '../interfaces';
import { getTimestamp, stringify } from '../utils';

export class JsonFormatter implements Formatter {
  returnType = FormatterReturn.JSON;

  format(payload: FormatterPayload<FormatterReturn.JSON>): string {
    const {
      includePid,
      includeTimeDifference,
      level,
      loggerName,
      message,
      pid,
      timeDifference,
      timestamp,
      customMessageHandler,
    } = payload;

    const defaultMessage: Record<string, unknown> = {
      level,
      loggerName,
      timestamp: getTimestamp(timestamp),
      message,
    };
    if (includePid) defaultMessage.pid = pid;
    if (includeTimeDifference) defaultMessage.timeDifference = timeDifference;

    const logMessage =
      customMessageHandler?.({
        level,
        loggerName,
        message,
        pid,
        timeDifference,
        timestamp,
        type: FormatterReturn.JSON,
      }) ?? defaultMessage;

    return stringify(logMessage);
  }
}
