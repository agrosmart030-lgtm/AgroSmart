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
import { useState } from "react";
import Footer from "../../componentes/footer";
import Navbar from "../../componentes/navbar";

const SistemaPerfil = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [usuario, setUsuario] = useState({
    id: 1,
    nome_completo: "João Silva Santos",
    email: "joao.silva@email.com",
    cidade: "Campinas",
    estado: "SP",
    tipo_usuario: "cooperativa",
    codigo_ibge: 3509502,
  });

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

  const getTypeIcon = () => {
    switch (usuario.tipo_usuario) {
      case "agricultor":
        return <MapPin className="w-5 h-5" />;
      case "empresario":
        return <Building className="w-5 h-5" />;
      case "cooperativa":
        return <Users className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
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
          <div className="px-6 py-8 border-b border-green-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {usuario.nome_completo
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {usuario.nome_completo}
                  </h2>
                  <p className="text-gray-600">{usuario.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800">
                      {getTypeIcon()}
                      <span className="text-sm font-medium capitalize">
                        {usuario.tipo_usuario}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informações Pessoais
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cidade:</span>
                    <span className="font-medium">
                      {usuario.cidade || "Não informado"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className="font-medium">
                      {usuario.estado || "Não informado"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Código IBGE:</span>
                    <span className="font-medium">
                      {usuario.codigo_ibge || "Não informado"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Dados de{" "}
                  {usuario.tipo_usuario.charAt(0).toUpperCase() +
                    usuario.tipo_usuario.slice(1)}
                </h3>
                <div className="space-y-3">
                  {usuario.tipo_usuario === "agricultor" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CPF:</span>
                        <span className="font-medium">
                          {formatCPF(dadosEspecificos.cpf)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Propriedade:</span>
                        <span className="font-medium">
                          {dadosEspecificos.nome_propriedade}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Área:</span>
                        <span className="font-medium">
                          {dadosEspecificos.area_cultivada} ha
                        </span>
                      </div>
                    </>
                  )}
                  {usuario.tipo_usuario === "empresario" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CPF:</span>
                        <span className="font-medium">
                          {formatCPF(dadosEspecificos.cpf)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Empresa:</span>
                        <span className="font-medium">
                          {dadosEspecificos.nome_empresa || "Não informado"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CNPJ:</span>
                        <span className="font-medium">
                          {formatCNPJ(dadosEspecificos.cnpj) || "Não informado"}
                        </span>
                      </div>
                    </>
                  )}
                  {usuario.tipo_usuario === "cooperativa" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cooperativa:</span>
                        <span className="font-medium">
                          {dadosEspecificos.nome_cooperativa || "Não informado"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CNPJ:</span>
                        <span className="font-medium">
                          {formatCNPJ(dadosEspecificos.cnpj) || "Não informado"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Associados:</span>
                        <span className="font-medium">
                          {dadosEspecificos.numero_associados}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-green-200 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Editar Perfil
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Informações Básicas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Informações Básicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={usuario.nome_completo}
                      onChange={(e) =>
                        handleUsuarioChange("nome_completo", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={usuario.email}
                      onChange={(e) =>
                        handleUsuarioChange("email", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={usuario.cidade}
                      onChange={(e) =>
                        handleUsuarioChange("cidade", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={usuario.estado}
                      onChange={(e) =>
                        handleUsuarioChange("estado", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Selecione o estado</option>
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código IBGE
                    </label>
                    <input
                      type="number"
                      value={usuario.codigo_ibge}
                      onChange={(e) =>
                        handleUsuarioChange(
                          "codigo_ibge",
                          parseInt(e.target.value) || ""
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Código IBGE da cidade"
                    />
                  </div>
                </div>
              </div>

              {/* Informações Específicas do Tipo de Usuário */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  {getTypeIcon()}
                  <span className="text-green-600">
                    Informações de{" "}
                    {usuario.tipo_usuario.charAt(0).toUpperCase() +
                      usuario.tipo_usuario.slice(1)}
                  </span>
                </h3>
                <div className="space-y-6">{renderCamposEspecificos()}</div>
              </div>

              {/* Alteração de Senha */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-600" />
                  Alterar Senha
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                {novaSenha &&
                  confirmarSenha &&
                  novaSenha !== confirmarSenha && (
                    <p className="text-red-600 text-sm mt-2">
                      As senhas não coincidem
                    </p>
                  )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-green-200 rounded-b-lg">
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSalvar}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SistemaPerfil;
