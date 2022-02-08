const RE_TRIMLINES = /(.+)(\n|\r\n)?/g;
const CHAR_CODE_A = 'A'.charCodeAt(0);
const CHAR_CODE_Z = 'Z'.charCodeAt(0);

export const XString = {
  trimlines(str: string, separator = ''): string {
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
  },
  toKebabCase(str: string): string {
    return str.split('').reduce((tokens, char) => {
      const code = char.charCodeAt(0);

      if (code >= CHAR_CODE_A && code <= CHAR_CODE_Z) {
        tokens.push('-');
        tokens.push(String.fromCharCode(code + 32));
      } else {
        tokens.push(char);
      }

      return tokens;
    }, [] as string[]).join('');
  },
  unCamelCase(str: string, separator = ' ') {
    const lowercase = str.toLowerCase();
    const chars = [];

    for (let i = 0; i < str.length; i++) {
      const charLower = lowercase.charAt(i);
      const charString = str.charAt(i);

      if (charString !== charLower) {
        chars.push(separator);
      }

      chars.push(charLower);
    }

    return chars.join('');
  },
};
