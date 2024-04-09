import { nanoid } from 'nanoid';

// #region auth
export function generateGatewayAuthToken() {
  return generateRandomStringByLength(64);
}

export function generateSmsAuthCode() {
  return generateRandomNumericStringByLength(4);
}

export function generateUserAvatarHash() {
  return generateRandomStringByLength(32);
}
// #endregion auth

// #region utils
export function generateRandomNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function generateRandomNumericStringByLength(length: number) {
  const characters = '0123456789';

  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

export function generateRandomStringByLength(length: number) {
  return nanoid(length);
}
// #endregion utils
