// src/componentes/dashboard/FilterBar.jsx
import React from 'react';
import { Search, XCircle } from 'lucide-react';

const FilterBar = ({ searchTerm, setSearchTerm, filtroCooperativa, setFiltroCooperativa, cooperativasDisponiveis, onClear }) => (
    <div className="w-full flex flex-col sm:flex-row gap-3 items-center mb-8 mt-2">
        <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
                type="text"
                placeholder="Pesquisar por grão (ex: Soja, Milho...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 shadow-sm rounded-full focus:ring-2 focus:ring-primary text-sm font-semibold outline-none transition-shadow text-gray-700"
            />
        </div>
        <select 
            value={filtroCooperativa}
            onChange={(e) => setFiltroCooperativa(e.target.value)}
            className="w-full sm:w-auto px-6 py-3.5 bg-white border border-gray-200 shadow-sm rounded-full focus:ring-2 focus:ring-primary text-sm font-bold text-gray-600 outline-none transition-shadow cursor-pointer"
        >
            <option value="">Todas as cooperativas</option>
            {cooperativasDisponiveis.map(coopNome => (
                <option key={coopNome} value={coopNome}>{coopNome}</option>
            ))}
        </select>
        <button 
            onClick={onClear}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary/20 transition-colors shadow-sm text-sm outline-none border border-transparent"
        >
            <XCircle size={18} />
            Limpar
        </button>
    </div>
);

export default FilterBar;
