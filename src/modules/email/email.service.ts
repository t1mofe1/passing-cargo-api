import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPPool from 'nodemailer/lib/smtp-pool';
import User from '../../models/User.model';
import { PrismaService } from '../prisma/prisma.service';
import { userConfirmationEmailTemplate } from './templates/userConfirmation.template';

@Injectable()
export default class EmailService {
  private readonly mailer: Transporter<SMTPPool.SentMessageInfo>;

  private readonly mailAuthUser = this.configService.get('MAIL_AUTH_USER');
  private readonly mailAuthPass = this.configService.get('MAIL_AUTH_PASS');
  private readonly mailHost = this.configService.get('MAIL_HOST');
  private readonly mailPort = this.configService.get('MAIL_PORT');

  private readonly domain = this.configService.get('DOMAIN');

  private readonly jwtConfirmationExpirationTime = this.configService.get(
    'JWT_CONFIRMATION_EXPIRATION_TIME',
  );

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.mailer = createTransport({
      pool: true,
      auth: {
        user: this.mailAuthUser,
        pass: this.mailAuthPass,
      },
      host: this.mailHost,
      port: this.mailPort,
    });
  }

  async sendMail(options: SMTPPool.MailOptions) {
    return this.mailer.sendMail(options, (err, info) => {
      if (err) {
        console.error(err);
      }

      console.log(info);
    });
  }

  async sendUserConfirmationEmail(emailOrUser: string | User, token: string) {
    const prismaUser =
      typeof emailOrUser === 'string'
        ? await this.prismaService.user.findUnique({
            where: { email: emailOrUser },
          })
        : emailOrUser;
    if (!prismaUser) {
      // TODO: Create error class
      throw new Error('User not found');
    }

    const user = new User(prismaUser);

    if (!user.email) {
      // TODO: Create error class
      throw new Error('User does not have an email');
    }

    const confirmUrl = `https://${this.domain}/api/auth/email-confirm/${token}`;
    const expTime = this.jwtConfirmationExpirationTime / 60;

    const { subject, html, text } = userConfirmationEmailTemplate({
      confirmUrl,
      expirationTime: expTime,
      user,
    });

    const options: Mail.Options = {
      from: { address: this.mailAuthUser, name: 'Passing Cargo' },
      to: {
        address: user.email,
        name: `${user.first_name} ${user.last_name}`,
      },
      subject,
      text,
      html,
    };

    return this.sendMail(options);
  }
}
