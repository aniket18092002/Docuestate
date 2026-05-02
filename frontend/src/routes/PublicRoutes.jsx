import { Navigate, Outlet } from "react-router-dom";
import { isSessionValid, clearSession } from "../utils/auth";

export default function PublicRoutesAuth() {
    const token = localStorage.getItem("auth_token");
    const isValid = isSessionValid();

    //  Not logged in
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    //  Session expired
    if (!isValid) {
        clearSession();
        return <Navigate to="/admin/login" replace />;
    }

    // ✅ Allow access
    return <Outlet />;
}
