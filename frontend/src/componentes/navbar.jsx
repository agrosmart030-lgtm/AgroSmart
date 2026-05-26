import { FaUniversalAccess, FaUser, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/context/AuthContext";
import { exibirAlertaConfirmacao } from "../hooks/useAlert";
import { useState } from "react";
import AccessibilityMenu from "./acessibilidade";
import { useAccessibility } from "../contexts/AccessibilityContext";
import folhaLogo from "../assets/folha.svg";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode } = useAccessibility();
  const isLoggedIn = !!user;
  const isAdmin = user?.tipo_usuario === "admin";

  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);

  const toggleAccessibilityMenu = () => {
    setShowAccessibilityMenu(!showAccessibilityMenu);
  };

  const handleLogout = async () => {
    const confirmed = await exibirAlertaConfirmacao(
      "Tem certeza?",
      "Você realmente deseja sair?"
    );
    if (confirmed) {
      logout();
      window.location.reload();
    }
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        {/* Logo - Dynamically swaps between Vector and Folha based on Dark Mode */}
        <Link to="/" className="flex items-center gap-2">
          <img src={darkMode ? folhaLogo : "/Vector.svg"} alt="AgroSmart" className="w-8 h-8 relative z-10" />
          <span className="text-xl font-extrabold tracking-tighter text-emerald-950 dark-theme-text-inverter">AgroSmart</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 font-manrope text-sm font-semibold tracking-tight">
          {isAdmin ? (
            <>
              <Link to="/admin" className="text-emerald-800/80 hover:text-amber-600 transition-colors duration-300">Dashboard</Link>
              <Link to="/admin/GenUser" className="text-emerald-800/80 hover:text-amber-600 transition-colors duration-300">Usuários</Link>
              <Link to="/admin/TabelasBanco" className="text-emerald-800/80 hover:text-amber-600 transition-colors duration-300">Tabelas</Link>
              <Link to="/admin/FaqAdmin" className="text-emerald-800/80 hover:text-amber-600 transition-colors duration-300">FAQ Admin</Link>
              <Link to="/admin/EstatisticasAdmin" className="text-emerald-800/80 hover:text-amber-600 transition-colors duration-300">Estatísticas</Link>
              <Link to="/admin/NovoAdmin" className="text-emerald-800/80 hover:text-amber-600 transition-colors duration-300">Novo Admin</Link>
              <Link to="/admin/LogsAdmin" className="text-emerald-800/80 hover:text-amber-600 transition-colors duration-300">Logs</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-emerald-800/80 hover:text-amber-600 transition-colors duration-300">Dashboard</Link>
              <Link to="/clima" className="text-emerald-800/80 hover:text-amber-600 transition-colors duration-300">Clima</Link>

              {/* Dropdown Central de Ajuda - Refined Hover behavior */}
              <div className="relative group py-2">
                <button className="text-emerald-800/80 hover:text-amber-600 transition-colors duration-300 flex items-center gap-1">
                  Central de Ajuda
                  <FaChevronDown size={10} className="group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Invisible bridge to prevent closing when moving from button to menu */}
                <div className="absolute top-full left-0 w-full h-2"></div>

                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                  <Link
                    to="/faq"
                    className="block px-4 py-3 text-sm text-emerald-800/80 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                  >
                    Suporte do Sistema
                  </Link>
                  <Link
                    to="/duvidas"
                    className="block px-4 py-3 text-sm text-emerald-800/80 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                  >
                    Consultoria Técnica
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right side: Accessibility + Auth */}
        <div className="flex items-center space-x-6 font-manrope text-sm font-semibold tracking-tight">
          <div className="relative">
            <button
              onClick={toggleAccessibilityMenu}
              className="text-emerald-800/80 hover:text-amber-600 transition-colors duration-300 p-2"
              aria-label="Menu de Acessibilidade"
            >
              <FaUniversalAccess size={20} />
            </button>
            <div className="absolute right-0 top-full mt-2 z-50">
              <AccessibilityMenu
                open={showAccessibilityMenu}
                onClose={() => setShowAccessibilityMenu(false)}
              />
            </div>
          </div>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-emerald-800/80 hover:text-amber-600 transition-colors duration-300">
                Login
              </Link>
              <Link to="/cadastro" className="bg-primary text-on-primary px-5 py-2.5 rounded-full scale-95 transition-transform hover:scale-100">
                Cadastre-se
              </Link>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="flex items-center gap-2 cursor-pointer text-emerald-800/80 hover:text-amber-600 transition-colors duration-300">
                <FaUser size={18} />
                <span>{user.nome || "Usuário"}</span>
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-4 border border-outline-variant">
                <li><Link to="/configuracao">Configurações</Link></li>
                <li>
                  <button onClick={handleLogout} className="text-error">Sair</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}