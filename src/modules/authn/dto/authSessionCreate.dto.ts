export type AuthSessionCreateDto = {
  /**
   * The user ID to create the session for.
   *
   * @snowflake
   */
  userId: string;

  /**
   * Whether or not the user has MFA enabled.
   */
  mfaEnabled: boolean;
};
