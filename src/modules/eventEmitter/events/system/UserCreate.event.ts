// import { SystemUser } from '../../../../models/user.model';
import { SnowflakeResolvable } from '../../../../utils/Snowflake';
import { ChatexEvent } from '../chatexEvent';

export class UserCreateEvent extends ChatexEvent {
  static EVENT_NAME = 'USER_CREATE' as const;
  static EVENT_TYPE = 'SERVER' as const;

  constructor(
    public readonly user: // SystemUser |
    SnowflakeResolvable,
  ) {
    super();
  }
}
