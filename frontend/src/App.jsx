import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Cadastro from "./pages/cadastro/Cadastro";
import Dashboard from "./pages/dashboard/Dashboard";
import Faq from "./pages/faq/Faq";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import LoginAdmin from "./pages/login/LoginAdmin";
import GenUser from "./pages/admin/GenUser";
import TabelasBanco from "./pages/admin/TabelasBanco";
import FaqAdmin from "./pages/admin/FaqAdmin";
import EstatisticasAdmin from "./pages/admin/EstatisticasAdmin";
import NovoAdmin from "./pages/admin/NovoAdmin";
import LogsAdmin from "./pages/admin/LogsAdmin";

function App() {
  return (
    <Router>
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
        <Route path="/admin/EstatisticasAdmin" element={<EstatisticasAdmin />}/>
        <Route path="/admin/NovoAdmin" element={<NovoAdmin />} />
        <Route path="/admin/LogsAdmin" element={<LogsAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
