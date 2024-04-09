import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { validationSchema } from './config/config.interface';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthnModule } from './modules/authn/authn.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      cache: true,
      envFilePath: '.env',
      validationSchema,
    }),
    AuthnModule,
    UsersModule,
    PrismaModule,
    FastifyMulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dest: join('..', configService.get('FILES_UPLOAD_DIR')),
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
