import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtTokenPayload } from '../../interfaces/jwt/JwtTokenPayload.interface';
import { UsersService } from '../../modules/users/users.service';

export const JwtRefreshTokenStrategyName = 'jwt-access';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  JwtRefreshTokenStrategyName,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const jwtRefreshSecret = configService.get('JWT_REFRESH_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtRefreshSecret,
    });
  }

  async validate(payload: JwtTokenPayload) {
    return this.usersService.getById(payload.userId);
  }
}
