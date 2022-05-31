export declare class CircularList<T> {
  index: number;

  constructor(items: T[]);
  next(excludes?: T[]): T;
}
