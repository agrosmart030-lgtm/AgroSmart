import {
  Building,
  Edit,
  Lock,
  LogOut,
  MapPin,
  Save,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import Footer from "../../componentes/footer";
import Navbar from "../../componentes/navbar";
import { useAuth } from "../../context/AuthContext";
import ProfileHeader from "../../componentes/configuracao/ProfileHeader";
import ProfileInfo from "../../componentes/configuracao/ProfileInfo";
import ProfileModal from "../../componentes/configuracao/ProfileModal";

const SistemaPerfil = () => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [usuario, setUsuario] = useState(user || {});

  useEffect(() => {
    if (user) {
      setUsuario(user);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  const [dadosEspecificos, setDadosEspecificos] = useState({
    // Dados do agricultor
    cpf: "12345678901",
    nome_propriedade: "Fazenda Santa Clara",
    area_cultivada: 150.5,
    // Dados do empresário
    nome_empresa: "",
    cnpj: "",
    // Dados da cooperativa
    nome_cooperativa: "",
    regiao_atuacao: "",
    numero_associados: 0,
  });

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const estados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  const handleUsuarioChange = (field, value) => {
    setUsuario((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDadosEspecificosChange = (field, value) => {
    setDadosEspecificos((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatCNPJ = (value) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  };

  const handleSalvar = async () => {
    setIsLoading(true);

    // Simular chamada da API
    setTimeout(() => {
      alert("Configurações salvas com sucesso!");
      setIsLoading(false);
      setIsModalOpen(false);
    }, 1500);
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      setIsLoggedIn(false);
      logout();
      alert("Logout realizado com sucesso!");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Resetar campos de senha ao fechar
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  const renderCamposEspecificos = () => {
    switch (usuario.tipo_usuario) {
      case "agricultor":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  value={formatCPF(dadosEspecificos.cpf)}
                  onChange={(e) =>
                    handleDadosEspecificosChange(
                      "cpf",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  maxLength={14}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Área Cultivada (hectares)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={dadosEspecificos.area_cultivada}
                  onChange={(e) =>
                    handleDadosEspecificosChange(
                      "area_cultivada",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Propriedade
              </label>
              <input
                type="text"
                value={dadosEspecificos.nome_propriedade}
                onChange={(e) =>
                  handleDadosEspecificosChange(
                    "nome_propriedade",
                    e.target.value
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Nome da sua propriedade"
              />
            </div>
          </>
        );

      case "empresario":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  value={formatCPF(dadosEspecificos.cpf)}
                  onChange={(e) =>
                    handleDadosEspecificosChange(
                      "cpf",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  maxLength={14}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ
                </label>
                <input
                  type="text"
                  value={formatCNPJ(dadosEspecificos.cnpj)}
                  onChange={(e) =>
                    handleDadosEspecificosChange(
                      "cnpj",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  maxLength={18}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Empresa *
              </label>
              <input
                type="text"
                value={dadosEspecificos.nome_empresa}
                onChange={(e) =>
                  handleDadosEspecificosChange("nome_empresa", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Nome da sua empresa"
                required
              />
            </div>
          </>
        );

      case "cooperativa":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ *
                </label>
                <input
                  type="text"
                  value={formatCNPJ(dadosEspecificos.cnpj)}
                  onChange={(e) =>
                    handleDadosEspecificosChange(
                      "cnpj",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  maxLength={18}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Associados
                </label>
                <input
                  type="number"
                  value={dadosEspecificos.numero_associados}
                  onChange={(e) =>
                    handleDadosEspecificosChange(
                      "numero_associados",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Cooperativa *
                </label>
                <input
                  type="text"
                  value={dadosEspecificos.nome_cooperativa}
                  onChange={(e) =>
                    handleDadosEspecificosChange(
                      "nome_cooperativa",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Nome da cooperativa"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Região de Atuação
                </label>
                <input
                  type="text"
                  value={dadosEspecificos.regiao_atuacao}
                  onChange={(e) =>
                    handleDadosEspecificosChange(
                      "regiao_atuacao",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: Interior de São Paulo"
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };


  // Tela inicial quando não logado
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-800 mb-4">
              Sistema Agrícola
            </h1>
            <p className="text-gray-600 mb-6">
              Você foi desconectado com sucesso
            </p>
            <button
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Fazer Login
            </button>
          </div>
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
          <ProfileInfo
            usuario={usuario}
            dadosEspecificos={dadosEspecificos}
            formatCPF={formatCPF}
            formatCNPJ={formatCNPJ}
          />
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
      {/* Modal */}
      <ProfileModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        usuario={usuario}
        handleUsuarioChange={handleUsuarioChange}
        estados={estados}
        dadosEspecificos={dadosEspecificos}
        handleDadosEspecificosChange={handleDadosEspecificosChange}
        renderCamposEspecificos={renderCamposEspecificos}
        senhaAtual={senhaAtual}
        setSenhaAtual={setSenhaAtual}
        novaSenha={novaSenha}
        setNovaSenha={setNovaSenha}
        confirmarSenha={confirmarSenha}
        setConfirmarSenha={setConfirmarSenha}
        handleSalvar={handleSalvar}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SistemaPerfil;
