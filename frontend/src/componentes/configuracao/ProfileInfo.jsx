import React from "react";

export default function ProfileInfo() {
  // Dados de exemplo neutros
  const usuario = {
    nome_completo: "Usuário Exemplo",
    email: "usuario@exemplo.com",
    cidade: "Cidade Exemplo",
    estado: "UF",
    codigo_ibge: "0000000",
    tipo_usuario: "agricultor", // pode ser alterado para testar outros tipos
  };

  const dadosEspecificos = {
    cpf: "00000000000",
    nome_propriedade: "Propriedade Exemplo",
    area_cultivada: 0,
    nome_empresa: "Empresa Exemplo",
    cnpj: "00000000000000",
    nome_cooperativa: "Cooperativa Exemplo",
    numero_associados: 0,
  };

  // Funções de formatação neutras
  const formatCPF = (value) =>
    value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  const formatCNPJ = (value) =>
    value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");

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
              <span className="font-medium">{usuario.cidade}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className="font-medium">{usuario.estado}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Código IBGE:</span>
              <span className="font-medium">{usuario.codigo_ibge}</span>
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
                  <span className="text-gray-600">Empresa:</span>
                  <span className="font-medium">
                    {dadosEspecificos.nome_empresa}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CNPJ:</span>
                  <span className="font-medium">
                    {formatCNPJ(dadosEspecificos.cnpj)}
                  </span>
                </div>
              </>
            )}
            {usuario.tipo_usuario === "cooperativa" && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cooperativa:</span>
                  <span className="font-medium">
                    {dadosEspecificos.nome_cooperativa}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CNPJ:</span>
                  <span className="font-medium">
                    {formatCNPJ(dadosEspecificos.cnpj)}
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
