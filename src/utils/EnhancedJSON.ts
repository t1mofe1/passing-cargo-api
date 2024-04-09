import { FormattedJsonType } from '../interfaces/formattedJson.type';

export default class EnhancedJSON {
  static jsonify<T extends Record<string, unknown>>(
    value: T,
  ): FormattedJsonType<T> {
    return EnhancedJSON.parse(EnhancedJSON.stringify(value));
  }

  /**
   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @param replacer A function that transforms the results.
   * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
   */
  static stringify(
    value: unknown,
    replacer?: (this: unknown, key: string, value: unknown) => unknown,
    space?: string | number,
  ): string;
  /**
   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @param replacer An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified.
   * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
   */
  static stringify(
    value: unknown,
    replacer?: (number | string)[] | null,
    space?: string | number,
  ): string;
  static stringify(
    value: unknown,
    replacer?:
      | ((this: unknown, key: string, value: unknown) => unknown)
      | (number | string)[]
      | null,
    space?: string | number,
  ): string {
    replacer ??= (k: string, v: unknown) => {
      if (k === '') return v;

      if (v instanceof Map) {
        return Object.fromEntries(v);
      } else if (v instanceof Set) {
        return Array.from(v);
      } else if (
        v instanceof RegExp ||
        typeof v === 'bigint' ||
        typeof v === 'symbol'
      ) {
        return v.toString();
      } else {
        return v;
      }
    };

    // TODO: Why does it throw an error with the `replacer` parameter?
    // @ts-ignore
    return JSON.stringify(value, replacer, space);
  }

  /**
   * Converts a JavaScript Object Notation (JSON) string into an object.
   * @param text A valid JSON string.
   * @param reviver A function that transforms the results. This function is called for each member of the object.
   * If a member contains nested objects, the nested objects are transformed before the parent object is.
   */
  static parse(
    text: string,
    reviver?:
      | ((this: unknown, key: string, value: unknown) => unknown)
      | undefined,
  ) {
    return JSON.parse(text, reviver);
  }
}
