import { CircularList } from '../src/CircularList';

describe('CircularList', () => {
  it.each([
    [[], undefined, [undefined, undefined, undefined]],
    [[], [], [undefined, undefined, undefined]],
    [[0], [], [0, 0, 0]],
    [[0], [1], [0, 0, 0]],
    [[0], [0], [undefined, undefined, undefined]],
    [[0, 1], [0], [1, 1, 1]],
    [[0, 1], [0, 1], [undefined, undefined, undefined]],
    [[0, 1], [], [0, 1, 0]],
  ])('new CircularList(%j).next(%j) x 3 === %j', (list, excludes, [exp1, exp2, exp3]) => {
    const gen = new CircularList(list);

    expect(gen.next(excludes)).toBe(exp1);
    expect(gen.next(excludes)).toBe(exp2);
    expect(gen.next(excludes)).toBe(exp3);
  });
});
