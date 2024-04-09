export type MfaEnableResult =
  | {
      /**
       * The URL for the totp authenticator
       */
      totpAuthUrl?: string;
    }
  | undefined;
