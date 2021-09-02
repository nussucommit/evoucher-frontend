import React, { useEffect, useState } from "react"
import { Formik, Form, FormikHelpers } from "formik"
import * as yup from "yup"

import useAuth from "hooks/useAuth"
import { changePassword, logout } from "api/auth"
import history from "utils/history"
import { getToken } from "utils/auth"
import { useUser } from "api/user"
import { useOrganization, updateOrganization } from "api/organization"
import useModal from "hooks/useModal"

import { Alert, Button, Heading } from "@commitUI/index"
import { Input } from "components/Form"

import styles from "./ChangePassword.module.css"
import logo from "assets/images/logo.png"
import logo2 from "assets/images/logo2.jpeg"
import { Routes } from "constants/routes"

interface Values {
  old_password: string
  new_password: string
  confirm_password: string
}

const initialValues: Values = {
  old_password: "",
  new_password: "",
  confirm_password: "",
}

const validationSchema: yup.SchemaOf<Values> = yup.object({
  old_password: yup.string().required("Required"),
  new_password: yup.string().required("Required"),
  confirm_password: yup.string().required("Required"),
})

const ChangePassword = () => {
  const { onOpen, onClose } = useModal()
  const { logout: localLogout } = useAuth()
  const { data: user } = useUser()
  const { data: organization } = useOrganization(user?.username)

  useEffect(() => {
    onOpen()
    setTimeout(() => onClose(), 4000)
  }, [])

  const handleChangePassword = async (
    values: Values,
    formikHelpers: FormikHelpers<Values>
  ) => {
    try {
      if (values.new_password !== values.confirm_password) {
        throw new Error("Wrong confirm password")
      }

      const res = await changePassword({
        old_password: values.old_password,
        new_password: values.new_password,
      })

      if (organization?.name) {
        updateOrganization(organization.name, {
          is_first_time_login: false,
        })
      }

      const token = getToken()
      logout({ refresh_token: token!.refresh })
      formikHelpers.setSubmitting(false)

      localLogout()
      if (organization) {
        history.push(Routes.adminLogin)
      } else {
        history.push(Routes.login)
      }
    } catch (e) {
      // To-do: Make an alert card like on twitter to display the error message
      formikHelpers.setFieldError("password", "Wrong password.")
      console.log(e)
    }
  }

  return (
    <>
      {organization?.is_first_time_login && (
        <Alert
          message="Hi There! It seems like this is your first time logging in. Please change your password to ensure the security of your account."
          className={styles.info}
        />
      )}

      <div className={styles.container}>
        <div className={styles.imgContainer}>
          <img
            src={logo2}
            alt="nussu welfare logo"
            className={styles.welfare}
          />
          <img src={logo} alt="nussu commIT logo" className={styles.commit} />
        </div>

        <Heading level={1} className={styles.heading}>
          Change Password
        </Heading>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleChangePassword}
        >
          <Form>
            <Input
              name="old_password"
              label="Old Password"
              className={styles.input}
            />

            <Input
              name="new_password"
              label="New Password"
              type="password"
              className={styles.input}
            />

            <Input
              name="confirm_password"
              label="Confirm Password"
              type="password"
              className={styles.input}
            />

            <Button
              className={styles.btn}
              isSubmit
              // Click handler is handled by the onSubmit props in the parent Formik component
            >
              Change password
            </Button>
          </Form>
        </Formik>
      </div>

      {/* <Modal isOpen={isOpen} onClose={onClose}>
        <Heading>Hi There!</Heading>
        <Heading level={4} className={styles.modalText}>
          Since this is your first time logging in, please change your password.
        </Heading>
      </Modal> */}
    </>
  )
}

export default ChangePassword
