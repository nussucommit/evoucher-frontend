import React, { useState } from "react"
import { Formik, Form, FormikHelpers } from "formik"
import * as yup from "yup"

import useAuth from "hooks/useAuth"
import { changePassword, logout } from "api/auth"
import history from "utils/history"
import { getToken } from "utils/auth"

import { Button, Heading } from "@commitUI/index"
import { Input } from "components/Form"
import Navbar from "components/Navbar"

import styles from "./ChangePassword.module.css"
import logo from "assets/images/logo.png"
import logo2 from "assets/images/logo2.jpeg"

interface Values {
  old_password: string
  new_password: string
  confirm_password: string
}

const ChangePassword = () => {
  const { logout: localLogout } = useAuth()
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

      const token = getToken()
      console.log(token)
      logout({ refresh_token: token!.refresh })
      formikHelpers.setSubmitting(false)
      localLogout()
      history.push("/login")
    } catch (e) {
      // To-do: Make an alert card like on twitter to display the error message
      formikHelpers.setFieldError("password", "Wrong username or password.")
      console.log(e)
    }
  }

  return (
    <>
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
    </>
  )
}

export default ChangePassword
