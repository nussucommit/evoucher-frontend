import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, FormikHelpers, useFormikContext } from "formik";
import * as yup from "yup";
import { Column } from "react-table";

import { useUser } from "api/user";
import { Routes } from "constants/routes";
import { useOrganization, useOrganizationVouchers } from "api/organization";
import {
  createVoucher,
  editVoucher,
  uploadCodeList,
  uploadEmailList,
  uploadManualCodes,
} from "api/voucher";
import usePagination from "hooks/usePagination";
import { FACULTY_OPTIONS, VOUCHER_TYPE_OPTIONS } from "constants/options";
import useRedirect from "hooks/useRedirect";
import useSearch from "hooks/useSearch";
import {
  checkDateFormat,
  displayDate,
  formatDisplayDate,
  formatLongDate,
} from "utils/date";
import { isSameFileUrl } from "utils/file";
import { focusElementWithHotkey } from "utils/focusElement";
import { MILLISECONDS_PER_DAY } from "constants/date";
import {
  checkAllFacultiesPresent,
  facultiesToOptions,
  parseFaculties,
} from "utils/faculty";

// To-do: Divide Table into two components, UI in commit-design and functionality in local /components
import { Table } from "@commitUI";
import { Modal, ModalProps, Button, Heading, Search } from "commit-design";
import {
  FileUpload,
  Input,
  Select,
  TextArea,
  GroupInput,
  DateInput,
  Checkbox,
} from "components/Form";

import styles from "./AdminHome.module.scss";

interface Values {
  search?: string;
  availableDate: string;
  expiryDate: string;
  name: string;
  description: string;
  type: Option;
  eligibleFaculties: Option[];
  isEligibleForAll: boolean;
  image: string;
  codeList: string;
  emailList: string;
  manualCodeInputs: CodeEmailInput[];
}

const initialValues: Values = {
  search: "",
  availableDate: "",
  expiryDate: "",
  name: "",
  description: "",
  type: {
    label: "",
    value: "",
  },
  eligibleFaculties: [],
  isEligibleForAll: false,
  image: "",
  codeList: "",
  emailList: "",
  manualCodeInputs: [{ key: "", value: "" }],
};

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
  description: yup.string().required(),
  type: yup
    .object()
    .shape({
      value: yup.mixed().required("Required"),
      label: yup.string(),
    })
    .required("Required"),
  eligibleFaculties: yup.array().of(
    yup.object().shape({
      value: yup.mixed().required("Required"),
      label: yup.string().required("Required"),
    })
  ),
  isEligibleForAll: yup.boolean().default(false),
  image: yup.string().required(),
  codeList: yup.string().default(""),
  emailList: yup.string().default(""),
  manualCodeInputs: yup.array(),
});

enum types {
  ADD = "ADD",
  EDIT = "EDIT",
}

const Home = () => {
  const { data: user } = useUser();
  const { data: organization } = useOrganization(user?.username);
  const [selected, setSelected] = useState<AdminVoucher>();
  const [open, setOpen] = useState<types | null>(null);
  const closeModal = () => setOpen(null);
  const { page, setPage, setPerPage, perPage } = usePagination();
  const {
    data: vouchers = { count: 0, next: "", previous: "", results: [] },
    revalidate,
  } = useOrganizationVouchers({
    Organization: organization?.name,
    page: page.toString(),
    page_size: perPage.toString(),
  });
  const { searchProps, filteredData: data } = useSearch(
    vouchers.results as AdminVoucher[],
    "name"
  );

  // assumption: date is always of the format dd/MM/yyyy
  const correctedDate = (date: string) => {
    const parts = date.split("/");
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  };

  const checkIsExpire = (expiredDate: string) => {
    const now = Date.now();
    const expired = correctedDate(expiredDate).valueOf();
    return now > expired + MILLISECONDS_PER_DAY;
  };

  useRedirect(
    Routes.adminChangePassword,
    Boolean(organization) && organization!.is_first_time_login
  );

  useEffect(() => {
    const closeEventListener = focusElementWithHotkey("#search", "/");
    return closeEventListener;
  });

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
        accessor: (row) => formatDisplayDate(row.available_date),
      },
      {
        Header: "Expiry Date",
        accessor: (row) => formatDisplayDate(row.expiry_date),
        Cell: (s: any) => (
          <span className={checkIsExpire(s.value) ? styles.expired : ""}>
            {s.value}
          </span>
        ),
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
  );

  const handleSelect = (uuid: string) => {
    setSelected(vouchers.results.find((voucher) => voucher.uuid === uuid));
    setOpen(types.EDIT);
  };

  const handleSubmit = async (
    values: Values,
    formikHelpers: FormikHelpers<Values>
  ) => {
    const data = {
      posted_date: formatLongDate(new Date().toString()),
      available_date: formatLongDate(values.availableDate),
      expiry_date: formatLongDate(values.expiryDate),
      name: values.name,
      voucher_type: values.type.value as string,
      eligible_faculties: values.isEligibleForAll
        ? parseFaculties(FACULTY_OPTIONS)
        : parseFaculties(values.eligibleFaculties),
      description: values.description,
      counter: 0, // To-do
      organization: organization?.name,
    };
    console.log(data);

    const files: { [key: string]: any } = {};
    if (!isSameFileUrl(selected?.image, values.image)) {
      files.image = values.image;
    }

    if (open === types.ADD) {
      await createVoucher(data, files);
      await revalidate();
    } else if (open === types.EDIT) {
      await editVoucher(selected!.uuid, data, files);
      await revalidate();

      if (values.codeList) {
        // Need to wait for code to be created first, before we can assign the code to an instance of IdCodeEmail
        await uploadCodeList(selected!.uuid, {
          code_list: values.codeList,
        });
      }
      if (values.emailList) {
        uploadEmailList(selected!.uuid, {
          email_list: values.emailList,
        });
      }
      if (values.manualCodeInputs.length) {
        uploadManualCodes(selected!.uuid, values.manualCodeInputs);
      }
    }

    closeModal();
    formikHelpers.resetForm();
  };

  return (
    <>
      <div className={styles.screen}>
        <Heading level={1}>{`${organization?.name}'s Voucher List`}</Heading>

        <div className={styles.content}>
          <div className={styles.topContent}>
            <Button
              onClick={() => setOpen(types.ADD)}
              className={styles.addBtn}
            >
              Add Voucher
            </Button>

            <Search
              id="search"
              placeholder="Search (Press / )"
              {...searchProps}
            />
          </div>

          <Table
            data={data}
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
  );
};

type AdminVoucherModalProps = Omit<ModalProps, "children" | "isOpen"> & {
  voucher?: AdminVoucher;
  type?: types | null;
};

const AdminVoucherModal = ({
  voucher,
  type,
  onClose,
}: AdminVoucherModalProps) => {
  const [isUploadDisabled, setIsUploadDisabled] = useState(false);
  const {
    setValues,
    submitForm,
    resetForm,
    setFieldValue,
    values,
  } = useFormikContext<Values>();

  const { isEligibleForAll } = values;

  const eligibleTypes = useMemo(() => ["No code", "Dinamically allocated"], []);
  const [
    showEligibleFacultiesOptions,
    setShowEligibleFacultiesOptions,
  ] = useState(eligibleTypes.includes(voucher?.voucher_type || ""));

  const isOpen = Boolean(type);
  const isAdd = type === types.ADD;

  const handleChange = (option: Option) => {
    setIsUploadDisabled(option === VOUCHER_TYPE_OPTIONS[1]);
    setShowEligibleFacultiesOptions(
      eligibleTypes.includes((option.value as string) || "")
    );
  };

  // Initializes the values when editing a voucher
  useEffect(() => {
    if (!isAdd) {
      setValues({
        availableDate: isAdd ? "" : displayDate(voucher?.available_date || ""),
        expiryDate: isAdd ? "" : displayDate(voucher?.expiry_date || ""),
        name: voucher?.name || "",
        description: voucher?.description || "",
        type: {
          label: voucher?.voucher_type || "",
          value: voucher?.voucher_type || "",
        },
        eligibleFaculties: facultiesToOptions(voucher?.eligible_faculties),
        isEligibleForAll: checkAllFacultiesPresent(voucher?.eligible_faculties),
        image: voucher?.image || "",
        codeList: "",
        emailList: "",
        manualCodeInputs: [{ key: "", value: "" }],
      });
      setIsUploadDisabled(voucher?.voucher_type === "No code");
    }
  }, [setValues, voucher, type]);

  useEffect(() => {
    setFieldValue("type", {
      label: voucher?.voucher_type || "",
      value: voucher?.voucher_type || "",
    });
  }, [voucher]);

  useEffect(() => {
    if (!type) resetForm();
  }, [type]);

  useEffect(() => {
    setShowEligibleFacultiesOptions(
      eligibleTypes.includes(voucher?.voucher_type || "")
    );
  }, [voucher, setShowEligibleFacultiesOptions, eligibleTypes]);

  useEffect(() => {
    setFieldValue("eligibleFaculties", []);
  }, [isEligibleForAll, setFieldValue]);

  return (
    <Modal
      title={isAdd ? "Add Voucher" : "Edit Voucher"}
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
    >
      <DateInput
        name="availableDate"
        label="Available Date (DD/MM/YYYY)"
        className={styles.input}
      />

      <DateInput
        name="expiryDate"
        label="Expiry Date (DD/MM/YYYY)"
        className={styles.input}
      />

      <Input name="name" label="Name" className={styles.input} />

      <TextArea
        name="description"
        label="Description"
        className={styles.input}
      />

      <Select
        name="type"
        label="Voucher Type"
        options={VOUCHER_TYPE_OPTIONS}
        className={styles.input}
        onChange={handleChange}
      />

      {showEligibleFacultiesOptions && (
        <>
          <Select
            autoComplete="none"
            className={styles.facultySelect}
            name="eligibleFaculties"
            label="Eligible Faculties"
            isMulti
            isSearchable
            isDisabled={isEligibleForAll}
            options={FACULTY_OPTIONS}
          />
          <Checkbox
            name="isEligibleForAll"
            className={styles.input}
            label="Eligible for all faculties"
            size="lg"
          />
        </>
      )}

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
            disabled={isUploadDisabled}
          />

          {voucher?.voucher_type !== "Dinamically allocated" && (
            <FileUpload
              label="Upload Voucher Email List"
              type="csv"
              name="emailList"
              className={styles.upload}
              disabled={isUploadDisabled}
            />
          )}
        </>
      )}

      {voucher?.voucher_type !== "Dinamically allocated" && (
        <GroupInput
          name="manualCodeInputs"
          label="Add individual code-email pairs"
          keyLabel="Code"
          valueLabel="Email"
          disabled={isUploadDisabled}
        />
      )}

      <Button className={styles.submit} onClick={submitForm}>
        Submit
      </Button>
    </Modal>
  );
};

export default Home;
