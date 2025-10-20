import React, { useState, useEffect } from "react";
import { User, Settings, X, Lock, Save } from "lucide-react";
import { useEstadosECidades } from "../../hooks/useEstadosECidades";

export default function ProfileModal({
  isModalOpen,
  closeModal,
  usuario,
  setUsuario,
}) {
  const [form, setForm] = useState(usuario);
  const { estados, cidades } = useEstadosECidades(form.estado);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setForm(usuario);
    setStep(0); // Sempre começa na primeira etapa ao abrir
  }, [usuario, isModalOpen]);

  if (!isModalOpen) return null;

  // Etapas do wizard
  const steps = [
    { label: "Informações Básicas" },
    { label: "Informações Específicas" },
    { label: "Alterar Senha" },
  ];

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

  // Conteúdo de cada etapa
  const renderStep = () => {
    if (step === 0) {
      return (
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
      );
    }
    if (step === 1) {
      return (
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
      );
    }
    if (step === 2) {
      return (
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
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-screen overflow-y-auto border border-green-200">
        {/* Wizard Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-green-200 rounded-t-xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 md:gap-4">
              {steps.map((s, idx) => (
                <button
                  key={s.label}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition
                    ${idx === step
                      ? "bg-green-600 text-white shadow"
                      : "bg-green-100 text-green-800 hover:bg-green-200"}
                  `}
                  onClick={() => setStep(idx)}
                  type="button"
                >
                  {s.label}
                </button>
              ))}
            </div>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
        {/* Conteúdo da etapa */}
        <div className="p-6 space-y-8">{renderStep()}</div>
        {/* Navegação */}
        <div className="flex justify-between items-center px-6 pb-6">
          <button
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            type="button"
          >
            Voltar
          </button>
          <div className="flex gap-2">
            {/* Botão Salvar sempre visível */}
            <button
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-semibold"
              onClick={handleSave}
              type="button"
            >
              <Save className="w-5 h-5" />
              Salvar Alterações
            </button>
            {/* Botão Próximo só aparece se não for a última etapa */}
            {step < steps.length - 1 && (
              <button
                className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                type="button"
              >
                Próximo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
