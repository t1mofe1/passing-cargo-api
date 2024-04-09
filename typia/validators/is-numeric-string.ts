import typia from 'typia';

typia.customValidators.insert('numeric_string')('string')(
  () => (value: string) => !isNaN(Number(value)),
);
