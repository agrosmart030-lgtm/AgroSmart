// src/componentes/dashboard/FilterBar.jsx
import React from 'react';
import { Search, XCircle } from 'lucide-react';

const FilterBar = ({ searchTerm, setSearchTerm, filtroCooperativa, setFiltroCooperativa, cooperativasDisponiveis, onClear }) => (
    <div className="w-full bg-white p-4 rounded-2xl shadow-lg border border-gray-200 mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
                type="text"
                placeholder="Pesquisar por grão (ex: Soja, Milho...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
        </div>
        <select 
            value={filtroCooperativa}
            onChange={(e) => setFiltroCooperativa(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
            <option value="">Todas as cooperativas</option>
            {cooperativasDisponiveis.map(coopNome => (
                <option key={coopNome} value={coopNome}>{coopNome}</option>
            ))}
        </select>
        <button 
            onClick={onClear}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
            <XCircle size={18} />
            Limpar
        </button>
    </div>
);

export default FilterBar;
