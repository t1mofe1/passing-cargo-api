import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwilioService as TwilioClientService } from 'nestjs-twilio';

type MessageListInstanceCreateOptions = Parameters<
  InstanceType<typeof TwilioClientService>['client']['messages']['create']
>[0];

type ScheduleProps = Pick<
  MessageListInstanceCreateOptions,
  'sendAt' | 'scheduleType'
>;
type SenderProps = Pick<
  MessageListInstanceCreateOptions,
  'from' | 'messagingServiceSid'
>;

type SendMessageProps = {
  /** The text of the message you want to send. Can be up to 1,600 characters in length. */
  text: string;
  /** The destination phone number in [E.164](https://www.twilio.com/docs/glossary/what-e164) format for SMS/MMS or [Channel user address](https://www.twilio.com/docs/sms/channels#channel-addresses) for other 3rd-party channels. */
  to: string;
  /** If set to True, Twilio will deliver the message as a single MMS message, regardless of the presence of media. */
  mms?: boolean;
  /** The time that Twilio will send the message. */
  schedule_time?: Date;
};

@Injectable()
export class TwilioService {
  private messagingServiceSid = this.configService.get(
    'TWILIO_MESSAGING_SERVICE_SID',
  );
  private isTestAccount = this.configService.get('TWILIO_TEST_ACCOUNT');
  private testAccountNumber = this.configService.get(
    'TWILIO_TEST_ACCOUNT_PHONE_NUMBER',
  );

  private readonly twilioService: TwilioClientService['client'];

  constructor(
    private readonly configService: ConfigService,
    twilioService: TwilioClientService,
  ) {
    this.twilioService = twilioService.client;
  }

  public async sendMessage(props: SendMessageProps) {
    const { text, to, mms, schedule_time } = props;

    const sendAsMms = !!mms;

    const scheduleObj: ScheduleProps = schedule_time
      ? { sendAt: schedule_time, scheduleType: 'fixed' }
      : {};

    if (this.isTestAccount && Object.keys(scheduleObj).length > 0) {
      throw new Error(
        'You cannot schedule messages when using a test account.',
      );
    }

    const senderObj: SenderProps = this.isTestAccount
      ? { from: this.testAccountNumber }
      : { messagingServiceSid: this.messagingServiceSid };

    return this.twilioService.messages.create({
      body: text,
      to,
      sendAsMms,
      ...senderObj,
      ...scheduleObj,
    });
  }
}
