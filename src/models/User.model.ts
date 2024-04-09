import { User as PrismaUser } from '@prisma/client';
import { FormattedJsonType } from '../interfaces/formattedJson.type';
import EnhancedJSON from '../utils/EnhancedJSON';
import { Snowflake } from '../utils/Snowflake';

export interface UserFields {
  /**
   * The user's id
   *
   * @snowflake
   */
  id: string;

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

  /**
   * The user's email
   *
   * @format email
   */
  email: string | null;

  /**
   * The user's avatar
   */
  avatar: string | null;

  /**
   * The user's phone number
   *
   * @phone_number
   */
  phone_number: string;

  /**
   * The user's date of birth
   */
  date_of_birth: Date | null;

  /**
   * The user's bio
   */
  bio: string | null;

  /**
   * Is the user's email verified
   */
  email_verified: boolean;

  /**
   * Is the user's mfa enabled
   */
  mfa_enabled: boolean;
}

export type UserPrivateInfo = Omit<
  UserFields,
  'mfa_enabled' | 'email_verified' | 'user_security_id'
>;
export type UserPublicInfo = Omit<
  UserPrivateInfo,
  'email' | 'date_of_birth' | 'phone_number'
>;

export type UserExtractInfoTypeMap = {
  [UserExtractInfoType.Private]: UserPrivateInfo;
  [UserExtractInfoType.Public]: UserPublicInfo;
};

export enum UserExtractInfoType {
  Public = 'public',
  Private = 'private',
}

type UserClassFields = Omit<UserFields, 'id'> & { id: Snowflake };

export default class User implements UserClassFields {
  id: Snowflake;
  first_name: string;
  last_name: string;
  email: string | null;
  avatar: string | null;
  phone_number: string;
  date_of_birth: Date | null;
  bio: string | null;
  email_verified: boolean;
  mfa_enabled: boolean;

  constructor(userObject: PrismaUser | User) {
    this.id =
      userObject.id instanceof Snowflake
        ? userObject.id
        : new Snowflake(userObject.id);
    this.first_name = userObject.first_name;
    this.last_name = userObject.last_name;
    this.email = userObject.email;
    this.avatar = userObject.avatar;
    this.phone_number = userObject.phone_number;
    this.date_of_birth = userObject.date_of_birth;
    this.bio = userObject.bio;
    this.email_verified = userObject.email_verified;
    this.mfa_enabled = userObject.mfa_enabled;
  }

  public extractPublicInfo<Jsonify extends boolean = false>(jsonify: Jsonify) {
    return this.extractInfo(UserExtractInfoType.Public, jsonify);
  }
  public extractPrivateInfo<Jsonify extends boolean = false>(jsonify: Jsonify) {
    return this.extractInfo(UserExtractInfoType.Private, jsonify);
  }

  public extractInfo<
    Type extends UserExtractInfoType,
    Jsonify extends boolean = false,
  >(
    type: Type,
    jsonify?: Jsonify,
  ): Jsonify extends true
    ? FormattedJsonType<UserExtractInfoTypeMap[Type]>
    : UserExtractInfoTypeMap[Type] {
    // Copy user object
    const res = { ...this, id: this.id.toString() } as Partial<UserFields>;

    // Delete system info
    delete res.mfa_enabled;
    delete res.email_verified;

    // Delete private info
    if (type !== UserExtractInfoType.Private) {
      delete res.email;
      delete res.date_of_birth;
      delete res.phone_number;
    }

    if (jsonify) {
      // TODO: fix typings problem
      return EnhancedJSON.jsonify<UserExtractInfoTypeMap[Type]>(
        res as UserExtractInfoTypeMap[Type],
      ) as Jsonify extends true
        ? FormattedJsonType<UserExtractInfoTypeMap[Type]>
        : UserExtractInfoTypeMap[Type];
    }

    // TODO: fix typings problem
    return res as UserExtractInfoTypeMap[Type] as Jsonify extends true
      ? FormattedJsonType<UserExtractInfoTypeMap[Type]>
      : UserExtractInfoTypeMap[Type];
  }
}
