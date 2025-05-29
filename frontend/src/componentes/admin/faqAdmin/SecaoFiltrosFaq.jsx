import React from "react";
import { Search } from "lucide-react";

const SecaoFiltrosFaq = ({
  termoBusca,
  setTermoBusca,
  filtroStatus,
  setFiltroStatus,
  filtroData,
  setFiltroData,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
      </div>
      <select
        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        value={filtroStatus}
        onChange={(e) => setFiltroStatus(e.target.value)}
      >
        <option value="all">Todos os status</option>
        <option value="new">Novas</option>
        <option value="answered">Respondidas</option>
        <option value="closed">Fechadas</option>
      </select>
      <select
        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        value={filtroData}
        onChange={(e) => setFiltroData(e.target.value)}
      >
        <option value="all">Todas as datas</option>
        <option value="today">Hoje</option>
        <option value="week">Esta semana</option>
        <option value="month">Este mês</option>
      </select>
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2">
        <span>🔍</span>
        <span>Filtrar</span>
      </button>
    </div>
  </div>
);

export default SecaoFiltrosFaq;