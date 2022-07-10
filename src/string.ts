const RE_TRIMLINES = /(.+)(\n|\r\n)?/g;
const CHAR_CODE_0 = '0'.charCodeAt(0);
const CHAR_CODE_9 = '9'.charCodeAt(0);
// eslint-disable-next-line camelcase
const CHAR_CODE_a = 'a'.charCodeAt(0);
// eslint-disable-next-line camelcase
const CHAR_CODE_z = 'z'.charCodeAt(0);
const CHAR_CODE_A = 'A'.charCodeAt(0);
const CHAR_CODE_Z = 'Z'.charCodeAt(0);

const KEBAB_SEPARATOR = '-';

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

// eslint-disable-next-line radar/cognitive-complexity
export function toKebabCase(str: string, escapedChars: string[] = []): string {
  const tokens: string[] = [];

  for (let index = 0; index < str.length; index++) {
    const char = str.charAt(index);

    if (escapedChars.includes(char)) {
      tokens.push(char);
    } else {
      const code = str.charCodeAt(index);

      if (code >= CHAR_CODE_A && code <= CHAR_CODE_Z) {
        if (index) {
          const previousToken = tokens.at(-1);

          if (previousToken !== KEBAB_SEPARATOR && !escapedChars.includes(previousToken)) {
            tokens.push(KEBAB_SEPARATOR);
          }
        }

        tokens.push(String.fromCharCode(code + 32));
      // eslint-disable-next-line camelcase
      } else if ((code >= CHAR_CODE_a && code <= CHAR_CODE_z) || (code >= CHAR_CODE_0 && code <= CHAR_CODE_9)) {
        tokens.push(char);
      } else {
        tokens.push(KEBAB_SEPARATOR);
      }
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
