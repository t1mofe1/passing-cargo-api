export type AuthSessionRefreshDto = {
  /**
   * The user ID to refresh the session for.
   *
   * @snowflake
   */
  userId: string;

  /**
   * The refresh token to refresh the session for.
   *
   * @jwt
   */
  refreshToken: string;
};
