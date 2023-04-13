import { AlignCenterOutlined } from "@ant-design/icons";
import React from "react";
import { Navigate, Outlet, redirect } from "react-router-dom";
import { useAuth } from "./auth/AuthWrapper";

const ProtectedRoute = ({ access, redirectPath = "/login", children }) => {
  const auth = useAuth();
  console.log("acc", access);
  if (
    !auth.user
    // || (auth.user.role != access && access != undefined)
  ) {
    return <Navigate to={redirectPath} replace />;
  } else if (auth.user || (access && access?.length > 1)) {
    const result =
      access &&
      access.filter((d) => {
        if (d == auth.user.role) {
          return d;
        }
      });
    console.log("protect rote", result);
    if (result?.length == 0) {
      return (
        //     // <Navigate to={auth.user.role == "User" ? "/task" : "/user"} replace />
        <Navigate to={redirectPath} replace />
      );
    }

    return children ? children : <Outlet />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
