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

  // Dados de exemplo (substitua pela chamada da API)
  const mockUsers = [
    {
      id: 1,
      nome_completo: "João Silva",
      email: "joao.silva@email.com",
      tipo_usuario: "agricultor",
      cidade: "Ribeirão Preto",
      estado: "SP",
      status: "ativo",
      detalhes: {
        cpf: "12345678901",
        nome_propriedade: "Fazenda São João",
        area_cultivada: 150,
      },
    },
    {
      id: 2,
      nome_completo: "Maria Santos",
      email: "maria@empresaabc.com",
      tipo_usuario: "empresario",
      cidade: "São Paulo",
      estado: "SP",
      status: "ativo",
      detalhes: {
        cpf: "98765432100",
        nome_empresa: "Empresa ABC Ltda",
        cnpj: "12345678000199",
      },
    },
    {
      id: 3,
      nome_completo: "Cooperativa Vale Verde",
      email: "contato@valeverde.coop",
      tipo_usuario: "cooperativa",
      cidade: "Campinas",
      estado: "SP",
      status: "inativo",
      detalhes: {
        nome_cooperativa: "Cooperativa Vale Verde",
        cnpj: "98765432000188",
        regiao_atuacao: "Interior de São Paulo",
        numero_associados: 250,
      },
    },
  ];

  // Simular carregamento dos dados da API
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
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

    // Aqui você faria a chamada para a API
    // const response = await fetch(`/api/usuarios/${user.id}/status`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: newStatus })
    // });

    // Simulação de atualização local
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, status: newStatus } : u
    );
    setUsers(updatedUsers);
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
