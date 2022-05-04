const RE_TRIMLINES = /(.+)(\n|\r\n)?/g;
const CHAR_CODE_0 = '0'.charCodeAt(0);
const CHAR_CODE_9 = '9'.charCodeAt(0);
// eslint-disable-next-line camelcase
const CHAR_CODE_a = 'a'.charCodeAt(0);
// eslint-disable-next-line camelcase
const CHAR_CODE_z = 'z'.charCodeAt(0);
const CHAR_CODE_A = 'A'.charCodeAt(0);
const CHAR_CODE_Z = 'Z'.charCodeAt(0);

export function trimlines(str: string, separator = ''): string {
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
  const tokens: string[] = [];

  for (let index = 0; index < str.length; index++) {
    const char = str.charAt(index);
    const code = str.charCodeAt(index);

    if (code >= CHAR_CODE_A && code <= CHAR_CODE_Z) {
      if (index && tokens.at(-1) !== '-') {
        tokens.push('-');
      }

      tokens.push(String.fromCharCode(code + 32));
    // eslint-disable-next-line camelcase
    } else if ((code >= CHAR_CODE_a && code <= CHAR_CODE_z) || (code >= CHAR_CODE_0 && code <= CHAR_CODE_9)) {
      tokens.push(char);
    } else {
      tokens.push('-');
    }
  }

  return tokens.join('');
}

export function unCamelCase(str: string, separator = ' ') {
  const tokens: string[] = [];

  for (let index = 0; index < str.length; index++) {
    const code = str.charCodeAt(index);

    // eslint-disable-next-line camelcase
    if ((code >= CHAR_CODE_a && code <= CHAR_CODE_z) || (code >= CHAR_CODE_0 && code <= CHAR_CODE_9)) {
      tokens.push(str.charAt(index));
    } else if (code >= CHAR_CODE_A && code <= CHAR_CODE_Z) {
      if (index && tokens[index - 1] !== separator) {
        tokens.push(separator);
      }

      tokens.push(String.fromCharCode(code + 32));
    } else if (index) {
      tokens.push(separator);
    }
  }

  return tokens.join('');
}
