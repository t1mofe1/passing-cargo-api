import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtTokenPayload } from '../../interfaces/jwt/JwtTokenPayload.interface';
import { UsersService } from '../../modules/users/users.service';

export const JwtAccessTokenStrategyName = 'jwt-access';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  JwtAccessTokenStrategyName,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const jwtAccessSecret = configService.get('JWT_ACCESS_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtAccessSecret,
    });
  }

  async validate(payload: JwtTokenPayload) {
    return this.usersService.getById(payload.userId);
  }
}
