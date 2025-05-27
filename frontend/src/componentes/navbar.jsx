import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/folha.svg"; // ajuste o caminho conforme sua estrutura
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const isAdmin = user?.tipo_usuario === "admin";

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
                <Link to="/admin">Admin</Link>
              </li>
              <li>
                <Link to="/admin/GenUser">Usuários</Link>
              </li>
              <li>
                <Link to="/admin/TabelasBanco">Tabelas</Link>
              </li>
              <li>
                <Link to="/admin/FaqAdmin">FAQ</Link>
              </li>
              <li>
                <Link to="/admin/EstatisticasAdmin">Estatísticas</Link>
              </li>
              <li>
                <Link to="/admin/LogsAdmin">Logs</Link>
              </li>
              <li>
                <Link to="/admin/NovoAdmin">Novo Admin</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/cotacoes">Cotações</Link>
              </li>
              <li>
                <Link to="/clima">Clima</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="navbar-end mr-4 gap-2">
        {isAdmin ? null : !isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="btn btn-sm text-white"
              style={{ backgroundColor: "rgba(76,175,80,0.6)" }}
            >
              Login
            </Link>
            <Link
              to="/cadastro"
              className="btn btn-sm text-white"
              style={{ backgroundColor: "rgba(255,193,7,0.8)" }}
            >
              Cadastre-se
            </Link>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-circle btn-sm"
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
                <button
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }}
                >
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
