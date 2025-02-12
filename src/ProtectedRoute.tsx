import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const authToken = sessionStorage.getItem('authToken');

    if (!authToken) {
        return <Navigate to="/pin" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;