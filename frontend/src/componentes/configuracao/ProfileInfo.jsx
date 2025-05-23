import React from "react";

export default function ProfileInfo({
  usuario,
  dadosEspecificos,
  formatCPF,
  formatCNPJ,
}) {
  return (
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
            {usuario.tipo_usuario?.charAt(0).toUpperCase() +
              usuario.tipo_usuario?.slice(1)}
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
  );
}
