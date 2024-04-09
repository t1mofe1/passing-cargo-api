import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isPhoneNumber } from 'class-validator';
import { authenticator, totp } from 'otplib';
import User from '../../../models/User.model';
import { generateSmsAuthCode } from '../../../utils/numberStringGenerate';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MfaAuthService {
  private readonly mfaServiceName = this.configService.get('MFA_SERVICE_NAME');

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  // #region totp
  public async generateMfaAuthSecret(user: User) {
    const secret = authenticator.generateSecret();

    const accountName = `${user.first_name} ${user.last_name}`;

    const totpAuthUrl = totp.keyuri(accountName, this.mfaServiceName, secret);

    // TODO: Uncomment this when the database is ready
    // await this.usersService.setMfaAuthSecret(secret, user.id);

    return {
      secret,
      totpAuthUrl,
    };
  }
  public async isMfaAuthCodeValid(mfaAuthCode: string, user: User) {
    const userSecurity = await this.prismaService.userSecurity.findFirst({
      where: { user: { id: user.id.toBigInt() } },
    });

    if (!userSecurity) {
      throw new Error('User security not found');
    }
    if (!userSecurity.mfa_secret) {
      throw new Error('User does not have an MFA secret');
    }

    return totp.verify({
      token: mfaAuthCode,
      secret: userSecurity.mfa_secret,
    });
  }
  // #endregion totp

  // #region sms
  public async generateSmsAuthCode(phoneNumber: string) {
    if (!isPhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number');
    }

    const code = generateSmsAuthCode();

    const user = await this.prismaService.user.update({
      data: {
        user_security: {
          update: {
            sms_code: code,
            sms_code_expires_at: new Date(
              Date.now() + 1000 * 60 * 5 + 30 * 1000,
            ), // 5 minutes + 30 seconds reserve
          },
        },
      },
      where: { phone_number: phoneNumber },
    });

    return code;
  }
  public async isSmsAuthCodeValid(phoneNumber: string, code: string) {
    if (!isPhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number');
    }

    const user = await this.prismaService.user.findFirst({
      where: { phone_number: phoneNumber },
      select: {
        user_security: {
          select: { sms_code: true, sms_code_expires_at: true },
        },
      },
    });

    if (!user) {
      throw new Error('Invalid phone number');
    }
    if (!user.user_security) {
      throw new Error('User security not found');
    }
    if (
      !user.user_security.sms_code ||
      !user.user_security.sms_code_expires_at
    ) {
      throw new Error('SMS code not found');
    }
    if (user.user_security.sms_code_expires_at.getTime() < Date.now()) {
      throw new Error('SMS code expired');
    }
    if (user.user_security.sms_code !== code) {
      throw new Error('SMS code is incorrect');
    }

    return true;
  }
  // #endregion sms
}
