interface Color {
  cyan: (str: string | number) => string;
  red: (str: string | number) => string;
  yellow: (str: string | number) => string;
  green: (str: string | number) => string;
}

declare const color: Color;

export default color;
