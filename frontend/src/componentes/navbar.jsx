import { FaUser, FaSignOutAlt, FaUniversalAccess } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/folha.svg";
import { useAuth } from "../hooks/context/AuthContext";
import { exibirAlertaConfirmacao } from "../hooks/useAlert";
import { useState } from "react";
import AccessibilityMenu from "./acessibilidade";

export default function Navbar() {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const isAdmin = user?.tipo_usuario === "admin";

  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);

  const toggleAccessibilityMenu = () => {
    setShowAccessibilityMenu(!showAccessibilityMenu);
  };

  const handleLogout = async () => {
    const confirmed = await exibirAlertaConfirmacao("Tem certeza?", "Você realmente deseja sair?");
    if (confirmed) { 
      logout();
      window.location.reload();
    }
  };

  return (
    <div
      className="navbar fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: "#2e7d32", height: "85px" }}
    >
      <div className="navbar-start ml-4 md:ml-12">
        <Link
          to="/"
          className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
        >
          <img src={logo} alt="Logo AgroSmart" className="w-10 h-10" />
          <span className="text-3xl font-bold">
            <span style={{ color: "#ffc107" }}>Agro</span>
            <span style={{ color: "#fff" }}>Smart</span>
          </span>
        </Link>
      </div>
      
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-6 text-white text-base">
          {isAdmin ? (
            <>
              <li>
                <Link 
                  to="/admin"
                  className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Admin
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/GenUser"
                  className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Usuários
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/TabelasBanco"
                  className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Tabelas
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/FaqAdmin"
                  className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-300 hover:-translate-y-0.5"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/EstatisticasAdmin"
                  className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Estatísticas
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/LogsAdmin"
                  className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Logs
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/NovoAdmin"
                  className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Novo Admin
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/dashboard"
                  className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-300"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/cotacoes"
                  className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-300"
                >
                  Histórico de Cotações
                </Link>
              </li>
              <li>
                <Link 
                  to="/clima"
                  className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-300"
                >
                  Clima
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq"
                  className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-300"
                >
                  FAQ
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      
      <div className="navbar-end mr-4 gap-3">
        {/* Botão de Acessibilidade */}
        <div className="relative">
          <button
            onClick={toggleAccessibilityMenu}
            className="btn btn-circle btn-sm text-white hover:scale-105 transition-transform duration-300"
            style={{
              backgroundColor: "rgba(76,175,80,0.6)",
              width: "36px",
              height: "36px",
              minHeight: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            aria-label="Menu de Acessibilidade"
            aria-expanded={showAccessibilityMenu}
          >
            <FaUniversalAccess size={18} />
          </button>
<div className="absolute right-0 bottom-full mb-2 z-50">
            <AccessibilityMenu 
              open={showAccessibilityMenu}
              onClose={() => setShowAccessibilityMenu(false)} 
            />
          </div>
        </div>

        {isAdmin ? (
          // Botão de logout específico para admin
          <button
            onClick={handleLogout}
            className="btn btn-sm text-white border-2 border-white/30 hover:border-white/50 hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: "25px",
              fontWeight: "600"
            }}
          >
            <FaSignOutAlt size={14} />
            Sair
          </button>
        ) : !isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="btn btn-sm text-white hover:scale-105 transition-transform duration-300"
              style={{ backgroundColor: "rgba(76,175,80,0.6)" }}
            >
              Login
            </Link>
            <Link
              to="/cadastro"
              className="btn btn-sm text-white hover:scale-105 transition-transform duration-300"
              style={{ backgroundColor: "rgba(255,193,7,0.8)" }}
            >
              Cadastre-se
            </Link>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-circle btn-sm hover:scale-105 transition-transform duration-300"
              style={{
                backgroundColor: "rgba(76,175,80,0.6)",
                color: "#fff",
              }}
            >
              <FaUser size={20} />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/configuracao">Configurações</Link>
              </li>
              <li>
                <button onClick={handleLogout}>
                  Sair
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}