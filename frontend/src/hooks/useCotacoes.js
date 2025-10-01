// src/hooks/useCotacoes.js
import { useState, useMemo, useEffect} from 'react';
import { apiAgrosmart } from '../../../backend/services/agroSmartApi';

const LOCALSTORAGE_KEY = 'agrosmart_cotacoes_cache';
const LOCALSTORAGE_TTL_MS = 15 * 60 * 1000; // 15 minutos

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
      // Tenta ler do localStorage primeiro para evitar múltiplas requisições ao entrar no site
      function readLocalCache() {
        try {
          const raw = localStorage.getItem(LOCALSTORAGE_KEY);
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          if (!parsed || !parsed.data || !parsed.timestamp) return null;
          if ((Date.now() - parsed.timestamp) > LOCALSTORAGE_TTL_MS) return null;
          return parsed.data;
        } catch (e) {
          console.warn('Erro lendo cache local de cotações', e);
          return null;
        }
      }

      async function fetchCotacoesAndCache() {
        try {
          setLoading(true);
          const response = await apiAgrosmart.get('/cotacoes/todos');
          const data = response.data || { coamo: [], larAgro: [], cocamar: [] };
          setCotacoes(data);
          try {
            localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
          } catch (e) {
            console.warn('Erro ao salvar cache local de cotações', e);
          }
          setError(null);
        } catch (err) {
          setError('Erro ao carregar cotações');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }

      const cached = readLocalCache();
      if (cached) {
        setCotacoes(cached);
        setLoading(false);
      } else {
        fetchCotacoesAndCache();
      }

      // Atualiza periodicamente e atualiza cache local também
      const interval = setInterval(fetchCotacoesAndCache, LOCALSTORAGE_TTL_MS);
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
