import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;