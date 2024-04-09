import { ConfigService as NestConfigService } from '@nestjs/config';
import { IAppConfig } from './config.interface';

declare module '@nestjs/config' {
  class ConfigService extends NestConfigService {
    get<K extends keyof IAppConfig>(key: K): IAppConfig[K];
  }
}
