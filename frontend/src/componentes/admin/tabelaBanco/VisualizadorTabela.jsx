import React, { useState } from "react";
import { Database, Search, Download, RefreshCw } from "lucide-react";

const VisualizadorTabela = ({ tabela, dados, carregando, aoAtualizar }) => {
  // Paginação local
  const [currentPage, setCurrentPage] = useState(1);
  const registrosPorPagina = 10;
  const totalRegistros = dados.length;
  const totalPages = Math.ceil(totalRegistros / registrosPorPagina);
  const indexOfLast = currentPage * registrosPorPagina;
  const indexOfFirst = indexOfLast - registrosPorPagina;
  const registrosPagina = dados.slice(indexOfFirst, indexOfLast);

  // Gera botões de página com ellipsis
  const getPageButtons = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

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
            {totalRegistros === 0
              ? "Nenhum registro encontrado"
              : `Mostrando ${Math.min(
                  indexOfFirst + 1,
                  totalRegistros
                )}-${Math.min(
                  indexOfLast,
                  totalRegistros
                )} de ${totalRegistros} registros`}
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
              {registrosPagina.map((linha, rowIndex) => (
                <tr
                  key={linha.id || Object.values(linha).join("-") || rowIndex}
                  className="hover:bg-gray-50"
                >
                  {tabela.colunas.map((coluna) => (
                    <td
                      key={coluna.nome}
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

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center space-x-1">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded border text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            {getPageButtons().map((page, idx) =>
              page === "..." ? (
                <span key={idx} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2 py-1 rounded border text-sm ${
                    currentPage === page
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded border text-sm disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizadorTabela;
