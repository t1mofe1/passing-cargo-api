import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule as TwilioClientModule } from 'nestjs-twilio';
import { TwilioService } from './twilio.service';

@Module({
  imports: [
    ConfigModule,
    TwilioClientModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        accountSid: configService.get('TWILIO_ACCOUNT_SID'),
        authToken: configService.get('TWILIO_AUTH_TOKEN'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TwilioService],
  exports: [TwilioService],
})
export class TwilioModule {}
