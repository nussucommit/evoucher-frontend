import React, { useEffect, useState } from "react"
import { Formik, Form, FormikHelpers, useFormikContext } from "formik"
import * as yup from "yup"
import { Column } from "react-table"

import { logout } from "api/auth"
import { useOrganizationVouchers } from "api/organization"
import { getToken } from "utils/auth"
import useAuth from "hooks/useAuth"
import usePagination from "hooks/usePagination"
import useModal from "hooks/useModal"

import { Button, Table, Modal, ModalProps } from "@commitUI"
import { FileUpload, Input } from "components/Form"

import styles from "./AdminHome.module.scss"
import { displayDate, rawDate } from "utils/date"

interface Values {
  availableDate: string
  expiryDate: string
  name: string
  organization: string
  description: string
  type: VoucherType | string
  image: string
}

const initialValues: Values = {
  availableDate: "",
  expiryDate: "",
  name: "",
  organization: "",
  description: "",
  type: "Others",
  image: "",
}

const validationSchema: yup.SchemaOf<Values> = yup.object({
  availableDate: yup.string().required(),
  expiryDate: yup.string().required(),
  name: yup.string().required(),
  organization: yup.string().required(),
  description: yup.string().required(),
  type: yup.string().required(),
  image: yup.string().required(),
})

const Home = () => {
  const [selected, setSelected] = useState<AdminVoucher>()
  const { logout: localLogout } = useAuth()
  const { isOpen, onToggle } = useModal()
  const { page, setPage, setPerPage, perPage } = usePagination()
  const {
    data: vouchers = { count: 0, next: "", previous: "", results: [] },
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
    setSelected(vouchers.results.find((voucher) => voucher.id === id))
    onToggle()
  }

  const handleSubmit = (values: Values) => {
    // rawDate(values.availableDate)
    // rawDate(values.expiryDate)
  }

  return (
    <>
      <div className={styles.screen}>
        <h1>Admin Home Page</h1>
        <Table
          data={vouchers.results as AdminVoucher[]}
          columns={columns}
          currentPage={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
          totalPage={Math.ceil(vouchers?.count / perPage)}
          hasNextPage={Boolean(vouchers?.next)}
          hasPrevPage={Boolean(vouchers?.previous)}
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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={() => console.log("submit")}
        enableReinitialize
      >
        <Form>
          <AdminVoucherModal
            voucher={selected}
            isOpen={isOpen}
            onClose={onToggle}
          />
        </Form>
      </Formik>
    </>
  )
}

type AdminVoucherModalProps = Omit<ModalProps, "children"> & {
  voucher?: AdminVoucher
}

const AdminVoucherModal = ({
  voucher,
  isOpen,
  onClose,
}: AdminVoucherModalProps) => {
  const { setValues, submitForm, values } = useFormikContext<Values>()
  useEffect(() => {
    setValues({
      availableDate: displayDate(voucher?.available_date || ""),
      expiryDate: displayDate(voucher?.expiry_date || ""),
      name: voucher?.name || "",
      organization: voucher?.organization || "",
      description: voucher?.description || "",
      type: voucher?.voucher_type || "",
      image: voucher?.image || "",
    })
  }, [voucher])

  return (
    <Modal title="Edit Voucher" isOpen={isOpen} onClose={onClose}>
      <p>{voucher?.name}</p>
      <p>{rawDate(displayDate(values?.availableDate || "")).toJSON()}</p>

      <Input
        name="availableDate"
        label="Available Date (DD/MM/YYYY)"
        className={styles.input}
      />

      <Input
        name="expiryDate"
        label="Expiry Date (DD/MM/YYYY)"
        className={styles.input}
      />

      <FileUpload
        text="Upload File"
        type="image"
        name="image"
        className={styles.upload}
      />
    </Modal>
  )
}

export default Home
