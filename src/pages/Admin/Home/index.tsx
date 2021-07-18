import React, { useState } from "react"
import { Column } from "react-table"

import { logout } from "api/auth"
import { useOrganizationVouchers } from "api/organization"
import { getToken } from "utils/auth"
import useAuth from "hooks/useAuth"
import usePagination from "hooks/usePagination"
import useModal from "hooks/useModal"

import { Button, Table, Modal } from "@commitUI"

import styles from "./AdminHome.module.scss"

const Home = () => {
  const [selected, setSelected] = useState<number>()
  const { logout: localLogout } = useAuth()
  const { isOpen, onToggle } = useModal()
  const { page, setPage, setPerPage, perPage } = usePagination()
  const {
    data = { count: 0, next: "", previous: "", results: [] },
    revalidate,
    isValidating,
  } = useOrganizationVouchers({
    Organization: "NUSSU Welfare",
    page: page.toString(),
    page_size: perPage.toString(),
  })

  const columns = React.useMemo<Column<AdminVoucher>[]>(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Voucher Name",
        accessor: "name",
      },
      {
        Header: "Available Date",
        accessor: "available_date",
      },
      {
        Header: "Expiry Date",
        accessor: "expiry_date",
      },
      {
        Header: "Voucher Type",
        accessor: "voucher_type",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Claims Left",
        accessor: "counter",
      },
    ],
    []
  )

  const handleSelect = (id: number) => {
    setSelected(id)
    onToggle()
  }

  return (
    <>
      <div className={styles.screen}>
        <h1>Admin Home Page</h1>

        <Table
          data={data.results as AdminVoucher[]}
          columns={columns}
          currentPage={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
          totalPage={Math.ceil(data?.count / perPage)}
          hasNextPage={Boolean(data?.next)}
          hasPrevPage={Boolean(data?.previous)}
          onRowClick={handleSelect}
          className={styles.table}
        />

        <Button
          onClick={() => {
            const token = getToken()
            logout({ refresh_token: token!.refresh })
            localLogout()
          }}
        >
          Log out
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={onToggle}>
        <p>{selected}</p>
      </Modal>
    </>
  )
}

export default Home

type Data = {
  fromUnit: string
  toUnit: string
  factor: number
}
