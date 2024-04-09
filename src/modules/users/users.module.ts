import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [ConfigModule, forwardRef(() => JwtModule), PrismaModule],
  providers: [UsersService],
  exports: [UsersService],
  // controllers: [UsersController],
})
export class UsersModule {}
