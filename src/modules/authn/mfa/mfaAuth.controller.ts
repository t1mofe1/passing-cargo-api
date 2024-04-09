import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import {
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAccessGuard } from '../../../guards/jwt-access.guard';
import RequestWithUser from '../../../interfaces/req/requestWithUser.interface';
import { MfaAuthService } from '../mfa/mfaAuth.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { MfaEnableResult } from './dto/mfaEnableResult.dto';

@Controller('mfa')
// @UseInterceptors(ClassSerializerInterceptor)
export class MfaAuthController {
  constructor(private readonly mfaAuthService: MfaAuthService) {}

  // #region manage mfa status
  @HttpCode(200)
  @UseGuards(JwtAccessGuard)
  // @TypedRoute.Post('enable/:type')
  @Post('enable/:type')
  async enableMfa(
    @TypedParam('type') type: 'totp' | 'sms',
    @Req() req: RequestWithUser,
  ): Promise<MfaEnableResult> {
    if (type === 'totp') {
      const { totpAuthUrl } = await this.mfaAuthService.generateMfaAuthSecret(
        req.user,
      );

      // TODO: Set totp_mfa to true in user

      return { totpAuthUrl };
    } else if (type === 'sms') {
      // TODO: Set sms_mfa to true in user
    }
  }

  @HttpCode(200)
  @UseGuards(JwtAccessGuard)
  // @TypedRoute.Post('disable/:type')
  @Post('disable/:type')
  async disableMfa(
    @TypedParam('type') type: 'totp' | 'sms',
    @Req() req: RequestWithUser,
  ) {
    if (type === 'totp') {
      // TODO: Set mfa_totp to false in user and remove secret
    } else if (type === 'sms') {
      // TODO: Set mfa_sms to false in user
    }
  }
  // #endregion manage mfa status

  @HttpCode(200)
  @UseGuards(JwtAccessGuard)
  // @TypedRoute.Post('sms')
  @Post('sms')
  async authSms(
    @Req() req: RequestWithUser,
    // @TypedBody() authenticateDto: AuthenticateDto,
  ) {
    // const isCodeValid = this.mfaAuthService.isMfaAuthCodeValid(
    //   authenticateDto.mfaAuthCode,
    //   req.user,
    // );
    // if (!isCodeValid) {
    //   throw new UnauthorizedException('Wrong mfa code');
    // }
  }

  @HttpCode(200)
  @UseGuards(JwtAccessGuard)
  // @TypedRoute.Post('totp')
  @Post('totp')
  async authMfa(
    @Req() req: RequestWithUser,
    @TypedBody() authenticateDto: AuthenticateDto,
  ) {
    const isCodeValid = this.mfaAuthService.isMfaAuthCodeValid(
      authenticateDto.mfaAuthCode,
      req.user,
    );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong mfa code');
    }
  }
}
