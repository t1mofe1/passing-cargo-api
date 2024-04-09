import * as chalk from 'chalk';
import { FormatterReturn, LOG_LEVEL } from '../enums';

export type CustomMessageHandlerProps<Type extends FormatterReturn> = Omit<
  FormatterPayload<Type>,
  | 'customColors'
  | 'customMessageHandler'
  | 'includeTimeDifference'
  | 'includePid'
> & {
  type: Type;
};
export type CustomMessageHandler<Type extends FormatterReturn> = (
  props: CustomMessageHandlerProps<Type>,
) => Type extends 'json' ? Record<string, unknown> : string;

export type FormatterPayload<Type extends FormatterReturn> = {
  level: LOG_LEVEL;
  loggerName: string;
  message: string;
  timestamp: Date;
  pid: number;
  timeDifference: number;
  includeTimeDifference: boolean;
  includePid: boolean;
  customColors?: Record<LOG_LEVEL, chalk.Chalk> | undefined;
  customMessageHandler?: CustomMessageHandler<Type> | undefined;
};

export interface Formatter {
  returnType: FormatterReturn;

  format(payload: FormatterPayload<FormatterReturn>): string;
}
