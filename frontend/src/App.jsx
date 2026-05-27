import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { AuthProvider } from "./hooks/context/AuthContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";

import Cadastro from "./pages/cadastro/Cadastro";
import Configuraçao from "./pages/configuracao/Configuracao";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Dashboard from "./pages/dashboard/Dashboard";
import Faq from "./pages/faq/Faq";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import NotFound from "./pages/notfound/NotFound";
import EsqueciSenha from "./pages/login/EsqueciSenha";
import RedefinirSenha from "./pages/login/RedefinirSenha";
// import LoginAdmin from "./pages/login/LoginAdmin";
import GenUser from "./pages/admin/GenUser";
import TabelasBanco from "./pages/admin/TabelasBanco";
import FaqAdmin from "./pages/admin/FaqAdmin";
import EstatisticasAdmin from "./pages/admin/EstatisticasAdmin";
import NovoAdmin from "./pages/admin/NovoAdmin";
import LogsAdmin from "./pages/admin/LogsAdmin";
import Clima from "./pages/clima/Clima";
import AccessibilityMenu from "./componentes/acessibilidade";
import RespondeAgro from "./pages/duvidas/RespondeAgro";


import ProtectedRoute from "./componentes/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/duvidas" element={<RespondeAgro />} />
          
          {/* Rotas Protegidas de Usuário */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/configuracao" element={
            <ProtectedRoute>
              <Configuraçao />
            </ProtectedRoute>
          } />
          <Route path="/clima" element={
            <ProtectedRoute>
              <Clima />
            </ProtectedRoute>
          } />

          {/* Rotas Protegidas de Admin */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/GenUser" element={
            <ProtectedRoute requiredRole="admin">
              <GenUser />
            </ProtectedRoute>
          } />
          <Route path="/admin/TabelasBanco" element={
            <ProtectedRoute requiredRole="admin">
              <TabelasBanco />
            </ProtectedRoute>
          } />
          <Route path="/admin/FaqAdmin" element={
            <ProtectedRoute requiredRole="admin">
              <FaqAdmin />
            </ProtectedRoute>
          } />
          <Route path="/admin/EstatisticasAdmin" element={
            <ProtectedRoute requiredRole="admin">
              <EstatisticasAdmin />
            </ProtectedRoute>
          } />
          <Route path="/admin/NovoAdmin" element={
            <ProtectedRoute requiredRole="admin">
              <NovoAdmin />
            </ProtectedRoute>
          } />
          <Route path="/admin/LogsAdmin" element={
            <ProtectedRoute requiredRole="admin">
              <LogsAdmin />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;
