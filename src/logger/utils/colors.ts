import * as chalk from 'chalk';
import { LOG_LEVEL } from '../enums';

export const DEFAULT_LOG_LEVEL_COLORS = {
  [LOG_LEVEL.DEBUG]: chalk.bold.bgBlack,
  [LOG_LEVEL.LOG]: chalk.bold.bgBlue,
  [LOG_LEVEL.WARN]: chalk.bold.bgYellow,
  [LOG_LEVEL.ERROR]: chalk.bold.bgRed,
};
