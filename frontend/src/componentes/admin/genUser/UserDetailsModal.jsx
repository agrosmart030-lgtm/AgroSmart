import React from "react";
import UserTypeBadge from "./UserTypeBadge";
import StatusBadge from "./StatusBadge";

const UserDetailsModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Detalhes do Usuário
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.nome_completo}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Usuário
                </label>
                <div className="mt-1">
                  <UserTypeBadge type={user.tipo_usuario} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <StatusBadge status={user.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.cidade || "Não informado"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.estado || "Não informado"}
                </p>
              </div>
            </div>

            {user.detalhes && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Informações Específicas
                </label>
                <div className="mt-1 text-sm text-gray-900 space-y-2">
                  {user.tipo_usuario === "agricultor" && (
                    <>
                      <p>
                        <strong>CPF:</strong>{" "}
                        {user.detalhes.cpf || "Não informado"}
                      </p>
                      <p>
                        <strong>Nome da Propriedade:</strong>{" "}
                        {user.detalhes.nome_propriedade || "Não informado"}
                      </p>
                      <p>
                        <strong>Área Cultivada:</strong>{" "}
                        {user.detalhes.area_cultivada
                          ? `${user.detalhes.area_cultivada} ha`
                          : "Não informado"}
                      </p>
                    </>
                  )}
                  {user.tipo_usuario === "empresario" && (
                    <>
                      <p>
                        <strong>CPF:</strong>{" "}
                        {user.detalhes.cpf || "Não informado"}
                      </p>
                      <p>
                        <strong>Nome da Empresa:</strong>{" "}
                        {user.detalhes.nome_empresa || "Não informado"}
                      </p>
                      <p>
                        <strong>CNPJ:</strong>{" "}
                        {user.detalhes.cnpj || "Não informado"}
                      </p>
                    </>
                  )}
                  {user.tipo_usuario === "cooperativa" && (
                    <>
                      <p>
                        <strong>Nome da Cooperativa:</strong>{" "}
                        {user.detalhes.nome_cooperativa || "Não informado"}
                      </p>
                      <p>
                        <strong>CNPJ:</strong>{" "}
                        {user.detalhes.cnpj || "Não informado"}
                      </p>
                      <p>
                        <strong>Região de Atuação:</strong>{" "}
                        {user.detalhes.regiao_atuacao || "Não informado"}
                      </p>
                      <p>
                        <strong>Número de Associados:</strong>{" "}
                        {user.detalhes.numero_associados || "Não informado"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
