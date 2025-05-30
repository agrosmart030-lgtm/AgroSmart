import { Edit, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import Footer from "../../componentes/footer";
import Navbar from "../../componentes/navbar";
import { useAuth } from "../../hooks/context/AuthContext";
import ProfileHeader from "../../componentes/configuracao/ProfileHeader";
import ProfileInfo from "../../componentes/configuracao/ProfileInfo";
import ProfileModal from "../../componentes/configuracao/ProfileModal";

const SistemaPerfil = () => {
  const { logout, isLoggedIn, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado centralizado do usuário
  const [usuario, setUsuario] = useState(null);

  // Buscar dados do usuário autenticado ao carregar a página
  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:5001/api/configuracao/${user.id}`)
        .then((res) => res.json())
        .then((data) => setUsuario(data))
        .catch(() => {
          // fallback: mantém usuário nulo ou mostra erro
        });
    }
  }, [user]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = () => {
    logout();
  };

  // Tela inicial quando não logado
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-800 mb-4">
              AgroSmart
            </h1>
            <p className="text-gray-600 mb-6">
              Você foi desconectado com sucesso
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-gray-600 text-lg">
          Carregando dados do perfil...
        </div>
      </div>
    );
  }

  return (
    <div className="70-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <Navbar isLoggedIn={true} />
      {/* Main Content */}
      <main className="max-w-4xl  mx-auto py-20 px-4 sm:px-6 lg:px-8 mt-20 ">
        <div className="bg-white rounded-lg shadow-sm border border-green-200">
          {/* Profile Header */}
          <ProfileHeader usuario={usuario} />
          {/* Profile Info */}
          <ProfileInfo usuario={usuario} />
          {/* Action Buttons */}
          <div className="px-6 py-4 bg-green-50 border-t border-green-100 flex justify-between items-center rounded-b-lg">
            <button
              onClick={openModal}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              <Edit className="w-5 h-5" />
              Editar Perfil
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </main>
      <Footer />
      {/* Modal recebe usuario e função de atualização */}
      <ProfileModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        usuario={usuario}
        setUsuario={setUsuario}
      />
    </div>
  );
};

export default SistemaPerfil;
