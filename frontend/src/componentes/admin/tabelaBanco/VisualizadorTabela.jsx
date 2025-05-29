import React from "react";
import { Database, Search, Download, RefreshCw } from "lucide-react";

const VisualizadorTabela = ({ tabela, dados, carregando, aoAtualizar }) => {
  if (!tabela) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Selecione uma Tabela
        </h3>
        <p className="text-gray-600">
          Escolha uma tabela na lista acima para visualizar seus dados.
        </p>
      </div>
    );
  }

  if (carregando) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {tabela.nomeExibicao}
          </h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {tabela.nomeExibicao}
            </h3>
            <p className="text-sm text-gray-600">{tabela.descricao}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={aoAtualizar}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Atualizar</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Total de registros:{" "}
            <span className="font-medium">{dados.length}</span>
          </p>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar na tabela..."
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {tabela.colunas.map((coluna, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{coluna.nomeExibicao}</span>
                      {coluna.ePrimaria && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          PK
                        </span>
                      )}
                      {coluna.eEstrangeira && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          FK
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-normal mt-1">
                      {coluna.tipo}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dados.slice(0, 10).map((linha, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {tabela.colunas.map((coluna, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {linha[coluna.nome] !== null &&
                      linha[coluna.nome] !== undefined ? (
                        String(linha[coluna.nome])
                      ) : (
                        <span className="text-gray-400 italic">null</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {dados.length > 10 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Mostrando 10 de {dados.length} registros
            </p>
            <button className="mt-2 px-4 py-2 text-sm text-green-600 hover:text-green-800 font-medium">
              Carregar mais registros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizadorTabela;
