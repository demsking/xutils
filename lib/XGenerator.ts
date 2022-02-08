export class XGenerator<T> {
  private items: T[];
  private instance: Generator<T, T, unknown>;
  index = 0;

  constructor(items: T[]) {
    this.items = items;
    this.instance = this.create();
  }

  next(excludes: T[] = []) {
    let item = this.instance.next().value;

    while (excludes.includes(item)) {
      item = this.instance.next().value;
    }

    return item;
  }

  *create() {
    while (true) {
      yield this.items[this.index++];

      if (this.index >= this.items.length) {
        this.index = 0;
      }
    }

    return this.items[this.index];
  }
}
