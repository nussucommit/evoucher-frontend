import { ChangeEvent, useState } from "react"

import { InputProps } from "commit-design"
import { Search } from "@commitUI"

/**
 * React hook to provide search functionality out of the box
 *
 * @param data the data to be filtered
 * @param property the property or column that wants to be filtered on
 * @param initialValue initial value of the keyword
 */
const useSearch = <T extends { [x: string]: any }>(
  data: T[],
  property?: Partial<keyof T>,
  initialValue: string = ""
) => {
  const [keyword, setKeyword] = useState<string>(initialValue)
  const filteredData = property
    ? data.filter((x) => x[property].toString().includes(keyword))
    : data.filter((x) => x.toString().includes(keyword))

  const searchProps: InputProps = {
    value: keyword,
    onChange: (e: ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value),
  }

  return { Search, searchProps, filteredData }
}

export default useSearch
