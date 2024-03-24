/**
 * Represents a circular list that iterates over its elements infinitely.
 * @template T
 */
export class CircularList<T> {
  /** The array of items in the circular list. */
  private items: T[];
  /** The generator for iterating over items in a circular manner. */
  private gen: Generator<T, T, unknown>;
  /** The current index of the generator. */
  index = 0;

  /**
   * Creates a circular list.
   * @param {T[]} items - The array of items to include in the circular list.
   */
  constructor(items: T[]) {
    this.items = items;
    this.gen = this.create();
  }

  /**
   * Gets the next item in the circular list, excluding specified items.
   * @param {T[]} [excludes=[]] - An array of items to exclude from the next item selection.
   * @returns {T | undefined} The next item in the circular list, or undefined if all items are excluded.
   */
  next(excludes: T[] = []): T | undefined {
    let item: T;
    let lookupIndex = 0;

    do {
      item = this.gen.next().value;
    } while (excludes.includes(item) && ++lookupIndex < this.items.length);

    return lookupIndex === this.items.length
      ? undefined
      : item;
  }

  /**
   * Creates a generator for iterating over items in a circular manner.
   * @returns {Generator<T, T, unknown>} A generator for iterating over items in a circular manner.
   */
  * create(): any {
    while (true) {
      yield this.items[this.index++];

      if (this.index >= this.items.length) {
        this.index = 0;
      }
    }
  }
}
