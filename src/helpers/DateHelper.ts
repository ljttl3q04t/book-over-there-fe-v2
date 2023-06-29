import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
export const dateFormatList = ["DD/MM/YYYY"];

/**
 * The function `disabledDate` is a TypeScript arrow function that takes a `current` parameter and
 * returns `true` if `current` is a date after the end of the current day, and `false` otherwise.
 * @param current - The current date being evaluated.
 * @returns a boolean value.
 */
export const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  return current && current > dayjs().endOf("day");
};
