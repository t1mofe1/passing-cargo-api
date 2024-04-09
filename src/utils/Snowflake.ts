import { config } from 'dotenv';
config(); // to get env from .env file

if (!process.env.PCARGO_EPOCH) {
  throw new Error('PCARGO_EPOCH is not defined in .env file');
}

const EPOCH = BigInt(process.env.PCARGO_EPOCH);

const TIMESTAMP_BITS = 41;
const INCREMENT_BITS = 13;
const TOTAL_BITS = TIMESTAMP_BITS + INCREMENT_BITS;

let INCREMENT = BigInt(0);

export type SnowflakeResolvable = string | bigint;

interface IDeconstructedSnowflake {
  timestamp: number;
  date: Date;
  increment: number;
  binary: string;
  epoch: bigint;
}

/**
 * A {@link https://developer.twitter.com/en/docs/twitter-ids Twitter snowflake},
 * except the increment and epoch is different and worker and process id's are excluded.
 *
 * If we have a snowflake '266241948824764416' we can represent it as binary:
 *
 *  000000111011000111100001101001000101000000  00000000000000
 *  number of ms since PCargo epoch 		        increment
 */
export class Snowflake {
  public readonly id: SnowflakeResolvable;
  public readonly binary: string;
  public readonly timestamp: number;
  public readonly date: Date;
  public readonly epoch: bigint;
  public readonly increment: number;

  constructor(id: SnowflakeResolvable) {
    if (!Snowflake.check(id)) {
      throw new TypeError(`Invalid snowflake: ${id}`);
    }

    this.id = id;
    this.epoch = EPOCH;
    this.binary = BigInt(id).toString(2).padStart(TOTAL_BITS, '0');
    this.increment = Number(BigInt(id) & BigInt(2 ** INCREMENT_BITS - 1));
    this.timestamp = Number((BigInt(id) >> BigInt(INCREMENT_BITS)) + EPOCH);
    this.date = new Date(this.timestamp);
  }

  /**
   * Generates a unique PCargo snowflake.
   * @param {number|Date|string} [timestamp=Date.now()] Timestamp or date of the snowflake to generate
   * @returns {Snowflake} The generated snowflake
   */
  static generate(timestamp: number | Date | string = Date.now()): Snowflake {
    // #region type check
    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    if (typeof timestamp === 'string') timestamp = Number(timestamp);
    if (Number.isNaN(timestamp))
      throw new TypeError(`Provided timestamp is NaN`);
    // #endregion type check

    // #region timestamp check
    if (timestamp < EPOCH)
      throw new RangeError(
        `Timestamp is too old: ${timestamp} | EPOCH: ${EPOCH}`,
      );
    // #endregion timestamp check

    if (INCREMENT >= 2 ** INCREMENT_BITS - 1) INCREMENT = BigInt(0);

    const id = (
      ((BigInt(timestamp) - EPOCH) << BigInt(INCREMENT_BITS)) |
      INCREMENT++
    ).toString();

    return new Snowflake(id);
  }

  static check(id: SnowflakeResolvable) {
    if (typeof id !== 'bigint' && typeof id === 'string' && !/^\d+$/.test(id)) {
      return false;
    }

    const increment = Number(BigInt(id) & BigInt(2 ** INCREMENT_BITS - 1));
    const timestamp = Number((BigInt(id) >> BigInt(INCREMENT_BITS)) + EPOCH);

    if (
      increment < 0 ||
      increment > 2 ** INCREMENT_BITS - 1 ||
      timestamp < EPOCH
    ) {
      return false;
    }

    return true;
  }

  static get EPOCH() {
    return EPOCH;
  }

  valueOf() {
    return this.id.toString();
  }
  toString() {
    return this.id.toString();
  }
  toJSON() {
    return this.id.toString();
  }
  toBigInt() {
    return BigInt(this.id);
  }
  toObject(): IDeconstructedSnowflake {
    const { timestamp, date, increment, binary, epoch } = this;

    return {
      timestamp,
      date,
      increment,
      binary,
      epoch,
    };
  }
}
