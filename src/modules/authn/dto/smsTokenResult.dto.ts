export type SmsTokenResult = {
  /**
   * The user's phone number
   *
   * @phone_number
   */
  phoneNumber: string;
  /**
   * The code that was sent to the user's phone number
   *
   * @numeric_string
   */
  code: string;
  /**
   * The date and time when the code expires
   */
  expiresAt: Date;
};
