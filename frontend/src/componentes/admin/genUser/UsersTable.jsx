import React from "react";
import UserTypeBadge from "./UserTypeBadge";
import StatusBadge from "./StatusBadge";
import { Eye, UserX } from "lucide-react";

const UsersTable = ({ users, onViewDetails, onToggleStatus }) => {
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
    </div>
  );
};

export default UsersTable;
