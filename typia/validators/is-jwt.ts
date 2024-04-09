import typia from 'typia';

const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

typia.customValidators.insert('jwt')('string')(
  () => (value: string) => jwtRegex.test(value),
);
