import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

import useAuth from "hooks/useAuth";
import { Routes } from "constants/routes";

interface AdminRouteProps extends Omit<RouteProps, "component"> {
  component: React.ElementType;
}

const AdminRoute = (props: AdminRouteProps): JSX.Element => {
  const { component: Component, ...routeProps } = props;
  const { isAuth } = useAuth();

  return (
    <Route
      {...routeProps}
      render={(props) =>
        isAuth === "ADMIN" ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: Routes.adminLogin, // change to adminLogin later
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default AdminRoute;
