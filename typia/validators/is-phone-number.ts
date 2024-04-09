import typia from 'typia';

const regex =
  /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/;

typia.customValidators.insert('phone_number')('string')(
  // TODO: Maybe add a check for the country code through arg parameter
  (arg) => (value: string) => regex.test(value),
);
