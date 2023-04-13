import {
  createBrowserRouter,
  Link,
  Navigate,
  Outlet,
  useRoutes,
} from "react-router-dom";
import DefualtLayout from "../layout/defualtLayout";
import ProtectedRoute from "../utils/ProtectedRoute";
import Error404Page from "../views/error/404Page";
import LoginPage from "../views/login/loginPage";
import BotPage from "../views/bot";
// import FormBot from "../views/topic/Form";
import FormBot from "../views/bot/Form/index_new";
import UserManagement from "../views/user/userManagement";
import OrgPage from "../views/organization/index";
import TopicPage from "../views/topic";
import DictionaryPage from "../views/dictionary";
import DictionaryForm from "../views/dictionary/form";

export const route = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DefualtLayout />
      </ProtectedRoute>
    ),

    // element: <Outlet />,
    requireAuth: true,
    children: [
      {
        path: "/",
        element: <Navigate to={"/user"} replace />,
      },
      {
        path: "/user",
        element: (
          <ProtectedRoute access={["Super Admin", "Admin"]}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/model",
        element: (
          //   <ProtectedRoute>
          <BotPage />
          //   </ProtectedRoute>
        ),
      },
      { path: "/model/:id", element: <FormBot /> },
      {
        path: "/org",
        element: (
          //   <ProtectedRoute access={["Super Admin", "User"]}>
          <OrgPage />
          //   </ProtectedRoute>
        ),
      },
      { path: "/task", element: <></> },
      { path: "/dictionary", element: <DictionaryPage /> },
      { path: "/dictionary/:id", element: <DictionaryForm /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    requireAuth: false,
  },
  {
    path: "/error",
    element: <DefualtLayout />,
    children: [
      { path: "/error/404", element: <Error404Page /> },
      { path: "/error/500", element: <>500</> },
      { path: "*", navigateElement: { to: "/error/404" } },
      { index: true, navigateElement: { to: "/error/500" } },
    ],
  },
  {
    path: "*",
    element: <Navigate to={"/error/404"} />,
    requireAuth: false,
  },
];
