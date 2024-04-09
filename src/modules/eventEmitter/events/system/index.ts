import { UserCreateEvent } from '../system/UserCreate.event';
import { UserLoginEvent } from '../system/UserLogin.event';
import { UserLogoutEvent } from '../system/UserLogout.event';

export type SystemEvents = {
  USER_CREATE: typeof UserCreateEvent;
  USER_LOGIN: typeof UserLoginEvent;
  USER_LOGOUT: typeof UserLogoutEvent;
};
export const SystemEvents = {
  [UserCreateEvent.EVENT_NAME]: UserCreateEvent,
  [UserLoginEvent.EVENT_NAME]: UserLoginEvent,
  [UserLogoutEvent.EVENT_NAME]: UserLogoutEvent,
} as const;
