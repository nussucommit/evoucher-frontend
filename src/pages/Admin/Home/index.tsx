import React, { useEffect, useState } from "react"
import { Formik, Form, FormikHelpers, useFormikContext } from "formik"
import * as yup from "yup"
import { Column } from "react-table"

import { useUser } from "api/user"
import { Routes } from "constants/routes"
import { useOrganization, useOrganizationVouchers } from "api/organization"
import {
  createVoucher,
  editVoucher,
  uploadCodeList,
  uploadEmailList,
} from "api/voucher"
import usePagination from "hooks/usePagination"
import { VOUCHER_TYPE_OPTIONS } from "constants/options"
import useRedirect from "hooks/useRedirect"

import { Table, Modal, ModalProps, Button, Heading } from "@commitUI"
import { FileUpload, Input, Select, TextArea } from "components/Form"

import styles from "./AdminHome.module.scss"
import {
  checkDateFormat,
  displayDate,
  formatDate,
  toDateObject,
} from "utils/date"
import { isSameFileUrl } from "utils/file"

interface Values {
  search?: string
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
  search: "",
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
  search: yup.string().default(""),
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
  const { data: user } = useUser()
  const { data: organization } = useOrganization(user?.username)
  const [selected, setSelected] = useState<AdminVoucher>()
  const [open, setOpen] = useState<types | null>(null)
  const closeModal = () => setOpen(null)
  const { page, setPage, setPerPage, perPage } = usePagination()
  const {
    data: vouchers = { count: 0, next: "", previous: "", results: [] },
    revalidate,
  } = useOrganizationVouchers({
    Organization: organization?.name,
    page: page.toString(),
    page_size: perPage.toString(),
  })

  useRedirect(
    Routes.adminChangePassword,
    Boolean(organization) && organization!.is_first_time_login
  )

  const columns = React.useMemo<Column<AdminVoucher>[]>(
    () => [
      {
        Header: "ID",
        accessor: "uuid",
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

  const handleSelect = (uuid: string) => {
    setSelected(vouchers.results.find((voucher) => voucher.uuid === uuid))
    setOpen(types.EDIT)
  }

  const handleSubmit = async (
    values: Values,
    formikHelpers: FormikHelpers<Values>
  ) => {
    const data = {
      posted_date: formatDate(new Date()),
      available_date: formatDate(toDateObject(values.availableDate)),
      expiry_date: formatDate(toDateObject(values.expiryDate)),
      name: values.name,
      voucher_type: values.type.value as string,
      description: values.description,
      counter: 0, // To-do
      organization: values.organization,
    }

    const files: { [key: string]: any } = {}
    if (!isSameFileUrl(selected?.image, values.image)) {
      files.image = values.image
    }

    if (open === types.ADD) {
      createVoucher(data, files)
    } else if (open === types.EDIT) {
      await editVoucher(selected!.uuid, data, files)
      await revalidate()

      if (values.codeList) {
        // Need to wait for code to be created first, before we can assign the code to an instance of IdCodeEmail
        await uploadCodeList(selected!.uuid, {
          code_list: values.codeList,
        })
      }
      if (values.emailList) {
        uploadEmailList(selected!.uuid, {
          email_list: values.emailList,
        })
      }
    }

    closeModal()
    formikHelpers.resetForm()
  }

  return (
    <>
      <div className={styles.screen}>
        <Heading level={1}>{`${organization?.name}'s Voucher List`}</Heading>

        <div className={styles.content}>
          <div>
            <Button
              onClick={() => setOpen(types.ADD)}
              className={styles.addBtn}
            >
              Add Voucher
            </Button>
            <Input name="search" label="Search" className={styles.input} />
          </div>

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
            onClose={closeModal}
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
  const {
    setValues,
    submitForm,
    resetForm,
    setFieldValue,
  } = useFormikContext<Values>()
  const isOpen = Boolean(type)
  const isAdd = type === types.ADD
  useEffect(() => {
    if (!isAdd) {
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
    }
  }, [setValues, voucher, type])

  useEffect(() => {
    setFieldValue("type", {
      label: voucher?.voucher_type || "",
      value: voucher?.voucher_type || "",
    })
  }, [voucher])

  useEffect(() => {
    if (!type) resetForm()
  }, [type])

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
