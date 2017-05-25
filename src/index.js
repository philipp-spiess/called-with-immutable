const expect = require("jest-matchers");
import {
  createToBeCalledWithMatcher,
  createLastCalledWithMatcher
} from "./jest/spyMatchers";

expect.extend({
  lastCalledWith: createLastCalledWithMatcher(".lastCalledWith"),
  toBeCalledWith: createToBeCalledWithMatcher(".toBeCalledWith"),
  toHaveBeenCalledWith: createToBeCalledWithMatcher(".toHaveBeenCalledWith"),
  toHaveBeenLastCalledWith: createLastCalledWithMatcher(
    ".toHaveBeenLastCalledWith"
  )
});
