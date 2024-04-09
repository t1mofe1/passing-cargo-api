import { SnowflakeResolvable } from '../../utils/Snowflake';

export interface JwtTokenPayload {
  userId: SnowflakeResolvable;
  mfaEnabled?: boolean;
  authSessionId: SnowflakeResolvable;
  authSessionIndex: number;
}
