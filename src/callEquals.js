/* @flow */

import { equals } from "./jasmine-utils";
import { isValueObject } from "./immutable/utils.js";

export function callEquals(args: Array<any>, expectedArgs: Array<any>) {
  // We need to catch cases where the expected argument count is bigger
  // then the actual since we loop over the actual and hence might not
  // land at all expected
  if (expectedArgs.length > args.length) {
    return false;
  }

  return args.every((actualArg, index) => {
    const expectedArg = expectedArgs[index];
    if (isValueObject(actualArg) && isValueObject(expectedArg)) {
      return actualArg.equals(expectedArg);
    } else {
      return equals(actualArg, expectedArg);
    }
  });
}
