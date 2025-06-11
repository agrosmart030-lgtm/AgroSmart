// src/componentes/dashboard/MarketHighlightsCard.jsx
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MarketHighlightsCard = () => (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-5 mt-8">
        <h4 className="font-bold text-gray-800 text-lg mb-4">Destaques do Dia</h4>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Maior Alta</p>
                    <p className="font-bold text-gray-800">TRIGO</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-green-600 flex items-center gap-1 justify-end">
                        <ArrowUpRight size={16} />
                        +2.1%
                    </p>
                    <p className="text-sm text-gray-600">R$ 67,00</p>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Maior Baixa</p>
                    <p className="font-bold text-gray-800">MILHO</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-red-600 flex items-center gap-1 justify-end">
                        <ArrowDownRight size={16} />
                        -0.6%
                    </p>
                    <p className="text-sm text-gray-600">R$ 55,90</p>
                </div>
            </div>
        </div>
    </div>
);

export default MarketHighlightsCard;
