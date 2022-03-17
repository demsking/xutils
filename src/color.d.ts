interface Color {
  cyan: (str: string) => string;
  red: (str: string) => string;
  yellow: (str: string) => string;
  green: (str: string) => string;
};

declare const color: Color;

export default color;
