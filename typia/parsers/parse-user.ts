import { createIsParse, createStringify, createValidateStringify } from 'typia';
import { UserFields } from '../../src/models/User.model';

export const parseUser = createIsParse<UserFields>();
export const stringifyUser = createStringify<UserFields>();

export const validateStringifyUser = createValidateStringify<UserFields>();
