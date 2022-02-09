const RE_TRIMLINES = /(.+)(\n|\r\n)?/g;
const CHAR_CODE_0 = '0'.charCodeAt(0);
const CHAR_CODE_9 = '9'.charCodeAt(0);
const CHAR_CODE_a = 'a'.charCodeAt(0);
const CHAR_CODE_z = 'z'.charCodeAt(0);
const CHAR_CODE_A = 'A'.charCodeAt(0);
const CHAR_CODE_Z = 'Z'.charCodeAt(0);

export function trimlines(str: string, separator = ''): string {
  if (!str) {
    return '';
  }

  let index = 0;
  const output: string[] = [];

  while (index < str.length && index !== -1) {
    const matches = RE_TRIMLINES.exec(str);

    if (!matches) {
      break;
    }

    index = matches.index;
    output.push(matches[0].trim());
  }

  return output.join(separator);
}

export function toKebabCase(str: string): string {
  return str.split('').reduce((tokens, char, index) => {
    const code = char.charCodeAt(0);

    if (code >= CHAR_CODE_A && code <= CHAR_CODE_Z) {
      if (index && tokens[index - 1] != '-') {
        tokens.push('-');
      }

      tokens.push(String.fromCharCode(code + 32));
    } else if ((code >= CHAR_CODE_a && code <= CHAR_CODE_z) || (code >= CHAR_CODE_0 && code <= CHAR_CODE_9)) {
      tokens.push(char);
    } else {
      tokens.push('-');
    }

    return tokens;
  }, [] as string[]).join('');
}

export function unCamelCase(str: string, separator = ' ') {
  const lowercase = str.toLowerCase();
  const chars: string[] = [];

  for (let i = 0; i < str.length; i++) {
    const charLower = lowercase.charAt(i);
    const charString = str.charAt(i);

    if (charString !== charLower) {
      chars.push(separator);
    }

    chars.push(charLower);
  }

  return chars.join('');
}
