import { stringify } from '../src/qs';

describe('qs', () => {
  describe.each([
    [{}, ''],
    [{ key: null }, ''],
    [{ key: undefined }, ''],
    [{ key: 'null' }, 'key=null'],
    [{ key: null, key2: 'null' }, 'key2=null'],
    [{ key: 'ONE', key2: 'two' }, 'key=ONE&key2=two'],
    [{ key: 2, key2: false, key3: '3', key4: [3, 2], key5: ['3', '2'] }, 'key=2&key2=false&key3=3&key4=3&key4=2&key5=3&key5=2'],
  ])('stringify(%o)', (key, expected) => {
    it(`returns ${expected}`, () => {
      expect(stringify(key)).toBe(expected);
    });
  });
});
