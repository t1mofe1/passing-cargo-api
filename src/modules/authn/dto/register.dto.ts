export type RegisterDto = {
  /**
   * The user's phone number
   *
   * @phone_number
   */
  phone_number: string;

  /**
   * The user's phone number verification code
   *
   * @numeric_string
   */
  code: string;

  /**
   * The user's first name
   *
   * @minLength 2
   */
  first_name: string;

  /**
   * The user's last name
   *
   * @minLength 2
   */
  last_name: string;
};
