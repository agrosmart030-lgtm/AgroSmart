import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { AuthProvider } from "./hooks/context/AuthContext";

import Cadastro from "./pages/cadastro/Cadastro";
import Configuraçao from "./pages/configuracao/Configuracao";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Dashboard from "./pages/dashboard/Dashboard";
import Faq from "./pages/faq/Faq";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import LoginAdmin from "./pages/login/LoginAdmin";
import GenUser from "./pages/admin/GenUser";
import TabelasBanco from "./pages/admin/TabelasBanco";
import FaqAdmin from "./pages/admin/FaqAdmin";
import EstatisticasAdmin from "./pages/admin/EstatisticasAdmin";
import NovoAdmin from "./pages/admin/NovoAdmin";
import LogsAdmin from "./pages/admin/LogsAdmin";
import Clima from "./pages/clima/clima";
import GrainPriceHistory from "./pages/historico/historico";
import AccessibilityMenu from "./componentes/acessibilidade"; // ⬅️ Aqui está o menu de acessibilidade


function App() {
  return (
    <AuthProvider>
      <Router>
          <AccessibilityMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/LoginAdmin" element={<LoginAdmin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/GenUser" element={<GenUser />} />
          <Route path="/admin/TabelasBanco" element={<TabelasBanco />} />
          <Route path="/admin/FaqAdmin" element={<FaqAdmin />} />
          <Route
            path="/admin/EstatisticasAdmin"
            element={<EstatisticasAdmin />}
          />
          <Route path="/admin/NovoAdmin" element={<NovoAdmin />} />
          <Route path="/admin/LogsAdmin" element={<LogsAdmin />} />
          <Route path="/configuracao" element={<Configuraçao />} />
          <Route path="/clima" element={<Clima />} />
          <Route path="/cotacoes" element={<GrainPriceHistory />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
