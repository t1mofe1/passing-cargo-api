import { TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import typia from 'typia';

interface HelloWorldDto {
  /**
   * Random string
   */
  foo: string;

  /**
   * Random boolean
   */
  bar: boolean;

  /**
   * Random number
   *
   * @type int
   */
  baz: number;
}

@Controller()
export class AppController {
  constructor() {}

  @TypedRoute.Get('/test')
  async helloWorld(): Promise<HelloWorldDto> {
    return typia.random<HelloWorldDto>();
  }
}
