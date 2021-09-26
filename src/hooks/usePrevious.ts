import { useRef, useEffect } from "react"

/**
 * React hook to store previous value
 *
 * @param value variable whose previous value you want to keep track of
 */
const usePrevious = <T extends unknown>(value: T) => {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

export default usePrevious
