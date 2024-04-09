import { ConsoleTransport, Logger, LoggerOptions } from '@origranot/ts-logger';

const consoleTransport = new ConsoleTransport();

export function createLogger(name: string, options: LoggerOptions) {
  const logger = new Logger({
    name,
    transports: [consoleTransport],
  });
}
