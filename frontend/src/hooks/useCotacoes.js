// src/hooks/useCotacoes.js
import { useState, useMemo } from 'react';

export const useCotacoes = (initialData) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroCooperativa, setFiltroCooperativa] = useState('');

    const cooperativasDisponiveis = useMemo(() => {
        return Array.from(new Set(initialData.map(coop => coop.nome))).sort();
    }, [initialData]);
    
    const filteredData = useMemo(() => {
        let data = JSON.parse(JSON.stringify(initialData));

        if (filtroCooperativa) {
            data = data.filter(coop => coop.nome === filtroCooperativa);
        }

        if (searchTerm) {
            return data.map(coop => ({
                ...coop,
                produtos: coop.produtos.filter(prod =>
                    prod.nome.toLowerCase().includes(searchTerm.toLowerCase())
                ),
            })).filter(coop => coop.produtos.length > 0);
        }
        
        return data;
    }, [initialData, searchTerm, filtroCooperativa]);
    
    const limparFiltros = () => {
        setSearchTerm('');
        setFiltroCooperativa('');
    };

    return {
        searchTerm,
        setSearchTerm,
        filtroCooperativa,
        setFiltroCooperativa,
        cooperativasDisponiveis,
        filteredData,
        limparFiltros,
        hasActiveFilter: searchTerm !== '' || filtroCooperativa !== '',
    };
};
