import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redireciona para o login se não estiver logado, mas salva a localização atual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.tipo_usuario !== requiredRole) {
    // Se o usuário não tiver a permissão necessária (ex: usuário comum tentando acessar admin)
    // Redireciona para o dashboard ou outra página segura
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
