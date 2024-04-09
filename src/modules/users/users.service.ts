import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthProviders } from '@prisma/client';
import { JwtTokenPayload } from '../../interfaces/jwt/JwtTokenPayload.interface';
import User from '../../models/User.model';
import { Snowflake, SnowflakeResolvable } from '../../utils/Snowflake';
import { generateUserAvatarHash } from '../../utils/numberStringGenerate';
import { RegisterDto } from '../authn/dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  private readonly jwtAccessSecret =
    this.configService.get('JWT_ACCESS_SECRET');
  private readonly jwtRefreshSecret =
    this.configService.get('JWT_REFRESH_SECRET');

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // #region Getters
  async getAll() {
    return this.prismaService.user
      .findMany()
      .then((users) => users.map((user) => new User(user)));
  }
  async getByEmail(email: string): Promise<User | null> {
    return this.prismaService.user
      .findUnique({ where: { email } })
      .then((user) => (user ? new User(user) : null));
  }
  async getById(userId: Snowflake | SnowflakeResolvable): Promise<User | null> {
    const id = userId instanceof Snowflake ? userId : new Snowflake(userId);

    return this.prismaService.user
      .findUnique({ where: { id: id.toBigInt() } })
      .then((user) => (user ? new User(user) : null));
  }
  async getByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.prismaService.user
      .findUnique({
        where: { phone_number: phoneNumber },
      })
      .then((user) => (user ? new User(user) : null));
  }
  async getByAuthProvider(
    provider: AuthProviders,
    uid: string,
  ): Promise<User | null> {
    return this.prismaService.authProvider
      .findFirst({
        where: { provider, uid },
        select: { user: true },
      })
      .then((authProvider) =>
        authProvider?.user ? new User(authProvider.user) : null,
      );
  }
  async getByAccessToken(token: string) {
    const jwtPayload: JwtTokenPayload = this.jwtService.verify(token, {
      secret: this.jwtAccessSecret,
    });

    if (!jwtPayload.userId) {
      throw new BadRequestException('Invalid token');
    }

    return this.getById(jwtPayload.userId);
  }
  async getByRefreshToken(token: string) {
    const jwtPayload: JwtTokenPayload = this.jwtService.verify(token, {
      secret: this.jwtRefreshSecret,
    });

    if (!jwtPayload.userId) {
      throw new BadRequestException('Invalid token');
    }

    return this.getById(jwtPayload.userId);
  }
  // #endregion Getters

  async create(registerDto: RegisterDto) {
    const { code: sms_code, ...registerData } = registerDto;

    const user_id = Snowflake.generate();
    const user_security_id = Snowflake.generate();

    const user = await this.prismaService.user
      .create({
        data: {
          id: user_id.toBigInt(),
          ...registerData,
          user_security: { create: { id: user_security_id.toBigInt() } },
        },
      })
      .then((user) => new User(user));

    return user;
  }

  // #region Modifiers
  async updateMfaAuthSecret(
    userId: Snowflake | SnowflakeResolvable,
    secret: string | null,
  ) {
    const id = userId instanceof Snowflake ? userId : new Snowflake(userId);

    const user = await this.prismaService.user
      .update({
        where: { id: id.toBigInt() },
        data: { user_security: { update: { mfa_secret: secret } } },
      })
      .then((user) => new User(user));

    return user;
  }
  async updateAvatar(
    userId: Snowflake | SnowflakeResolvable,
    file: Express.Multer.File,
  ) {
    const id = userId instanceof Snowflake ? userId : new Snowflake(userId);

    if (!file.mimetype.includes('image')) {
      return new BadRequestException('Provide a valid image');
    }

    // const avatarMaxSize = this.configService.get<number>(
    //   user.premium ? 'avatarMaxSizePremium' : 'avatarMaxSize',
    // );

    // if (file.size > avatarMaxSize) {
    //   return new BadRequestException('Too large file');
    // }

    const avatarHash = generateUserAvatarHash();

    // await this.cdnService.upload(CDN_ENPOINTS.AVATAR, file);

    const user = await this.prismaService.user
      .update({
        where: { id: id.toBigInt() },
        data: { avatar: avatarHash },
      })
      .then((user) => new User(user));

    return user;
  }
  // #endregion Modifiers
}
