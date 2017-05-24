/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in this directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

export function isValueObject(maybeValue) {
  return !!(maybeValue &&
    typeof maybeValue.equals === "function" &&
    typeof maybeValue.hashCode === "function");
}
