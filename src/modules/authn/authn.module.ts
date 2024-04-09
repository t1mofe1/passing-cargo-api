import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessTokenStrategy } from '../../guards/strategies/jwtAccessToken.strategy';
import { JwtRefreshTokenStrategy } from '../../guards/strategies/jwtRefreshToken.strategy';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TwilioModule } from '../twilio/twilio.module';
import { UsersModule } from '../users/users.module';
import { AuthnController } from './authn.controller';
import { AuthnService } from './authn.service';
import { MfaAuthController } from './mfa/mfaAuth.controller';
import { MfaAuthService } from './mfa/mfaAuth.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({}),
    PrismaModule,
    TwilioModule,
    EmailModule,
  ],
  providers: [
    AuthnService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    MfaAuthService,
  ],
  controllers: [AuthnController, MfaAuthController],
  exports: [AuthnService, MfaAuthService],
})
export class AuthnModule {}
