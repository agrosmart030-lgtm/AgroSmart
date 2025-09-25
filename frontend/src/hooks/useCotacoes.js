// src/hooks/useCotacoes.js
import { useState, useMemo, useEffect} from 'react';
import { apiAgrosmart } from '../../../backend/services/agroSmartApi';

export const useCotacoes = (initialData) => {
    const [cotacoes, setCotacoes] = useState({ coamo: [], larAgro: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
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

    useEffect(() => {
      async function fetchCotacoes() {
        try {
          setLoading(true);
          const response = await apiAgrosmart.get('/cotacoes/todos');
          setCotacoes(response.data);
          setError(null);
        } catch (err) {
          setError('Erro ao carregar cotações');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }

      fetchCotacoes();
      // Atualiza a cada 5 minutos
      const interval = setInterval(fetchCotacoes, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }, []);

    return {
        searchTerm,
        setSearchTerm,
        filtroCooperativa,
        setFiltroCooperativa,
        cooperativasDisponiveis,
        filteredData,
        limparFiltros,
        hasActiveFilter: searchTerm !== '' || filtroCooperativa !== '',
        cotacoes,
        loading,
        error,
    };
};
