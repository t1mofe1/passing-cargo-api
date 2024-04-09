export function removeExtraSpaces(string: string) {
  return string.replace(/\s+/g, ' ');
}

export function removeAllSpaces(string: string) {
  return string.replace(/\s+/g, '');
}

export function replaceAllSpaces(string: string, replacement: string) {
  return string.replace(/\s+/g, replacement);
}

export function replaceCharacter(
  string: string,
  character: string,
  replacement: string,
) {
  return string.replace(character, replacement);
}

export function uppercaseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
