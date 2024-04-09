import { LOG_LEVEL } from '@origranot/ts-logger';
import * as Joi from 'joi';

export interface IAppConfig {
  NODE_ENV: 'development' | 'production';

  HTTP_PORT: number;

  DATABASE_URL: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;

  DOMAIN: string;

  MFA_SERVICE_NAME: string;

  PCARGO_EPOCH: number;

  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_CONFIRMATION_SECRET: string;
  JWT_RESET_PASSWORD_SECRET: string;

  JWT_ACCESS_EXPIRATION_TIME: number;
  JWT_REFRESH_EXPIRATION_TIME: number;
  JWT_CONFIRMATION_EXPIRATION_TIME: number;
  JWT_RESET_PASSWORD_EXPIRATION_TIME: number;

  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_AUTH_USER: string;
  MAIL_AUTH_PASS: string;

  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_MESSAGING_SERVICE_SID: string;
  TWILIO_TEST_ACCOUNT: boolean;
  TWILIO_TEST_ACCOUNT_PHONE_NUMBER: string;

  FILES_UPLOAD_DIR: string;

  CONSOLE_LOG_LEVEL: LOG_LEVEL;
}

export const validationSchema = Joi.object<IAppConfig, true>({
  NODE_ENV: Joi.string().valid('development', 'production'),

  HTTP_PORT: Joi.number(),

  DATABASE_URL: Joi.string().uri(),
  DB_NAME: Joi.string(),
  DB_HOST: Joi.string(),
  DB_PORT: Joi.number(),
  DB_USER: Joi.string(),
  DB_PASS: Joi.string(),

  DOMAIN: Joi.string(),

  MFA_SERVICE_NAME: Joi.string(),

  PCARGO_EPOCH: Joi.number(),

  JWT_ACCESS_SECRET: Joi.string(),
  JWT_REFRESH_SECRET: Joi.string(),
  JWT_CONFIRMATION_SECRET: Joi.string(),
  JWT_RESET_PASSWORD_SECRET: Joi.string(),

  JWT_ACCESS_EXPIRATION_TIME: Joi.number(),
  JWT_REFRESH_EXPIRATION_TIME: Joi.number(),
  JWT_CONFIRMATION_EXPIRATION_TIME: Joi.number(),
  JWT_RESET_PASSWORD_EXPIRATION_TIME: Joi.number(),

  MAIL_HOST: Joi.string(),
  MAIL_PORT: Joi.number(),
  MAIL_AUTH_USER: Joi.string(),
  MAIL_AUTH_PASS: Joi.string(),

  TWILIO_ACCOUNT_SID: Joi.string(),
  TWILIO_AUTH_TOKEN: Joi.string(),
  TWILIO_MESSAGING_SERVICE_SID: Joi.string(),
  TWILIO_TEST_ACCOUNT: Joi.boolean(),
  TWILIO_TEST_ACCOUNT_PHONE_NUMBER: Joi.string(),

  FILES_UPLOAD_DIR: Joi.string(),

  CONSOLE_LOG_LEVEL: Joi.string().valid(...Object.values(LOG_LEVEL)),
});
