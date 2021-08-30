import React, { useEffect, useState } from "react"
import { Formik, Form, FormikHelpers, useFormikContext } from "formik"
import * as yup from "yup"
import { Column } from "react-table"
import moment from "moment"

import { useOrganizationVouchers } from "api/organization"
import { createVoucher } from "api/voucher"
import usePagination from "hooks/usePagination"
import { VOUCHER_TYPE_OPTIONS } from "constants/options"

import { Table, Modal, ModalProps, Button } from "@commitUI"
import { FileUpload, Input, Select, TextArea } from "components/Form"

import styles from "./AdminHome.module.scss"
import { checkDateFormat, displayDate, formatDate } from "utils/date"

interface Values {
  availableDate: string
  expiryDate: string
  name: string
  organization: string
  description: string
  type: Option
  image: string
  codeList: string
  emailList: string
}

const initialValues: Values = {
  availableDate: "",
  expiryDate: "",
  name: "",
  organization: "",
  description: "",
  type: {
    label: "",
    value: "",
  },
  image: "",
  codeList: "",
  emailList: "",
}

const validationSchema: yup.SchemaOf<Values> = yup.object({
  availableDate: yup
    .string()
    .test("valid format", "Invalid date format", (date) =>
      checkDateFormat(date)
    )
    .required(),
  expiryDate: yup
    .string()
    .test("valid format", "Invalid date format", (date) =>
      checkDateFormat(date)
    )
    .required(),
  name: yup.string().required(),
  organization: yup.string().required(),
  description: yup.string().required(),
  type: yup
    .object()
    .shape({
      value: yup.mixed().required("Required"),
      label: yup.string(),
    })
    .required("Required"),
  image: yup.string().required(),
  codeList: yup.string().default(""),
  emailList: yup.string().default(""),
})

enum types {
  ADD = "ADD",
  EDIT = "EDIT",
}

const Home = () => {
  const [selected, setSelected] = useState<AdminVoucher>()
  const [open, setOpen] = useState<types | null>(null)
  const onToggle = () => setOpen(null)
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
    createVoucher(
      {
        posted_date: formatDate(new Date()),
        available_date: formatDate(new Date(values.availableDate)),
        expiry_date: formatDate(new Date(values.expiryDate)),
        name: values.name,
        voucher_type: values.type.value as string,
        description: values.description,
        counter: 0, // To-do
        organization: values.organization,
      },
      {
        image: values.image,
      }
    )
  }

  return (
    <>
      <div className={styles.screen}>
        <h1>Admin Home Page</h1>

        <Button onClick={() => setOpen(types.ADD)}>Add Voucher</Button>

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
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        <Form>
          <AdminVoucherModal
            voucher={selected}
            type={open}
            onClose={onToggle}
          />
        </Form>
      </Formik>
    </>
  )
}

type AdminVoucherModalProps = Omit<ModalProps, "children" | "isOpen"> & {
  voucher?: AdminVoucher
  type?: types | null
}

const AdminVoucherModal = ({
  voucher,
  type,
  onClose,
}: AdminVoucherModalProps) => {
  const { setValues, submitForm, errors } = useFormikContext<Values>()
  console.log(errors)
  const isOpen = Boolean(type)
  const isAdd = type === types.ADD
  useEffect(() => {
    setValues({
      availableDate: isAdd ? "" : displayDate(voucher?.available_date || ""),
      expiryDate: isAdd ? "" : displayDate(voucher?.expiry_date || ""),
      name: voucher?.name || "",
      organization: voucher?.organization || "",
      description: voucher?.description || "",
      type: {
        label: voucher?.voucher_type || "",
        value: voucher?.voucher_type || "",
      },
      image: voucher?.image || "",
      codeList: "",
      emailList: "",
    })
  }, [setValues, voucher, type])

  return (
    <Modal
      title={isAdd ? "Add Voucher" : "Edit Voucher"}
      isOpen={isOpen}
      onClose={onClose}
    >
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

      <Input name="name" label="Name" className={styles.input} />

      <Input
        name="organization"
        label="Organization / Faculty"
        className={styles.input}
      />

      <TextArea
        name="description"
        label="Description"
        className={styles.input}
      />

      <Select
        name="type"
        label="Voucher Type"
        options={VOUCHER_TYPE_OPTIONS}
        isSearchable
        className={styles.input}
      />

      <FileUpload
        label="Upload File"
        type="image"
        name="image"
        className={styles.upload}
      />

      {!isAdd && (
        <>
          <FileUpload
            label="Upload Voucher Code List (optional)"
            type="csv"
            name="codeList"
            className={styles.upload}
          />

          <FileUpload
            label="Upload Voucher Email List"
            type="csv"
            name="emailList"
            className={styles.upload}
          />
        </>
      )}

      <Button onClick={submitForm}>Submit</Button>
    </Modal>
  )
}

export default Home
