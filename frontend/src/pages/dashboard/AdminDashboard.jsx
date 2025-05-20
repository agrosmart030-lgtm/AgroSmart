import React from "react";
import Navbar from "../../componentes/navbar";
import Footer from "../../componentes/footer";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar isAdmin />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-green-800">
          Painel do Administrador
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Usuários */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-5xl mb-2 text-green-600">👤</span>
            <h2 className="text-xl font-semibold mb-2">Gerenciar Usuários</h2>
            <p className="text-gray-600 mb-4 text-center">
              Visualize, edite ou remova usuários cadastrados.
            </p>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Acessar
            </button>
          </div>
          {/* Card Tabelas */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-5xl mb-2 text-yellow-500">📊</span>
            <h2 className="text-xl font-semibold mb-2">Tabelas do Banco</h2>
            <p className="text-gray-600 mb-4 text-center">
              Consulte e gerencie as tabelas do sistema.
            </p>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
              Acessar
            </button>
          </div>
          {/* Card FAQ */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-5xl mb-2 text-blue-500">❓</span>
            <h2 className="text-xl font-semibold mb-2">Mensagens do FAQ</h2>
            <p className="text-gray-600 mb-4 text-center">
              Veja e responda dúvidas enviadas pelos usuários.
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Acessar
            </button>
          </div>
          {/* Card Estatísticas */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-5xl mb-2 text-purple-500">📈</span>
            <h2 className="text-xl font-semibold mb-2">Estatísticas Gerais</h2>
            <p className="text-gray-600 mb-4 text-center">
              Acompanhe dados e métricas do sistema.
            </p>
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition">
              Ver Estatísticas
            </button>
          </div>
          {/* Card Novo Admin */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-5xl mb-2 text-red-500">🖥️</span>
            <h2 className="text-xl font-semibold mb-2">Adicionar novo Admin</h2>
            <p className="text-gray-600 mb-4 text-center">
              Adicionar um novo administrador ao sistema.
            </p>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
              Criar Admin
            </button>
          </div>
          {/* Card Logs */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-5xl mb-2 text-black">📋</span>
            <h2 className="text-xl font-semibold mb-2">Tabelas Logs</h2>
            <p className="text-gray-600 mb-4 text-center">
              Consulte os registros da pagina.
            </p>
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-black transition">
              Consultar Logs
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
