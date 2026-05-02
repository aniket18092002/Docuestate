import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isSessionValid, clearSession } from "../utils/auth";

export default function RequireAuth() {
  const location = useLocation();

  const token = localStorage.getItem("auth_token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const path = location.pathname;
  const isValid = isSessionValid();

  //  Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!isValid) {
    clearSession();
    return <Navigate to="/admin/login" replace />;
  }

  //  ADMIN → allow all admin routes
  if (role === "admin" && path.startsWith("/app")) {
    return <Outlet />;
  }

  //  OWNER → limited admin access
  if (
    role === "owner" &&
    (path === "/app/all-properties" ||
      path === "/app/properties/create")
  ) {
    return <Outlet />;
  }

  //  TENANT / STUDENT → ONLY public properties
  if (
    (role === "tenant" || role === "student") &&
    path === "/properties"
  ) {
    return <Navigate to="/properties" replace />;
  }

  //  BLOCK EVERYTHING ELSE
  if (role === "tenant" || role === "student") {
    return <Navigate to="/properties" replace />;
  }

  return <Navigate to="/app/all-properties" replace />;
}
