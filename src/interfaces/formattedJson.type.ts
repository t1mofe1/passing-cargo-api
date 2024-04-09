import { Snowflake } from '../utils/Snowflake';

export type FormattedJsonType<T extends Record<string, unknown>> = {
  [key in keyof T]: T[key] extends Snowflake
    ? string
    : T[key] extends bigint
    ? string
    : T[key] extends Date
    ? string
    : T[key];
};
