import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Snowflake, SnowflakeResolvable } from '../utils/Snowflake';

@ValidatorConstraint({ async: true })
export class IsSnowflakeConstraint implements ValidatorConstraintInterface {
  validate(uid: unknown, args: ValidationArguments) {
    return Snowflake.check(uid as SnowflakeResolvable);
  }
}

export function IsSnowflake(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions || {},
      validator: IsSnowflakeConstraint,
    });
  };
}
