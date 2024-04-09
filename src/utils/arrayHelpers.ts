export function removeDuplicatesFromArray<T>(array: T[]): T[] {
  return [...new Set(array)];
}
