/**
 * Copyright (c) 2014, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

const CALL_PRINT_LIMIT = 3;
const LAST_CALL_PRINT_LIMIT = 1;
const {
  ensureExpectedIsNumber,
  ensureNoExpected,
  EXPECTED_COLOR,
  matcherHint,
  pluralize,
  printExpected,
  printReceived,
  printWithType,
  RECEIVED_COLOR
} = require("jest-matcher-utils");
import { equals } from "../jasmine-utils";

const RECEIVED_NAME = {
  "mock function": "jest.fn()",
  spy: "spy"
};

export function createToBeCalledWithMatcher(matcherName: string) {
  return (received: any, ...expected: any) => {
    ensureMock(received, matcherName);

    const receivedIsSpy = isSpy(received);
    const type = receivedIsSpy ? "spy" : "mock function";
    const calls = receivedIsSpy
      ? received.calls.all().map(x => x.args)
      : received.mock.calls;
    const pass = calls.some(call => equals(call, expected));

    const message = pass
      ? () =>
          matcherHint(".not" + matcherName, RECEIVED_NAME[type]) +
          "\n\n" +
          `Expected ${type} not to have been called with:\n` +
          `  ${printExpected(expected)}`
      : () =>
          matcherHint(matcherName, RECEIVED_NAME[type]) +
          "\n\n" +
          `Expected ${type} to have been called with:\n` +
          `  ${printExpected(expected)}\n` +
          formatReceivedCalls(calls, CALL_PRINT_LIMIT);

    return { message, pass };
  };
}

const isSpy = spy => spy.calls && typeof spy.calls.count === "function";

const ensureMock = (mockOrSpy, matcherName) => {
  if (
    !mockOrSpy ||
    ((mockOrSpy.calls === undefined || mockOrSpy.calls.all === undefined) &&
      mockOrSpy._isMockFunction !== true)
  ) {
    throw new Error(
      matcherHint("[.not]" + matcherName, "jest.fn()", "") +
        "\n\n" +
        `${RECEIVED_COLOR("jest.fn()")} value must be a mock function ` +
        `or spy.\n` +
        printWithType("Received", mockOrSpy, printReceived)
    );
  }
};

const formatReceivedCalls = (calls, limit, options) => {
  if (calls.length) {
    const but = options && options.sameSentence ? "but" : "But";
    const count = calls.length - limit;
    const printedCalls = calls
      .slice(-limit)
      .reverse()
      .map(printReceived)
      .join(", ");
    return (
      `${but} it was ${options && options.isLast ? "last " : ""}called ` +
      `with:\n  ` +
      printedCalls +
      (count > 0
        ? "\nand " + RECEIVED_COLOR(pluralize("more call", count)) + "."
        : "")
    );
  } else {
    return `But it was ${RECEIVED_COLOR("not called")}.`;
  }
};
