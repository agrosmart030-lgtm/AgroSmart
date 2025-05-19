import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Cadastro from "./pages/cadastro/Cadastro";
import Dashboard from "./pages/dashboard/Dashboard";
import Faq from "./pages/faq/Faq";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
