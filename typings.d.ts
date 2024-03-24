/* eslint-disable max-len */

type Nullable<T> = T | null;

type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

// Create a type that generates a union of prefixed keys
type PrefixedKeys<T, Prefix extends string> = {
  [K in keyof T as `${Prefix}${Extract<K, string | number>}`]: K;
};

// type ReturnTypeAsync<T> = ReturnType<T extends (...args: any[]) => Promise<infer U> ? () => U : T>;
type ReturnTypeAsync<T extends (...args: any) => any> = ReturnType<T extends (...args: any[]) => Promise<infer U> ? () => U : T>;

/**
 * ObjectKeyPaths declaration
 */
type Join<T extends unknown[], D extends string, Prefix extends string = ''> = T extends []
  ? never
  : T extends [infer F extends string | number | bigint | boolean | null | undefined]
    ? `${Prefix}${F}`
    : T extends [infer F, ...infer R]
      ? F extends string[]
        ? Join<F, D>
        : F extends string
          ? `${Prefix}${F}${D}${Join<Extract<R, string[]>, D>}`
          : never
      : string;

type LeafPathTree<T> = {
  [P in keyof T]-?: T[P] extends object
    ? [P] | [P, ...LeafPath<T[P]>]
    : [P];
};

type LeafPath<T> = LeafPathTree<T>[keyof LeafPathTree<T>];

type ObjectKeyPaths<T, Prefix extends string = ''> = Join<LeafPath<T>, '.', Prefix>;

type ObjectKeysTree<T> = {
  [P in keyof T]-?: P;
};

/**
 * Get object keys as union
 */
type ObjectKeys<T> = ObjectKeysTree<T>[keyof ObjectKeysTree<T>];

type ObjectKeysArrayTree<T> = {
  [P in keyof T]-?: [P];
};

/**
 * Get object keys as array
 */
type ObjectKeysArray<T> = ObjectKeysArrayTree<T>[keyof ObjectKeysArrayTree<T>];

type JoinArray<T extends unknown[], Separator extends string, Prefix extends string, Suffix extends unknown | unknown[]> = T extends []
  ? never
  : T extends [infer F]
    ? F extends string
      ? Suffix extends []
        ? never
        : Suffix extends [infer X]
          ? X extends string | number
            ? `${Prefix}${F}${Separator}${X}`
            : never
          : Suffix extends string | number
            ? Suffix extends ''
              ? `${Prefix}${F}`
              : `${Prefix}${F}${Separator}${Suffix}`
            : `${Prefix}${F}`
      : never
    : string;

/**
 * Transform keys to kebab
 */
type Upper = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' |
'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

type Kebab<T extends string> = T extends `${infer L}${Upper}${infer R}` ?
  T extends `${L}${infer U}${R}` ? `${L}-${Lowercase<U>}${Kebab<R>}` : T : T;

type KebabKeys<T> = { [K in keyof T as K extends string ? Kebab<K> : K]: T[K] };
