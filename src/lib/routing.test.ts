import { expect, it } from "vitest";
import { getEntryPath } from "./routing";

it("sends new users to assessment and returning users home", () => {
  expect(getEntryPath(false)).toBe("/assessment");
  expect(getEntryPath(true)).toBe("/");
});
