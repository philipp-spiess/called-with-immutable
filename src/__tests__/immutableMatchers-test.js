const { stringify } = require("jest-matcher-utils");
import "../index";
import Immutable from "immutable";

const directlyCreated = new Immutable.Map([["foo", "bar"]]);
const indirectlyCreated = new Immutable.Map().set("foo", "bar");
const DemoRecord = Immutable.Record({ a: null, b: null });

describe(".toEqual()", () => {
  [
    [directlyCreated, indirectlyCreated],
    [{ a: directlyCreated }, { a: indirectlyCreated }],
    [[directlyCreated], [indirectlyCreated]]
  ].forEach(([a, b]) => {
    test(`expect(${stringify(a)}).toEqual(${stringify(b)})`, () => {
      expect(a).toEqual(b);
      expect(() => expect(a).not.toEqual(b)).toThrowErrorMatchingSnapshot();
    });
  });
});

describe(".toContain(), .toContainEqual()", () => {
  [
    [new Immutable.List([1, 2, 3, 4]), 1],
    [new Immutable.List(["a", "b", "c", "d"]), "a"],
    [new Immutable.Set([1, 2]), 1],
    [new Immutable.Set(["abc", "def"]), "abc"]
  ].forEach(([list, v]) => {
    it(`'${stringify(list)}' contains '${stringify(v)}'`, () => {
      expect(list).toContain(v);

      expect(() =>
        expect(list).not.toContain(v)
      ).toThrowErrorMatchingSnapshot();
    });
  });

  [
    [new Immutable.List([1, 2, 3, 4]), 5],
    [new Immutable.List(["a", "b", "c", "d"]), "e"],
    [new Immutable.Set([1, 2]), 3],
    [new Immutable.Set(["abc", "def"]), "ghi"]
  ].forEach(([list, v]) => {
    it(`'${stringify(list)}' does not contain '${stringify(v)}'`, () => {
      expect(list).not.toContain(v);

      expect(() => expect(list).toContain(v)).toThrowErrorMatchingSnapshot();
    });
  });

  [
    [new Immutable.List([directlyCreated]), indirectlyCreated],
    [new Immutable.Set([directlyCreated]), indirectlyCreated]
  ].forEach(([list, v]) => {
    it(`'${stringify(list)}' contains a value equal to '${stringify(v)}'`, () => {
      expect(list).toContainEqual(v);
      expect(() =>
        expect(list).not.toContainEqual(v)
      ).toThrowErrorMatchingSnapshot();
    });
  });
});

xdescribe(".toHaveProperty()", () => {
  [
    [DemoRecord({ a: DemoRecord({ b: 1 }) }), "a.b", 1],
    [DemoRecord({ a: 0 }), "a", 0],
    [new Immutable.Map([["a", new Immutable.Map([["b", 1]])]]), "a.b", 1],
    [new Immutable.Map([["a", 0]]), "a", 0],
    [
      new Immutable.OrderedMap([["a", new Immutable.OrderedMap([["b", 1]])]]),
      "a.b",
      1
    ],
    [new Immutable.OrderedMap([["a", 0]]), "a", 0],
    [
      DemoRecord({
        a: new Immutable.Map([["b", new Immutable.OrderedMap([["c", 1]])]])
      }),
      "a.b.c",
      1
    ]
  ].forEach(([obj, keyPath, value]) => {
    test(`expect(${stringify(obj)}).toHaveProperty('${keyPath}', ${stringify(value)})`, () => {
      expect(obj).toHaveProperty(keyPath, value);
      expect(() =>
        expect(obj).not.toHaveProperty(keyPath, value)
      ).toThrowErrorMatchingSnapshot();
    });
  });

  // [
  //   [{a: {b: {c: {d: 1}}}}, 'a.b.ttt.d', 1],
  //   [{a: {b: {c: {d: 1}}}}, 'a.b.c.d', 2],
  //   [{a: {b: {c: {}}}}, 'a.b.c.d', 1],
  //   [{a: 1}, 'a.b.c.d', 5],
  //   [{}, 'a', 'test'],
  //   [{a: {b: 3}}, 'a.b', undefined],
  //   [1, 'a.b.c', 'test'],
  //   ['abc', 'a.b.c', {a: 5}],
  //   [{a: {b: {c: 5}}}, 'a.b', {c: 4}],
  // ].forEach(([obj, keyPath, value]) => {
  //   test(`{pass: false} expect(${stringify(obj)}).toHaveProperty('${keyPath}', ${stringify(value)})`, () => {
  //     expect(() =>
  //       expect(obj).toHaveProperty(keyPath, value),
  //     ).toThrowErrorMatchingSnapshot();
  //     expect(obj).not.toHaveProperty(keyPath, value);
  //   });
  // });

  // [
  //   [{a: {b: {c: {d: 1}}}}, 'a.b.c.d'],
  //   [{a: 0}, 'a'],
  //   [{a: {b: undefined}}, 'a.b'],
  // ].forEach(([obj, keyPath]) => {
  //   test(`{pass: true} expect(${stringify(obj)}).toHaveProperty('${keyPath}')'`, () => {
  //     expect(obj).toHaveProperty(keyPath);
  //     expect(() =>
  //       expect(obj).not.toHaveProperty(keyPath),
  //     ).toThrowErrorMatchingSnapshot();
  //   });
  // });

  // [
  //   [{a: {b: {c: {}}}}, 'a.b.c.d'],
  //   [{a: 1}, 'a.b.c.d'],
  //   [{}, 'a'],
  //   [1, 'a.b.c'],
  //   ['abc', 'a.b.c'],
  // ].forEach(([obj, keyPath]) => {
  //   test(`{pass: false} expect(${stringify(obj)}).toHaveProperty('${keyPath}')`, () => {
  //     expect(() =>
  //       expect(obj).toHaveProperty(keyPath),
  //     ).toThrowErrorMatchingSnapshot();
  //     expect(obj).not.toHaveProperty(keyPath);
  //   });
  // });

  // [
  //   [null, 'a.b'],
  //   [undefined, 'a'],
  //   [{a: {b: {}}}, undefined],
  //   [{a: {b: {}}}, null],
  //   [{a: {b: {}}}, 1],
  // ].forEach(([obj, keyPath]) => {
  //   test(`{error} expect(${stringify(obj)}).toHaveProperty('${keyPath}')`, () => {
  //     expect(() =>
  //       expect(obj).toHaveProperty(keyPath),
  //     ).toThrowErrorMatchingSnapshot();
  //   });
  // });
});
