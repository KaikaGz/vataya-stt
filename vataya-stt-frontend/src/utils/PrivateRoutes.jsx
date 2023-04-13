import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = ({ value }) => {
  let auth = { token: value };
  return auth.token ? <Navigate to="/home" /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
