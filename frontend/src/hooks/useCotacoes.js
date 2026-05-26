// src/hooks/useCotacoes.js
import { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../services/api';

const apiAgrosmart = axios.create({ baseURL: API_URL });

const LOCALSTORAGE_KEY = 'agrosmart_cotacoes_cache';
const LOCALSTORAGE_TTL_MS = 15 * 60 * 1000; // 15 minutos

// Função auxiliar para ler do cache local
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

export const useCotacoes = (initialData) => {
    const [cotacoes, setCotacoes] = useState({ coamo: [], larAgro: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroCooperativa, setFiltroCooperativa] = useState('');

    const cooperativasDisponiveis = useMemo(() => {
      return Array.from(new Set(initialData.map((coop) => coop.nome))).sort();
    }, [initialData]);

    const filteredData = useMemo(() => {
      const data = JSON.parse(JSON.stringify(initialData));
      const byCoop = filtroCooperativa
        ? data.filter((coop) => coop.nome === filtroCooperativa)
        : data;
      if (!searchTerm) return byCoop;
      return byCoop
        .map((coop) => ({
          ...coop,
          produtos: coop.produtos.filter((prod) =>
            prod.nome.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((coop) => coop.produtos.length > 0);
    }, [initialData, searchTerm, filtroCooperativa]);

    const limparFiltros = () => {
      setSearchTerm('');
      setFiltroCooperativa('');
    };

    const refetch = useCallback(async () => {
      try {
        setLoading(true);
        const response = await apiAgrosmart.get('/cotacoes/todos');
        const data = response.data;
        localStorage.setItem(
          LOCALSTORAGE_KEY,
          JSON.stringify({ data, timestamp: Date.now() })
        );
        setCotacoes(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar cotações:', err);
        setError('Erro ao carregar cotações. Verifique sua conexão ou tente novamente mais tarde.');
        const cached = readLocalCache();
        if (cached) {
          setCotacoes(cached);
        }
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {

      const cached = readLocalCache();
      if (cached) {
        setCotacoes(cached);
        setLoading(false);
      }

      refetch();
      const interval = setInterval(refetch, LOCALSTORAGE_TTL_MS);
      return () => clearInterval(interval);
    }, [refetch]);

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
        refetchCotacoes: refetch,
    };
};
