import React, { Dispatch, SetStateAction } from "react"
import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  TableProps,
} from "@chakra-ui/react"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons"
import { useTable, useSortBy, Column, usePagination } from "react-table"

import { Text } from "../Text"
import { IconButton } from "../IconButton"
import { Select } from "../Select"

import styles from "./Table.module.css"

export type Props<DataType extends {}> = TableProps & {
  // To-do
  data: DataType[]
  columns: Column<DataType>[]
  currentPage?: number
  setPage?: Dispatch<SetStateAction<number>>
  perPage?: number
  setPerPage?: Dispatch<SetStateAction<number>>
  totalPage?: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
  onRowClick?: (id: string) => void
}

export const Table = <DataType extends {}>({
  data,
  columns,
  currentPage = 1,
  setPage,
  perPage,
  setPerPage,
  totalPage,
  hasNextPage,
  hasPrevPage,
  onRowClick,
  ...tableProps
}: Props<DataType>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      useControlledState: (state) => {
        return React.useMemo(
          () => ({
            ...state,
            pageIndex: currentPage,
          }),
          [state, currentPage]
        )
      },
      initialState: { pageIndex: currentPage }, // Pass our hoisted table state
      manualPagination: true,
      pageCount: totalPage ? Math.max(totalPage, 1) : 1,
    },
    useSortBy,
    usePagination
  )

  return (
    <>
      <ChakraTable
        {...getTableProps()}
        {...tableProps}
        d="inline-block"
        border="1px solid"
        borderColor="gray.300"
      >
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <chakra.span pl="4">
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                      ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                      )
                    ) : null}
                  </chakra.span>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <Tr
                {...row.getRowProps()}
                onClick={() => onRowClick && onRowClick(row.cells[0].value)}
              >
                {row.cells.map((cell) => (
                  <Td {...cell.getCellProps()} overflowWrap="break-word">
                    {cell.render("Cell")}
                  </Td>
                ))}
              </Tr>
            )
          })}
        </Tbody>

        {setPage && setPerPage && totalPage && perPage && (
          <div className={styles.footer}>
            <div className={styles.left}>
              <Text span>Rows per page: </Text>
              {"  "}
              <Select
                defaultValue={{ label: perPage, value: perPage }}
                onChange={(option: { value: number; label: number }) => {
                  setPerPage(option.value)
                }}
                options={[
                  { label: 10, value: 10 },
                  { label: 20, value: 20 },
                  { label: 30, value: 30 },
                  { label: 40, value: 40 },
                  { label: 50, value: 50 },
                ]}
                className={styles.select}
              />
            </div>

            <div className={styles.middle}>
              {/* <Text>Jump to page:</Text>{" "}
              <NumberInput
                ml={2}
                mr={8}
                w={28}
                min={1}
                max={totalPage}
                onChange={(value) => {
                  const pageIndex = Number(value) || 1
                  setPage(pageIndex)
                }}
                defaultValue={pageIndex}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput> */}
            </div>

            <div>
              <Text span className={styles.text}>
                Page{" "}
                <Text bold span>
                  {pageIndex}
                </Text>{" "}
                of <Text span>{totalPage}</Text>
              </Text>

              <IconButton
                label="First Page"
                onClick={() => setPage(1)}
                isDisabled={!hasPrevPage}
                icon={<ArrowLeftIcon h={3} w={3} />}
                backgroundColor="white"
                className={styles.icon}
              />
              <IconButton
                label="Previous Page"
                onClick={() => setPage(pageIndex - 1)}
                isDisabled={!hasPrevPage}
                icon={<ChevronLeftIcon h={6} w={6} />}
                backgroundColor="white"
                className={styles.icon}
              />
              <IconButton
                label="Next Page"
                onClick={() => setPage(pageIndex + 1)}
                isDisabled={!hasNextPage}
                icon={<ChevronRightIcon h={6} w={6} />}
                backgroundColor="white"
                className={styles.icon}
              />
              <IconButton
                label="Last Page"
                onClick={() => setPage(totalPage)}
                isDisabled={!hasNextPage}
                icon={<ArrowRightIcon h={3} w={3} />}
                backgroundColor="white"
                className={styles.icon}
              />
            </div>
          </div>
        )}
      </ChakraTable>
    </>
  )
}
