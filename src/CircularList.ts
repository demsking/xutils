import { CircularList as Interface } from './CircularList.d';

export class CircularList<T> implements Interface<T> {
  private items: T[];
  private gen: Generator<T, T, unknown>;
  index = 0;

  constructor(items: T[]) {
    this.items = items;
    this.gen = this.create();
  }

  next(excludes: T[] = []): T {
    let item: T;
    let lookupIndex = 0;

    do {
      item = this.gen.next().value;
    } while (excludes.includes(item) && ++lookupIndex < this.items.length);

    return lookupIndex === this.items.length
      ? undefined
      : item;
  }

  * create(): any {
    while (true) {
      yield this.items[this.index++];

      if (this.index >= this.items.length) {
        this.index = 0;
      }
    }
  }
}
