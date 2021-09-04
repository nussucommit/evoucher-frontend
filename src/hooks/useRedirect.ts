import { useLayoutEffect } from "react"

import history from "utils/history"

const useRedirect = (to: string, condition: boolean): void => {
  useLayoutEffect(() => {
    if (condition) history.push(to)
  }, [condition, to])
}

export default useRedirect
