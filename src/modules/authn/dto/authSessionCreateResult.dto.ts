export type AuthSessionCreateResult = JwtResult;

// export interface AuthSessionCreateResult {
//   jwt: JwtResult;
//   // user: User;
//   /**
//    * The ID of the auth session
//    *
//    * @snowflake
//    */
//   // authSessionId: string;
// }

export type JwtResult = {
  /**
   * The access token
   *
   * @jwt
   */
  accessToken: string;
  /**
   * The refresh token
   *
   * @jwt
   */
  refreshToken: string;
  /**
   * The time when the token was issued
   */
  issuedAt: Date;
  /**
   * The time when the access token expires
   */
  accessTokenExpiresAt: Date;
  /**
   * The time when the refresh token expires
   */
  refreshTokenExpiresAt: Date;
};
