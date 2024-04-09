import * as chalk from 'chalk';
import { FormatterReturn, LOG_LEVEL } from './enums';
import { CustomMessageHandlerProps, FormatterPayload } from './interfaces';
import { Transport } from './transports';
import { ConsoleTransport } from './transports/';
import { DEFAULT_LOG_LEVEL_COLORS } from './utils';

type LoggerCustomMessageHandler = (
  props: CustomMessageHandlerProps<FormatterReturn>,
) => {
  [FormatterReturn.TEXT]?: string;
  [FormatterReturn.JSON]?: Record<string, unknown>;
};

export interface LoggerOptions {
  /** Custom message handler */
  customMessageHandler?: LoggerCustomMessageHandler;
  /** Whether to include time between messages */
  includeTimeDifference?: boolean;
  /** Whether to include process id */
  includePid?: boolean;
  /** Override and customize the default log level colors. */
  logLevelColors?: Record<LOG_LEVEL, chalk.Chalk>;
  /** Array of transports to process and log the data. */
  transports?: Transport[];
  /** Whether to suppress the logs. */
  suppress?: boolean;
}

export class Logger {
  private previousLogTime?: number;

  constructor(public loggerName: string, public options: LoggerOptions = {}) {
    this.options.includePid ??= true;
    this.options.includeTimeDifference ??= false;
    this.options.suppress ??= false;
    this.options.transports ??= [new ConsoleTransport()];
    this.options.logLevelColors = {
      ...DEFAULT_LOG_LEVEL_COLORS,
      ...this.options.logLevelColors,
    };
  }

  public logToTransports(level: LOG_LEVEL, message: string) {
    if (this.options.suppress) return;

    const timestamp = new Date();
    const timeDifference =
      this.previousLogTime === undefined
        ? 0
        : Date.now() - this.previousLogTime;
    this.previousLogTime = Date.now();

    const transports = this.options.transports || [];
    for (const transport of transports) {
      const {
        loggerName,
        options: {
          customMessageHandler: _customMessageHandlers,
          includePid,
          includeTimeDifference,
          logLevelColors: customColors,
        },
      } = this;
      const pid = process.pid;

      // TODO: Fix custom message handler
      // const customMessageHandler =
      //   _customMessageHandlers?.[
      //     transport.options.formatter?.returnType || FormatterReturn.TEXT
      //   ];

      const props: FormatterPayload<FormatterReturn> = {
        level,
        loggerName,
        message,
        timestamp,
        pid,
        timeDifference,
        includePid: includePid ?? true,
        includeTimeDifference: includeTimeDifference ?? false,
        customColors,
        customMessageHandler: undefined,
      };

      const logMessage = transport.options.formatter.format(props);

      transport.handle({ message: logMessage });
    }
  }

  debug(message: string) {
    this.logToTransports(LOG_LEVEL.DEBUG, message);
  }
  log(message: string) {
    this.logToTransports(LOG_LEVEL.LOG, message);
  }
  warn(message: string) {
    this.logToTransports(LOG_LEVEL.WARN, message);
  }
  error(message: string) {
    this.logToTransports(LOG_LEVEL.ERROR, message);
  }
}
