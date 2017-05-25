import Immutable from "immutable";
import "../index";

const directlyCreated = new Immutable.Map([["foo", "bar"]]);
const indirectlyCreated = new Immutable.Map().set("foo", "bar");

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

    test(`${calledWith} works with ${mockName} and Immutable.js objects`, () => {
      const fn = getFunction();
      fn(directlyCreated, indirectlyCreated);

      expect(fn)[calledWith](indirectlyCreated, directlyCreated);

      expect(() =>
        expect(fn).not[calledWith](indirectlyCreated, directlyCreated)
      ).toThrowErrorMatchingSnapshot();
    });

    test(`${calledWith} works with ${mockName} and Immutable.js objects within regular objects`, () => {
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
