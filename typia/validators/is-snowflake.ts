import typia from 'typia';
import { Snowflake } from '../../src/utils/Snowflake';

typia.customValidators.insert('snowflake')('string')(
  () => (value: string) => Snowflake.check(value),
);
typia.customValidators.insert('snowflake')('bigint')(
  () => (value: bigint) => Snowflake.check(value),
);
