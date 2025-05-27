import React, { useState, useEffect } from "react";
import { User, Settings, X, Lock, Save } from "lucide-react";
import { useEstadosECidades } from "../../hooks/useEstadosECidades";

export default function ProfileModal({
  isModalOpen,
  closeModal,
  usuario,
  setUsuario,
}) {
  // Estado local para edição
  const [form, setForm] = useState(usuario);
  const { estados, cidades } = useEstadosECidades(form.estado);

  useEffect(() => {
    setForm(usuario);
  }, [usuario, isModalOpen]);

  if (!isModalOpen) return null;

  // Campos específicos por tipo de usuário
  const renderCamposEspecificos = () => {
    switch (form.tipo_usuario) {
      case "agricultor":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF
              </label>
              <input
                type="text"
                value={form.cpf || ""}
                onChange={(e) =>
                  setForm((u) => ({ ...u, cpf: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Propriedade
              </label>
              <input
                type="text"
                value={form.nome_propriedade || ""}
                onChange={(e) =>
                  setForm((u) => ({ ...u, nome_propriedade: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área Cultivada (ha)
              </label>
              <input
                type="number"
                value={form.area_cultivada || ""}
                onChange={(e) =>
                  setForm((u) => ({ ...u, area_cultivada: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        );
      case "empresario":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Empresa
              </label>
              <input
                type="text"
                value={form.nome_empresa || ""}
                onChange={(e) =>
                  setForm((u) => ({ ...u, nome_empresa: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CNPJ
              </label>
              <input
                type="text"
                value={form.cnpj || ""}
                onChange={(e) =>
                  setForm((u) => ({ ...u, cnpj: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        );
      case "cooperativa":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Cooperativa
              </label>
              <input
                type="text"
                value={form.nome_cooperativa || ""}
                onChange={(e) =>
                  setForm((u) => ({ ...u, nome_cooperativa: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CNPJ
              </label>
              <input
                type="text"
                value={form.cnpj || ""}
                onChange={(e) =>
                  setForm((u) => ({ ...u, cnpj: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nº de Associados
              </label>
              <input
                type="number"
                value={form.numero_associados || ""}
                onChange={(e) =>
                  setForm((u) => ({ ...u, numero_associados: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Simulação de salvar (depois trocar por chamada API)
  const handleSave = () => {
    setUsuario(form);
    closeModal();
  };

  return (
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
                  value={form.nome_completo}
                  onChange={(e) =>
                    setForm((u) => ({ ...u, nome_completo: e.target.value }))
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
                  value={form.email}
                  onChange={(e) =>
                    setForm((u) => ({ ...u, email: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={form.estado}
                  onChange={(e) =>
                    setForm((u) => ({
                      ...u,
                      estado: e.target.value,
                      cidade: "",
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Selecione o estado</option>
                  {estados.map((estado) => (
                    <option
                      key={estado.id || estado}
                      value={estado.sigla || estado}
                    >
                      {estado.nome || estado}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <select
                  value={form.cidade}
                  onChange={(e) =>
                    setForm((u) => ({ ...u, cidade: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={!form.estado}
                >
                  <option value="">Selecione a cidade</option>
                  {cidades.map((cidade) => (
                    <option
                      key={cidade.id || cidade.nome}
                      value={cidade.nome || cidade}
                    >
                      {cidade.nome || cidade}
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
                  value={form.codigo_ibge}
                  onChange={(e) =>
                    setForm((u) => ({ ...u, codigo_ibge: e.target.value }))
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
              <span className="text-green-600">
                Informações de{" "}
                {form.tipo_usuario.charAt(0).toUpperCase() +
                  form.tipo_usuario.slice(1)}
              </span>
            </h3>
            <div className="space-y-6">{renderCamposEspecificos()}</div>
          </div>
          {/* Alteração de Senha (apenas visual, sem funcionalidade) */}
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
                  value=""
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha
                </label>
                <input
                  type="password"
                  value=""
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  value=""
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
          {/* Botão de Salvar */}
          <div className="flex justify-end mt-8">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              onClick={handleSave}
            >
              <Save className="w-5 h-5" />
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
