import { Dispatch, SetStateAction, useState } from "react"

export type Pagination = {
  page: number
  setPage: Dispatch<SetStateAction<number>>
  perPage: number
  setPerPage: Dispatch<SetStateAction<number>>
}
/**
 * React hook to handle table pagination
 */
const usePagination = (): Pagination => {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  return { page, setPage, perPage, setPerPage }
}

export default usePagination
