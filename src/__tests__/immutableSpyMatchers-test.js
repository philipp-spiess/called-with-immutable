import Immutable from "immutable";
import "../index";

const directlyCreated = new Immutable.Map([["foo", "bar"]]);
const indirectlyCreated = new Immutable.Map().set("foo", "bar");
const DemoRecord = Immutable.Record({ a: null, b: null });

[
  "lastCalledWith",
  "toBeCalledWith",
  "toHaveBeenCalledWith",
  "toHaveBeenLastCalledWith"
].forEach(calledWith => {
  ["jest.fn", "jasmine.createSpy"].forEach(mockName => {
    const getFunction = () => {
      return mockName === "jest.fn" ? jest.fn() : jasmine.createSpy("fn");
    };

    test(`${calledWith} works with ${mockName} and more expected arguments`, () => {
      const fn = getFunction();
      fn(directlyCreated);

      expect(fn).not[calledWith](directlyCreated, indirectlyCreated);

      expect(() =>
        expect(fn)[calledWith](directlyCreated, indirectlyCreated)
      ).toThrowErrorMatchingSnapshot();
    });

    test(`${calledWith} works with ${mockName} and more actual arguments`, () => {
      const fn = getFunction();
      fn(directlyCreated, indirectlyCreated);

      expect(fn).not[calledWith](directlyCreated);

      expect(() =>
        expect(fn)[calledWith](directlyCreated)
      ).toThrowErrorMatchingSnapshot();
    });

    test(`${calledWith} works with ${mockName} and ident Immutable.js maps`, () => {
      const fn = getFunction();
      fn(directlyCreated, directlyCreated);

      expect(fn)[calledWith](directlyCreated, directlyCreated);

      expect(() =>
        expect(fn).not[calledWith](directlyCreated, directlyCreated)
      ).toThrowErrorMatchingSnapshot();
    });

    test(`${calledWith} works with ${mockName} and equal Immutable.js maps`, () => {
      const fn = getFunction();
      fn(directlyCreated, indirectlyCreated);

      expect(fn)[calledWith](indirectlyCreated, directlyCreated);

      expect(() =>
        expect(fn).not[calledWith](indirectlyCreated, directlyCreated)
      ).toThrowErrorMatchingSnapshot();
    });

    test(`${calledWith} works with ${mockName} and equal Immutable.js maps within regular objects`, () => {
      const fn = getFunction();
      fn({ a: directlyCreated }, { b: indirectlyCreated });

      expect(fn)[calledWith]({ a: indirectlyCreated }, { b: directlyCreated });

      expect(() =>
        expect(fn).not[calledWith](
          { a: indirectlyCreated },
          { b: directlyCreated }
        )
      ).toThrowErrorMatchingSnapshot();
    });

    test(`${calledWith} works with ${mockName} and regular objects within Immutable.js maps`, () => {
      const directlyCreated = new Immutable.Map([["foo", { bar: "baz" }]]);
      const indirectlyCreated = new Immutable.Map().set("foo", { bar: "baz" });
      const fn = getFunction();
      fn(directlyCreated, indirectlyCreated);

      expect(fn)[calledWith](indirectlyCreated, directlyCreated);

      expect(() =>
        expect(fn).not[calledWith](indirectlyCreated, directlyCreated)
      ).toThrowErrorMatchingSnapshot();
    });

    test(`${calledWith} works with ${mockName} and regular objects within Immutable.js records`, () => {
      const directlyCreated = new DemoRecord({ a: { bar: "baz" } });
      const indirectlyCreated = new DemoRecord().set("a", { bar: "baz" });
      const fn = getFunction();
      fn(directlyCreated, indirectlyCreated);

      expect(fn)[calledWith](indirectlyCreated, directlyCreated);

      expect(() =>
        expect(fn).not[calledWith](indirectlyCreated, directlyCreated)
      ).toThrowErrorMatchingSnapshot();
    });
  });
});
