import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CancelablePromise,
  Listener as EEListener,
  WaitForOptions as EEWaitForOptions,
  EventAndListener,
} from 'eventemitter2';
import { SystemEvents } from './events/system';

export type Events = {
  SYSTEM: SystemEvents;
  USER: object; // TODO: change to UserEvents
  ALL: Events['SYSTEM'];
};
export const Events = {
  SYSTEM: SystemEvents,
  USER: {} as const, // TODO: change to UserEvents
  ALL: {
    ...SystemEvents,
    // ...UserEvents,
  } as const,
} as const;

export type EventType = keyof Events;
export enum EventTypes {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
  ALL = 'ALL',
}
export type EventName<EType extends EventType> = keyof Events[EType];

export type EventPayload<
  EType extends EventType,
  EName extends EventName<EType>,
> = Events[EType][EName];
export type EventCallback<
  EType extends EventType,
  EName extends EventName<EType>,
> = (event: EventPayload<EType, EName>) => void;
export type OnAnyCallback<EType extends EventType> = <
  EName extends EventName<EType>,
>(
  event: EName,
  payload: EventPayload<EType, EName>,
) => void;
export type WaitForOptions<
  EType extends EventType,
  EName extends EventName<EType>,
> = {
  timeout?: number;
  filter?: (event: EName, payload: EventPayload<EType, EName>) => boolean;
};
export type Listener<
  EType extends EventType,
  EName extends EventName<EType>,
> = {
  event: EName;
  listener: EventCallback<EType, EName>;
  emitter: EventEmitterService;
  off(): void;
};
export type AnyListener<EType extends EventType> = {
  type: EType;
  listener: OnAnyCallback<EType>;
  emitter: EventEmitterService;
  off(): void;
};

@Injectable()
export class EventEmitterService {
  logger = new Logger('EventEmitter');

  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit<EName extends EventName<'ALL'>>(
    eventName: EName,
    payload: EventPayload<'ALL', EName>,
  ) {
    this.logger.debug(`emit: ${eventName} | ${JSON.stringify(payload)}`);
    this.eventEmitter.emit(eventName, payload);
  }

  on<EName extends EventName<'ALL'>>(
    eventName: EName,
    callback: EventCallback<'ALL', EName>,
  ) {
    const listener = this.eventEmitter.on(eventName, callback, {
      objectify: true,
    }) as EEListener;

    return {
      event: eventName,
      listener: callback,
      emitter: this,
      off: () => {
        listener.off();
      },
    } as Listener<'ALL', EName>;
  }

  once<EName extends EventName<'ALL'>>(
    eventName: EName,
    callback: EventCallback<'ALL', EName>,
  ) {
    const listener = this.eventEmitter.once(eventName, callback, {
      objectify: true,
    }) as EEListener;

    return {
      event: eventName,
      listener: callback,
      emitter: this,
      off: () => {
        listener.off();
      },
    } as Listener<'ALL', EName>;
  }

  off<EName extends EventName<'ALL'>>(
    eventName: EName,
    callback: EventCallback<'ALL', EName>,
  ) {
    this.eventEmitter.off(eventName, callback);
  }

  many<EName extends EventName<'ALL'>>(
    eventName: EName,
    timesToListen: number,
    callback: EventCallback<'ALL', EName>,
  ) {
    const listener = this.eventEmitter.many(
      eventName,
      timesToListen,
      callback,
      {
        objectify: true,
      },
    ) as EEListener;

    return {
      event: eventName,
      listener: callback,
      emitter: this,
      off: () => {
        listener.off();
      },
    } as Listener<'ALL', EName>;
  }

  removeAllListeners<EName extends EventName<'ALL'>>(eventName: EName) {
    this.eventEmitter.removeAllListeners(eventName);
  }

  onAny<EType extends EventType>(type: EType, callback: OnAnyCallback<EType>) {
    const _callback: OnAnyCallback<EType> = <EName extends EventName<EType>>(
      event: EName,
      payload: EventPayload<EType, EName>,
    ) => {
      this.logger.debug(
        `onAny: ${type} | ${event as string} | ${JSON.stringify(payload)}`,
      );

      // TODO: Fix this
      // if (
      //   type === 'ALL' ||
      //   type === Events['ALL'][event as string].EVENT_TYPE
      // ) {
      //   return callback(event, payload);
      // }
    };

    this.eventEmitter.onAny(_callback as EventAndListener);

    return {
      type,
      listener: _callback,
      emitter: this,
      off: () => {
        this.eventEmitter.offAny(_callback as EventAndListener);
      },
    } as AnyListener<EType>;
  }

  waitFor<EName extends EventName<'ALL'>>(
    eventName: EName,
    options?: WaitForOptions<'ALL', EName>,
  ) {
    return this.eventEmitter.waitFor(
      eventName,
      options as EEWaitForOptions,
    ) as unknown as CancelablePromise<EventPayload<'ALL', EName>>;
  }
}
