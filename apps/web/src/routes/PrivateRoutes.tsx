import Dashboard from "../components/auth/Dashboard";
import ProtectedRoute from "./protecedRoute";

export const PrivateRoutes = [
    {
        path:"/dashboard",
        element:
        <ProtectedRoute>
        <Dashboard/>
        </ProtectedRoute>

    }
]