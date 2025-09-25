// src/componentes/dashboard/PainelDeConteudo.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, MessageCircle, Search } from 'lucide-react';
import TabelaDePrecos from './TabelaDePrecos';

const PainelDeConteudo = ({ cooperativa }) => {
  const navigate = useNavigate();

  if (!cooperativa) {
    return (
        <div className="w-full bg-white rounded-2xl shadow-2xl border border-gray-200/80 flex flex-col h-full items-center justify-center p-10 text-center">
            <Search size={48} className="text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800">Nenhum resultado encontrado</h3>
            <p className="text-gray-500 mt-2">Ajuste os filtros ou clique em "Limpar" para ver todas as cooperativas.</p>
        </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200/80 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-3xl font-bold text-green-800">{cooperativa.nome}</h2>
        <p className="text-gray-600">Cotações atualizadas em tempo real</p>
      </div>

      <div className="p-6 flex-grow">
        <TabelaDePrecos produtos={cooperativa.produtos} />
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
        <a
          href={`https://api.whatsapp.com/send/?phone=${cooperativa.telefone}&text=Olá!&type=phone_number`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-green-600 text-white px-5 py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} />
          Fale com Vendedor
        </a>
        <button
          onClick={() => navigate('/cotacoes')}
          className="flex-1 text-center bg-yellow-400 text-green-900 px-5 py-3 rounded-lg font-semibold shadow-md hover:bg-yellow-500 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <TrendingUp size={20} />
          Ver Histórico Completo
        </button>
      </div>
    </div>
  );
};

export default PainelDeConteudo;