import { format } from "date-fns";

import { DATE_FORMAT, DATE_LONG_FORMAT } from "constants/date";

export const parseDate = (str: string) => new Date(str.replace(" ", "T"));

export const dateToString = (date: string) => {
  const parsedDate = parseDate(date).toString().slice(4, 15).split(" ");
  parsedDate[1] += ",";
  return parsedDate.join(" ");
};

export const displayDate = (date: string) => {
  const raw = new Date(date);
  const day = raw.getDate();
  const month = raw.getMonth() + 1; // getMonth() returns 0 – 11
  const year = raw.getFullYear();

  // this is a bit counterintuitive, but yeah here's the fix: somehow date picker receives
  // MM/dd/yyyy by default, despite the display date is dd/MM/yyyy.
  return padDate(month.toString()) + "/" + padDate(day.toString()) + "/" + year;
};

const padDate = (date: string) => {
  return date.length === 2 ? date : "0" + date;
};

export const rawDate = (date: string) => {
  const splitted = date.split("/");
  const tmp = splitted[0];
  splitted[0] = splitted[1];
  splitted[1] = tmp;

  return new Date(splitted.join("/"));
};

export const formatDate = (date: string): string => {
  const dateObject = new Date(date);
  return format(dateObject, DATE_LONG_FORMAT);
};

export const checkDateFormat = (date?: string): boolean => {
  return date !== undefined &&
         date.length > 0 &&
         !isNaN(Date.parse(date));
};
