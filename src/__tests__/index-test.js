import Immutable from "immutable";
import { overwriteDefaults } from "../index";
overwriteDefaults();

[
  "toBeCalledWithImmutable",
  "toHaveBeenCalledWithImmutable",
  "toBeCalledWith",
  "toHaveBeenCalledWith"
].forEach(calledWith => {
  ["jest.fn", "jasmine.createSpy"].forEach(mockName => {
    const getFunction = () => {
      return mockName === "jest.fn" ? jest.fn() : jasmine.createSpy("fn");
    };

    test(`${calledWith} works with ${mockName} and more expected arguments`, () => {
      const fn = getFunction();
      fn("foo");

      expect(fn).not[calledWith]("foo", "bar");

      expect(() =>
        expect(fn)[calledWith]("foo", "bar")
      ).toThrowErrorMatchingSnapshot();
    });

    test(`${calledWith} works with ${mockName} and more actual arguments`, () => {
      const fn = getFunction();
      fn("foo", "bar");

      expect(fn).not[calledWith]("foo");

      expect(() =>
        expect(fn)[calledWith]("foo")
      ).toThrowErrorMatchingSnapshot();
    });

    test(`${calledWith} works with ${mockName} and Immutable.js objects`, () => {
      const directlyCreated = new Immutable.Map([["foo", "bar"]]);
      const indirectlyCreated = new Immutable.Map().set("foo", "bar");
      const fn = getFunction();
      fn(directlyCreated, indirectlyCreated);

      expect(fn)[calledWith](indirectlyCreated, directlyCreated);

      expect(() =>
        expect(fn).not[calledWith](indirectlyCreated, directlyCreated)
      ).toThrowErrorMatchingSnapshot();
    });

    test(`${calledWith} works with ${mockName} and Immutable.js objects within regular objects`, () => {
      const directlyCreated = new Immutable.Map([["foo", "bar"]]);
      const indirectlyCreated = new Immutable.Map().set("foo", "bar");
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
  });
});
