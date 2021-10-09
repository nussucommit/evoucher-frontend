import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as yup from "yup";

import { Routes } from "constants/routes";
import { login, verifyOrganization } from "api/auth";
import history from "utils/history";
import useAuth from "hooks/useAuth";
import useRequestState from "hooks/useRequestState";

import { Button, Heading, Alert } from "@commitUI/index";
import { Input } from "components/Form";
import Navbar from "components/Navbar";

import styles from "./AdminLogin.module.css";
import logo from "assets/images/logo.png";
import logo2 from "assets/images/logo2.jpeg";

interface Values {
  username: string;
  password: string;
}

const AdminLogin = () => {
  const state = useRequestState();
  const initialValues: Values = {
    username: "",
    password: "",
  };

  const validationSchema: yup.SchemaOf<Values> = yup.object({
    username: yup.string().required("Required"),
    password: yup.string().required("Required"),
  });

  const { adminLogin: localLogin } = useAuth(); // Local session login

  const handleLogin = async (
    values: Values,
    formikHelpers: FormikHelpers<Values>
  ) => {
    try {
      state.start();
      await verifyOrganization({
        username: values.username,
      });
      const { data: token } = await login({
        username: values.username,
        password: values.password,
      });
      localLogin(token);
      formikHelpers.setSubmitting(false);
      history.push(Routes.adminHome);
    } catch (e) {
      state.setError(
        "The username and password you entered did not match our records. Please try again."
      );
    }
    state.end();
  };

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
          Admin Sign In
        </Heading>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            {Boolean(state.error) && (
              <Alert
                status="error"
                message={state.error || ""}
                className={styles.error}
              />
            )}

            <Input
              autoFocus
              name="username"
              label="Username"
              className={styles.input}
            />

            <Input
              name="password"
              label="Password"
              type="password"
              className={styles.input}
            />

            <Button
              className={styles.btn}
              // Click handler is handled by the onSubmit props in the parent Formik component
              isSubmit
              isLoading={state.loading}
            >
              Log In
            </Button>
          </Form>
        </Formik>

        <div className={styles.linkTextContainer}>
          <Button type="text">Forgot password?</Button>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
