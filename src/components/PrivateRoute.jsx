import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext.jsx";

const PrivateRoute = () => {
    const { isAuthenticated } = useContext(AuthContext);

    // Si el usuario no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    // Si el usuario está autenticado, renderizar la ruta solicitada
    return <Outlet />;
};

export default PrivateRoute;