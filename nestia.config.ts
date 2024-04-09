import { INestiaConfig } from '@nestia/sdk';

const config: INestiaConfig = {
  json: true,
  input: 'src/modules/**/*.controller.ts',
  assert: true,
  swagger: {
    output: './swagger.json',
    security: {
      bearer: { type: 'http', scheme: 'bearer' },
    },
  },
};
export default config;
