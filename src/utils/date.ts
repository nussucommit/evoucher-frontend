import moment from "moment"

import { DATE_FORMAT } from "constants/date"

export const parseDate = (str: string) => new Date(str.replace(" ", "T"))

export const dateToString = (date: string) => {
  const parsedDate = parseDate(date).toString().slice(4, 15).split(" ")
  parsedDate[1] += ","
  return parsedDate.join(" ")
}

export const displayDate = (date: string) => {
  const raw = new Date(date)
  const day = raw.getDate()
  const month = raw.getMonth() + 1 // getMonth() returns 0 – 11
  const year = raw.getFullYear()

  return day + "/" + month + "/" + year
}

export const rawDate = (date: string) => {
  const splitted = date.split("/")
  const tmp = splitted[0]
  splitted[0] = splitted[1]
  splitted[1] = tmp

  return new Date(splitted.join("/"))
}

export const formatDate = (date: Date): string => {
  return moment(date).format(DATE_FORMAT)
}

export const checkDateFormat = (date?: string): boolean => {
  return (
    date?.charAt(2) === "/" && date?.charAt(5) === "/" && date?.length == 10
  )
}
