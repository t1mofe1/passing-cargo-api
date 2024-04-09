import { TypedParam } from '@nestia/core';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAccessGuard } from '../../guards/jwt-access.guard';
import RequestWithUser from '../../interfaces/req/requestWithUser.interface';
import { UserPrivateInfo } from '../../models/User.model';
import { ParseSnowflakePipe } from '../../pipes/parse/ParseSnowflake.pipe';
import { Snowflake } from '../../utils/Snowflake';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  // @Patch("@me")
  // @Get("@me/guilds")
  // @Get("@me/guilds/:id/member")
  // @Delete("@me/guilds/:id")
  // @Post("@me/channels")

  @Get('@me')
  @UseGuards(JwtAccessGuard)
  async getMe(@Req() req: RequestWithUser): Promise<UserPrivateInfo> {
    console.log({ user: req.user });

    return req.user.extractPrivateInfo(true);
  }

  @Get(':id')
  @UseGuards(JwtAccessGuard)
  async getId(
    @TypedParam('id') id: string,
  ): Promise<UserPrivateInfo | undefined> {
    if (!Snowflake.check(id)) throw new Error('Invalid Snowflake');

    const user = await this.usersService.getById(id);

    if (!user) return undefined;

    return user.extractPrivateInfo(true);
  }

  // @Patch('avatar')
  // @UseGuards(JwtAccessGuard)
  // @UseInterceptors(FileInterceptor('avatar'))
  // async addAvatar(
  //   @Req() req: RequestWithUser,
  //   @UploadedFile(
  //     'avatar',
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({ fileType: /jpg|jpeg|png|webp|gif/ })
  //       .addMaxSizeValidator({ maxSize: 1048576 * 25 /* 25MB */ })
  //       .build(),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return this.usersService.changeAvatar(req.user, file);
  // }
}
