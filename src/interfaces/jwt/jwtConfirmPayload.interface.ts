import { SnowflakeResolvable } from '../../utils/Snowflake';

export interface JwtConfirmPayload {
  userId: SnowflakeResolvable;
  email: string;
}
