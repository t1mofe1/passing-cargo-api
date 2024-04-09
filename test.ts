/* eslint-disable @typescript-eslint/no-explicit-any */
import typia from 'typia';

interface IMember {
  /**
   * @format uuid
   */
  id: string;

  /**
   * @format email
   */
  email: string;

  /**
   * @type uint
   * @minimum 20
   * @exclusiveMaximum 100
   */
  age: number;
  parent: IMember | null;
  children: IMember[];
}

// ---- ASSERT-STRINGIFY ----
const assertStringifyMember = (input: any): string => {
  const assert = (input: any): IMember => {
    const __is = (input: any): input is IMember => {
      const $is_uuid = (typia.createAssertStringify as any).is_uuid;
      const $is_email = (typia.createAssertStringify as any).is_email;
      const $io0 = (input: any): boolean =>
        'string' === typeof input.id &&
        $is_uuid(input.id) &&
        'string' === typeof input.email &&
        $is_email(input.email) &&
        'number' === typeof input.age &&
        parseInt(input.age) === input.age &&
        0 <= input.age &&
        20 <= input.age &&
        100 > input.age &&
        (null === input.parent ||
          ('object' === typeof input.parent &&
            null !== input.parent &&
            $io0(input.parent))) &&
        Array.isArray(input.children) &&
        input.children.every(
          (elem: any) =>
            'object' === typeof elem && null !== elem && $io0(elem),
        );
      return 'object' === typeof input && null !== input && $io0(input);
    };
    if (false === __is(input))
      ((
        input: any,
        _path: string,
        _exceptionable: boolean = true,
      ): input is IMember => {
        const $guard = (typia.createAssertStringify as any).guard;
        const $is_uuid = (typia.createAssertStringify as any).is_uuid;
        const $is_email = (typia.createAssertStringify as any).is_email;
        const $ao0 = (
          input: any,
          _path: string,
          _exceptionable: boolean = true,
        ): boolean =>
          (('string' === typeof input.id &&
            ($is_uuid(input.id) ||
              $guard(_exceptionable, {
                path: _path + '.id',
                expected: 'string (@format uuid)',
                value: input.id,
              }))) ||
            $guard(_exceptionable, {
              path: _path + '.id',
              expected: 'string',
              value: input.id,
            })) &&
          (('string' === typeof input.email &&
            ($is_email(input.email) ||
              $guard(_exceptionable, {
                path: _path + '.email',
                expected: 'string (@format email)',
                value: input.email,
              }))) ||
            $guard(_exceptionable, {
              path: _path + '.email',
              expected: 'string',
              value: input.email,
            })) &&
          (('number' === typeof input.age &&
            (parseInt(input.age) === input.age ||
              $guard(_exceptionable, {
                path: _path + '.age',
                expected: 'number (@type uint)',
                value: input.age,
              })) &&
            (0 <= input.age ||
              $guard(_exceptionable, {
                path: _path + '.age',
                expected: 'number (@type uint)',
                value: input.age,
              })) &&
            (20 <= input.age ||
              $guard(_exceptionable, {
                path: _path + '.age',
                expected: 'number (@minimum 20)',
                value: input.age,
              })) &&
            (100 > input.age ||
              $guard(_exceptionable, {
                path: _path + '.age',
                expected: 'number (@exclusiveMaximum 100)',
                value: input.age,
              }))) ||
            $guard(_exceptionable, {
              path: _path + '.age',
              expected: 'number',
              value: input.age,
            })) &&
          (null === input.parent ||
            ((('object' === typeof input.parent && null !== input.parent) ||
              $guard(_exceptionable, {
                path: _path + '.parent',
                expected: '(IMember | null)',
                value: input.parent,
              })) &&
              $ao0(input.parent, _path + '.parent', true && _exceptionable)) ||
            $guard(_exceptionable, {
              path: _path + '.parent',
              expected: '(IMember | null)',
              value: input.parent,
            })) &&
          (((Array.isArray(input.children) ||
            $guard(_exceptionable, {
              path: _path + '.children',
              expected: 'Array<IMember>',
              value: input.children,
            })) &&
            input.children.every(
              (elem: any, _index1: number) =>
                ((('object' === typeof elem && null !== elem) ||
                  $guard(_exceptionable, {
                    path: _path + '.children[' + _index1 + ']',
                    expected: 'IMember',
                    value: elem,
                  })) &&
                  $ao0(
                    elem,
                    _path + '.children[' + _index1 + ']',
                    true && _exceptionable,
                  )) ||
                $guard(_exceptionable, {
                  path: _path + '.children[' + _index1 + ']',
                  expected: 'IMember',
                  value: elem,
                }),
            )) ||
            $guard(_exceptionable, {
              path: _path + '.children',
              expected: 'Array<IMember>',
              value: input.children,
            }));
        return (
          ((('object' === typeof input && null !== input) ||
            $guard(true, {
              path: _path + '',
              expected: 'IMember',
              value: input,
            })) &&
            $ao0(input, _path + '', true)) ||
          $guard(true, {
            path: _path + '',
            expected: 'IMember',
            value: input,
          })
        );
      })(input, '$input', true);
    return input;
  };

  const stringify = (input: IMember): string => {
    const $io0 = (input: any): boolean =>
      'string' === typeof input.id &&
      $is_uuid(input.id) &&
      'string' === typeof input.email &&
      $is_email(input.email) &&
      'number' === typeof input.age &&
      parseInt(input.age) === input.age &&
      0 <= input.age &&
      20 <= input.age &&
      100 > input.age &&
      (null === input.parent ||
        ('object' === typeof input.parent &&
          null !== input.parent &&
          $io0(input.parent))) &&
      Array.isArray(input.children) &&
      input.children.every(
        (elem: any) => 'object' === typeof elem && null !== elem && $io0(elem),
      );
    const $string = (typia.createAssertStringify as any).string;
    const $is_uuid = (typia.createAssertStringify as any).is_uuid;
    const $is_email = (typia.createAssertStringify as any).is_email;
    const $so0 = (input: any): any =>
      `{"id":${$string(input.id)},"email":${$string(input.email)},"age":${
        input.age
      },"parent":${
        null !== input.parent ? $so0(input.parent) : 'null'
      },"children":${`[${input.children
        .map((elem: any) => $so0(elem))
        .join(',')}]`}}`;
    return $so0(input);
  };

  return stringify(assert(input));
};
