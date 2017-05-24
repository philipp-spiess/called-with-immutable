const expect = require("jest-matchers");
import { createToBeCalledWithMatcher } from "./jest/spyMatchers";

expect.extend({
  toBeCalledWithImmutable: createToBeCalledWithMatcher(
    ".toBeCalledWithImmutable"
  ),
  toHaveBeenCalledWithImmutable: createToBeCalledWithMatcher(
    ".toHaveBeenCalledWithImmutable"
  )
});

export function overwriteDefaults() {
  expect.extend({
    toBeCalledWith: createToBeCalledWithMatcher(".toBeCalledWith"),
    toHaveBeenCalledWith: createToBeCalledWithMatcher(".toHaveBeenCalledWith")
  });
}
