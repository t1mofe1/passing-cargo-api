import { Snowflake, SnowflakeResolvable } from '../../../utils/Snowflake';

export type AuthSessionEndDto = {
  /**
   * The user ID to end the session for.
   *
   * @snowflake
   */
  userId: string;

  /**
   * The access token to end the session for.
   *
   * @jwt
   */
  accessToken: string;
};
