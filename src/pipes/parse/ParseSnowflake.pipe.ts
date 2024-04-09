import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Snowflake, SnowflakeResolvable } from '../../utils/Snowflake';

@Injectable()
export class ParseSnowflakePipe
  implements PipeTransform<SnowflakeResolvable, Snowflake>
{
  transform(value: SnowflakeResolvable) {
    if (!Snowflake.check(value)) {
      throw new BadRequestException('Invalid Snowflake');
    }

    return new Snowflake(value);
  }
}
