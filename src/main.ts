import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/allExceptions.filter';
// import { ChatexWsAdapter } from './modules/gateway/chatexWsAdapter';
import fastifyHelmet from '@fastify/helmet';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { NestLogger } from './logger/nest-logger';
import { clusterize } from './utils/clusterize';

async function bootstrap() {
  const logger = new NestLogger({
    // muteCategories: ['InstanceLoader', 'RoutesResolver', 'RouterExplorer'],
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger, abortOnError: false },
  );

  const configService = app.get(ConfigService);

  const currentDir = process.cwd();

  const nodeEnv = configService.get('NODE_ENV');
  const port = configService.get('HTTP_PORT');
  const domain = configService.get('DOMAIN');

  // Nest app setup
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
      enableDebugMessages: nodeEnv === 'development',
    }),
  );
  app.useLogger(logger);
  app.useStaticAssets({ root: `${currentDir}/public` });
  // app.useWebSocketAdapter(new ChatexWsAdapter(app));

  // Fastify options
  await app.register(fastifyHelmet, { contentSecurityPolicy: false });

  // #region Documentation
  const docs = JSON.parse(fs.readFileSync('./swagger.json').toString() || '{}');
  docs.servers = [{ url: `http://${domain}:${port}`, description: `Local` }];
  SwaggerModule.setup('docs', app, docs);
  // #endregion Documentation

  await app.listen(port, async () => {
    logger.log(
      `Application is running on: ${await app.getUrl()}`,
      'NestApplication',
    );
  });
}

// cluster on production
process.env.NODE_ENV === 'production' ? clusterize(bootstrap) : bootstrap();
