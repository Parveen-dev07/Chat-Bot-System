import Login from "../components/Login";
import Register from "../components/Register";
import PageNotFound from "../pages/PageNotFound";
import { Navigate } from "react-router-dom";

export const PublicRoutes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/page-not-found",
    element: <PageNotFound />,
  },
];
