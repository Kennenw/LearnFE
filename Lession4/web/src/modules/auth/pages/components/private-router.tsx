import { Role } from "@core/enum/user";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];        
}

export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
    const userId = localStorage.getItem("id");
    const userRole = localStorage.getItem("role") as Role | null;

    if (!userId || !userRole) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;   
    }

    return <>{children}</>;
};
