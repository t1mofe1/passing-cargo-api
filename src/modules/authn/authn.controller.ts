import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { JwtToken } from '../../decorators/jwtToken.decorator';
import { JwtAccessGuard } from '../../guards/jwt-access.guard';
import { JwtRefreshGuard } from '../../guards/jwt-refresh.guard';
import RequestWithUser from '../../interfaces/req/requestWithUser.interface';
import { UserPrivateInfo } from '../../models/User.model';
import { AuthnService } from './authn.service';
import { AuthSessionCreateDto } from './dto/authSessionCreate.dto';
import { AuthSessionCreateResult } from './dto/authSessionCreateResult.dto';
import { GetSmsToken } from './dto/getSmsToken.dto';
import { RegisterDto } from './dto/register.dto';
import { SmsTokenResult } from './dto/smsTokenResult.dto';

@Controller('auth')
export class AuthnController {
  constructor(private readonly authnService: AuthnService) {}

  // @TypedRoute.Post('register')
  @Post('register')
  async register(@TypedBody() registrationData: RegisterDto) {
    const user = await this.authnService.register(registrationData);

    return user.extractPrivateInfo(true);
  }

  @HttpCode(200)
  // @TypedRoute.Post('email-confirm/:tokn')
  @Post('email-confirm/:tokn')
  async confirmEmail(
    @TypedParam('token') token: string,
  ): Promise<UserPrivateInfo> {
    const user = await this.authnService.confirmEmail(token);

    return user.extractPrivateInfo(true);
  }

  @HttpCode(200)
  // @TypedRoute.Post('sms-token')
  @Post('sms-token')
  async requestSmsToken(
    @TypedBody() getSmsTokenDto: GetSmsToken,
  ): Promise<SmsTokenResult> {
    const payload = await this.authnService.requestVerificationSms(
      getSmsTokenDto.phone_number,
    );

    return payload;
  }

  // #region sessions
  @HttpCode(200)
  @UseGuards(JwtAccessGuard)
  // @TypedRoute.Post('session-start')
  @Post('session-start')
  async sessionStart(
    @TypedBody() authSessionCreateDto: AuthSessionCreateDto,
  ): Promise<AuthSessionCreateResult> {
    const { jwt } = await this.authnService.startAuthSession(
      authSessionCreateDto,
    );

    return jwt;
  }

  @HttpCode(200)
  @UseGuards(JwtRefreshGuard)
  // @TypedRoute.Post('session-refresh')
  @Post('session-refresh')
  async sessionRefresh(
    @Req() req: RequestWithUser,
    @JwtToken() refreshToken: string,
  ): Promise<AuthSessionCreateResult> {
    const { jwt } = await this.authnService.refreshAuthSession({
      refreshToken,
      userId: req.user.id.toString(),
    });

    return jwt;
  }

  @HttpCode(200)
  @UseGuards(JwtAccessGuard)
  // @TypedRoute.Post('session-end')
  @Post('session-end')
  async sessionEnd(
    @Req() req: RequestWithUser,
    @JwtToken() accessToken: string,
  ) {
    const { user } = await this.authnService.endAuthSession({
      accessToken,
      userId: req.user.id.toString(),
    });
  }
  // #endregion sessions
}
