import React, { useState, useEffect } from "react";
import Navbar from "../../componentes/navbar";
import UserFilters from "../../componentes/admin/genUser/UserFilters";
import UsersTable from "../../componentes/admin/genUser/UsersTable";
import UserDetailsModal from "../../componentes/admin/genUser/UserDetailsModal";

// Componente Principal
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    tipoUsuario: "",
    status: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Buscar usuários da API
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5001/api/usuarios");
        const data = await response.json();
        // Remover campo senha antes de exibir na tabela
        const dataSemSenha = data.map((user) => {
          const { senha: _, ...rest } = user;
          return rest;
        });
        setUsers(dataSemSenha);
        setFilteredUsers(dataSemSenha);
      } catch {
        setUsers([]);
        setFilteredUsers([]);
      }
      setLoading(false);
    };
    loadUsers();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = users;

    if (filters.search) {
      filtered = filtered.filter(
        (user) =>
          user.nome_completo
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.tipoUsuario) {
      filtered = filtered.filter(
        (user) => user.tipo_usuario === filters.tipoUsuario
      );
    }

    if (filters.status) {
      filtered = filtered.filter((user) => user.status === filters.status);
    }

    setFilteredUsers(filtered);
  }, [filters, users]);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "ativo" ? "inativo" : "ativo";
    try {
      await fetch(`http://localhost:5001/api/usuarios/${user.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, status: newStatus } : u
      );
      setUsers(updatedUsers);
    } catch {
      // Tratar erro se necessário
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando usuários...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-600">
            Visualize, edite ou remova usuários cadastrados no sistema.
          </p>
        </div>
        <UserFilters filters={filters} onFiltersChange={setFilters} />
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Mostrando {filteredUsers.length} de {users.length} usuários
          </p>
        </div>
        <UsersTable
          users={filteredUsers}
          onViewDetails={handleViewDetails}
          onToggleStatus={handleToggleStatus}
        />
        <UserDetailsModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default UserManagement;
