/**
 * Copyright (c) 2014, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in this directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  matcherHint,
  pluralize,
  printReceived,
  printWithType,
  RECEIVED_COLOR
} from "jest-matcher-utils";

export function ensureMock(mockOrSpy, matcherName) {
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
}

export function isSpy(spy) {
  return spy.calls && typeof spy.calls.count === "function";
}

export function formatReceivedCalls(calls, limit, options) {
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
}

export const RECEIVED_NAME = {
  "mock function": "jest.fn()",
  spy: "spy"
};

export function isValueObject(maybeValue: any) {
  return (
    maybeValue &&
    typeof maybeValue.equals === "function" &&
    typeof maybeValue.hashCode === "function"
  );
}
