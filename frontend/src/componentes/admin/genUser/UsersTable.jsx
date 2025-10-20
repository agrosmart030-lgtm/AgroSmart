import React from "react";
import UserTypeBadge from "./UserTypeBadge";
import StatusBadge from "./StatusBadge";
import { Eye, UserX } from "lucide-react";

const UsersTable = ({
  users,
  onViewDetails,
  onToggleStatus,
  pageInfo,
  onPageChange,
}) => {
  const { currentPage, usersPerPage, totalUsers } = pageInfo;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  // Função para gerar os botões de página com ellipsis
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

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localização
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.nome_completo}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <UserTypeBadge type={user.tipo_usuario} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.cidade && user.estado
                    ? `${user.cidade}, ${user.estado}`
                    : "Não informado"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetails(user)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(user)}
                      className={`p-1 rounded ${
                        user.status === "ativo"
                          ? "text-red-600 hover:text-red-900 hover:bg-red-50"
                          : "text-green-600 hover:text-green-900 hover:bg-green-50"
                      }`}
                      title={
                        user.status === "ativo"
                          ? "Desativar usuário"
                          : "Ativar usuário"
                      }
                    >
                      <UserX className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center px-4 py-2">
        {/* Intervalo de usuários exibidos */}
        <span className="text-sm text-gray-600 mb-2 md:mb-0">
          {totalUsers === 0
            ? "Nenhum usuário encontrado"
            : `Mostrando ${Math.min(
                (currentPage - 1) * usersPerPage + 1,
                totalUsers
              )}-${Math.min(
                currentPage * usersPerPage,
                totalUsers
              )} de ${totalUsers} usuários`}
        </span>
        {/* Paginação */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
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
                onClick={() => onPageChange(page)}
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
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded border text-sm disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
