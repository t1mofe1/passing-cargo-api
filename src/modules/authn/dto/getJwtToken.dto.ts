export type GetJwtTokenDto = {
  /**
   * The user ID to get the token for.
   *
   * @snowflake
   */
  userId: string;

  /** Whether or not the user has MFA enabled. */
  mfaEnabled: boolean;

  /**
   * The session ID
   *
   * @snowflake
   */
  authSessionId: string;

  /**
   * The session index of the token.
   *
   * @type int
   */
  authSessionIndex: number;
};
