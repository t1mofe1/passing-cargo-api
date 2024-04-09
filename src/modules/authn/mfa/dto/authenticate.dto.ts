export type AuthenticateDto = {
  /**
   * The mfa auth code
   *
   * @numeric_string
   * @minLength 4
   * @maxLength 4
   */
  mfaAuthCode: string;
};
