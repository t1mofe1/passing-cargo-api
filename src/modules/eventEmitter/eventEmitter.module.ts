import { Module } from '@nestjs/common';
import { EventEmitterModule as NestEventEmitterModule } from '@nestjs/event-emitter';
import { EventEmitterService } from './eventEmitter.service';

@Module({
  imports: [
    NestEventEmitterModule.forRoot({
      maxListeners: 0,
    }),
  ],
  providers: [EventEmitterService],
  exports: [EventEmitterService],
})
export class EventEmitterModule {}
