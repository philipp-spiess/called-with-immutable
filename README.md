This project aims to provide full support for Immutable.js objects within the
default Jest matchers. It works by overwriting the `equals` method to support
value objects.

This addition is required since two Immutable.js objects containing the same
properties might not always have the same reference. The following example will
explain this:

```js
const directlyCreated = new Immutable.Map([['foo', 'bar']]);
const indirectlyCreated = (new Immutable.Map()).set('foo', 'bar');

Immutable.is(directlyCreated, indirectlyCreated); // => true
directlyCreated === indirectlyCreated; // => false
```

This already works with some of the default matchers like `toEqual()`,
`toContain`, and `toContainEqual` since it uses iterators to compare the values.
We extend the support for Immutable.js equality checks to all other matchers.

## Current support

- Spy Matchers
  - lastCalledWith
  - toBeCalledWith
  - toHaveBeenCalledWith
  - toHaveBeenLastCalledWith

## Future plans

First of all we must find a way to allow Immutable.js objects to hold other
objects and still be able to tell if those are equal.

To further improve the experience when working with Jest and Immutable.js, we
are working on additional matchers as well including:

- toMatchObject
- toHaveProperty
- Asymmetric Matchers
  - immutableMapContaining
  - immutableSetContaining
  - immutableRecordContaining
  - immutableListContaining

## Installation

Since this package overwrites Jest's default matchers, you need to invoke it
_after_ your [`setupFiles`][].

This can be done either in the individual test files, like this:

```js
// some-test.js
import "called-with-immutable";

it("works", () => {
  expect(jest.fn()).not.toBeCalledWith(someImmutableObject)
})
```

Or globally, for all test suits by using configuring a
[`setupTestFrameworkScriptFile`][] like this:

```js
// package.json
{
  "jest": {
    "setupTestFrameworkScriptFile": "<rootDir>/setupFramework.js",
  }
}

// setupFramework.js
import "called-with-immutable";
```

## Related Work

[`custom-immutable-matchers`][] include a Jest matchers package that adds new
matchers to test an expectation for a specific Immutable.js type, e.g:

```js
expect(new Immutable.Map()).toBeImmutable()
```

While [`custom-immutable-matchers`][] tries to add additional functionality to
via new matchers, we improve existing matchers and make the seamlessly work with
Immutable.js data types.

[`setupFiles`]: https://facebook.github.io/jest/docs/configuration.html#setupfiles-array
[`setupTestFrameworkScriptFile`]: https://facebook.github.io/jest/docs/configuration.html#setuptestframeworkscriptfile-string
[`custom-immutable-matchers`]: https://github.com/unindented/custom-immutable-matchers
