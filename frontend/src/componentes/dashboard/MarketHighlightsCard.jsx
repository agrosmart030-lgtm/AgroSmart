// src/componentes/dashboard/MarketHighlightsCard.jsx
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MarketHighlightsCard = () => (
    <div className="w-full bg-[#012d1d] rounded-2xl shadow-lg border border-[#024029] p-5">
        <h4 className="font-extrabold text-[#c0edd4] text-lg mb-4 font-manrope">Destaques do Dia</h4>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-[#8abcd4] opacity-80">Maior Alta</p>
                    <p className="font-bold text-white tracking-widest uppercase">TRIGO</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-[#c0edd4] flex items-center gap-1 justify-end">
                        <ArrowUpRight size={16} />
                        +2.1%
                    </p>
                    <p className="text-xs text-white/70">R$ 67,00</p>
                </div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <div>
                    <p className="text-sm text-[#8abcd4] opacity-80">Maior Baixa</p>
                    <p className="font-bold text-white tracking-widest uppercase">MILHO</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-[#ffb4ab] flex items-center gap-1 justify-end">
                        <ArrowDownRight size={16} />
                        -0.6%
                    </p>
                    <p className="text-xs text-white/70">R$ 55,90</p>
                </div>
            </div>
        </div>
    </div>
);

export default MarketHighlightsCard;
