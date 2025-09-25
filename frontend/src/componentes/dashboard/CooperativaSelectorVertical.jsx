// src/componentes/dashboard/CooperativaSelectorVertical.jsx
import React from 'react';

const CooperativaSelectorVertical = ({ cooperativas, selecionada, onSelect }) => (
  <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
    <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">
        {cooperativas.length > 0 ? 'Cooperativas Encontradas' : 'Nenhuma cooperativa encontrada'}
    </h3>
    <div className="flex flex-col gap-2">
      {cooperativas.map((coop) => (
        <button
          key={coop.nome}
          onClick={() => onSelect(coop)}
          className={`w-full p-3 flex items-center justify-start gap-4 rounded-xl transition-all duration-200
                      ${selecionada?.nome === coop.nome 
                          ? 'bg-green-50 border-l-4 border-green-500'
                          : 'border-l-4 border-transparent hover:bg-gray-100'}`}
        >
          <div className="h-10 w-16 flex-shrink-0 flex items-center justify-center">
            <img src={coop.logo} alt={coop.nome} className="max-h-full max-w-full object-contain" />
          </div>
          <span className="font-semibold text-gray-800">
            {coop.nome}
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default CooperativaSelectorVertical;
