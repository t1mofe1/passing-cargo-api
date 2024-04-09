// import { SystemUser } from '../../../../models/user.model';
import { SnowflakeResolvable } from '../../../../utils/Snowflake';
import { ChatexEvent } from '../chatexEvent';

type AuthTokensPairAndCode = {
  accessToken: string;
  refreshToken: string;
  code: string;
  expiresIn: number;
};

export class UserLoginEvent extends ChatexEvent {
  static EVENT_NAME = 'USER_LOGIN' as const;
  static EVENT_TYPE = 'SERVER' as const;

  constructor(
    public readonly user: // SystemUser |
    SnowflakeResolvable,
    public readonly authCredentials: AuthTokensPairAndCode,
  ) {
    super();
  }
}
