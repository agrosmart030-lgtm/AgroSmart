// src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import Footer from '../../componentes/footer';
import Navbar from '../../componentes/navbar';
import { useCotacoes } from '../../hooks/useCotacoes';
import FilterBar from '../../componentes/dashboard/FilterBar';
import MarketHighlightsCard from '../../componentes/dashboard/MarketHighlightsCard';
import axios from 'axios';
import { API_URL } from '../../services/api';

// Importando os logos diretamente
import coamoLogo from '../../assets/coamo.png';
import larLogo from '../../assets/lar.png';
import granosLogo from '../../assets/granos_logo.png';
import cvaleLogo from '../../assets/cvaleLogo.jpg';

const normalizarNomeGrao = (nome = '') => {
  const normalized = String(nome)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

  if (normalized.includes('SOJA')) return 'SOJA';
  if (normalized.includes('MILHO')) return 'MILHO';
  if (normalized.includes('TRIGO')) return 'TRIGO';
  if (normalized.includes('CAFE')) return 'CAFE';
  if (normalized.includes('FEIJAO')) return 'FEIJAO';
  return String(nome).trim().toUpperCase();
};

const formatarPrecoCotacao = (preco = '') => {
  const raw = String(preco).replace(/\u00a0/g, ' ').trim();
  const match = raw.match(/\d{1,3}(?:\.\d{3})*,\d{2}|\d+(?:[.,]\d{1,2})?/);

  if (!match) return '';

  const normalized = match[0].replace(/\./g, '').replace(',', '.');
  const value = Number(normalized);

  if (!Number.isFinite(value)) return '';

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const mapearProdutoCotacao = (item) => {
  const nome = normalizarNomeGrao(item?.grao);
  const preco = formatarPrecoCotacao(item?.preco);

  if (!nome || !preco) return null;

  return {
    nome,
    preco,
    variacao: item.variacao || '',
  };
};

const mapearProdutosCotacao = (items) =>
  items.map(mapearProdutoCotacao).filter(Boolean);

function transformarCotacoesParaCooperativas(cotacoes) {
  if (!cotacoes || typeof cotacoes !== 'object') return [];
  const coamoArr = Array.isArray(cotacoes.coamo) ? cotacoes.coamo : [];
  const larArr = Array.isArray(cotacoes.larAgro) ? cotacoes.larAgro : [];
  const cvaleArr = Array.isArray(cotacoes.cvale) ? cotacoes.cvale : [];
  const granosArr = Array.isArray(cotacoes.granos) ? cotacoes.granos : [];
  return [
    {
      nome: 'COAMO',
      logo: coamoLogo,
      telefone: '556721088600',
      produtos: mapearProdutosCotacao(coamoArr),
    },
    {
      nome: 'LAR',
      logo: larLogo,
      telefone: '556734243449',
      produtos: mapearProdutosCotacao(larArr),
    },
    {
      nome: 'GRANOS',
      logo: granosLogo,
      telefone: '556730278700',
      produtos: mapearProdutosCotacao(granosArr),
    },
    {
      nome: 'CVALE',
      logo: cvaleLogo,
      telefone: '554436498181',
      produtos: mapearProdutosCotacao(cvaleArr),
    },
  ];
}

// Os dados mocados agora vivem aqui, prontos para serem substituídos por uma chamada de API.
const cooperativasData = [
  {
    nome: 'COAMO',
    logo: coamoLogo,
    telefone: '556721088600',
    produtos: [
      { nome: 'SOJA', preco: 'R$ 128,50', variacao: '+1.2%' },
      { nome: 'MILHO', preco: 'R$ 56,30', variacao: '-0.5%' },
      { nome: 'TRIGO', preco: 'R$ 67,00', variacao: '+2.1%' },
      { nome: 'CAFÉ', preco: 'R$ 29,24', variacao: '+0.8%' },
    ],
  },
  {
    nome: 'LAR',
    logo: larLogo,
    telefone: '556734243449',
    produtos: [
      { nome: 'SOJA', preco: 'R$ 128,00', variacao: '+1.1%' },
      { nome: 'MILHO', preco: 'R$ 55,90', variacao: '-0.6%' },
      { nome: 'TRIGO', preco: 'R$ 66,50', variacao: '+1.9%' },
      { nome: 'CAFÉ', preco: 'R$ 28,50', variacao: '+0.7%' },
    ],
  },
  {
    nome: 'GRANOS',
    logo: granosLogo,
    telefone: '556730278700',
    produtos: [
      { nome: 'SOJA', preco: 'R$ 130,00', variacao: '+1.3%' },
      { nome: 'MILHO', preco: 'R$ 58,00', variacao: '-0.4%' },
      { nome: 'TRIGO', preco: 'R$ 69,00', variacao: '+2.0%' },
      { nome: 'CAFÉ', preco: 'R$ 29,50', variacao: '+0.9%' },
    ],
  },
  {
    nome: 'CVALE',
    logo: cvaleLogo,
    telefone: '554436498181',
    produtos: [
      { nome: 'SOJA', preco: 'R$ 131,50', variacao: '+1.0%' },
      { nome: 'MILHO', preco: 'R$ 57,20', variacao: '-0.3%' },
      { nome: 'TRIGO', preco: 'R$ 70,00', variacao: '+1.5%' },
    ],
  },
];


// Dados para o histórico de preços
const historyData = {
  soja: {
    name: "Soja",
    unit: "R$/sc 60kg",
    color: "#10B981",
    gradient: "from-emerald-400 to-emerald-600",
    cooperativas: {
      coamo: { currentPrice: 178.5, change: +5.2 },
      lar: { currentPrice: 175.2, change: +4.8 },
      cvale: { currentPrice: 176.0, change: +4.5 },
    },
    data6m: [
      { date: "2024-11", price: 165.3, volume: 2840 },
      { date: "2024-12", price: 172.8, volume: 3120 },
      { date: "2025-01", price: 169.4, volume: 2950 },
      { date: "2025-02", price: 174.2, volume: 3280 },
      { date: "2025-03", price: 176.9, volume: 3450 },
      { date: "2025-04", price: 175.6, volume: 3180 },
      { date: "2025-05", price: 178.5, volume: 3380 },
    ],
    data1y: [
      { date: "2024-05", price: 152.3, volume: 2640 },
      { date: "2024-06", price: 158.7, volume: 2780 },
      { date: "2024-07", price: 161.2, volume: 2890 },
      { date: "2024-08", price: 163.8, volume: 3020 },
      { date: "2024-09", price: 160.4, volume: 2750 },
      { date: "2024-10", price: 167.9, volume: 3150 },
      { date: "2024-11", price: 165.3, volume: 2840 },
      { date: "2024-12", price: 172.8, volume: 3120 },
      { date: "2025-01", price: 169.4, volume: 2950 },
      { date: "2025-02", price: 174.2, volume: 3280 },
      { date: "2025-03", price: 176.9, volume: 3450 },
      { date: "2025-04", price: 175.6, volume: 3180 },
      { date: "2025-05", price: 178.5, volume: 3380 },
    ],
  },
  milho: {
    name: "Milho",
    unit: "R$/sc 60kg",
    color: "#F59E0B",
    gradient: "from-amber-400 to-amber-600",
    cooperativas: {
      coamo: { currentPrice: 89.4, change: -2.1 },
      lar: { currentPrice: 87.9, change: -1.8 },
      cvale: { currentPrice: 88.5, change: -1.5 },
    },
    data6m: [
      { date: "2024-11", price: 92.8, volume: 4120 },
      { date: "2024-12", price: 88.5, volume: 3890 },
      { date: "2025-01", price: 91.2, volume: 4050 },
      { date: "2025-02", price: 87.6, volume: 3780 },
      { date: "2025-03", price: 90.1, volume: 4180 },
      { date: "2025-04", price: 91.3, volume: 4220 },
      { date: "2025-05", price: 89.4, volume: 4080 },
    ],
  },
};

// Componente StatCard para exibir estatísticas
const StatCard = ({ title, value, subtitle, icon: Icon, gradient, isPositive, change }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full">
    <div className="flex justify-between items-start h-full">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        {change !== undefined && (
          <div className="mt-2 flex items-center">
            {isPositive ? (
              <TrendingUp className="text-green-500 mr-1" size={16} />
            ) : (
              <TrendingDown className="text-red-500 mr-1" size={16} />
            )}
            <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {change}% {isPositive ? 'alta' : 'baixa'}
            </span>
          </div>
        )}
      </div>
      <div className={`p-2 rounded-lg ${gradient} bg-gradient-to-br text-white`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('cotacao');
  const [currentGrain] = useState('soja');
  const [timeRange, setTimeRange] = useState('6m');
  const [historyCoop, setHistoryCoop] = useState('LAR');
  const [historyGrao, setHistoryGrao] = useState('');
  const [historySeries, setHistorySeries] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  
  const {
    searchTerm,
    setSearchTerm,
    filtroCooperativa,
    setFiltroCooperativa,
    filteredData,
    limparFiltros,
    hasActiveFilter,
    cotacoes,
    error,
  } = useCotacoes(cooperativasData);

  useEffect(() => {
    // Loga o retorno da API de cotações para debug
    console.log('API cotacoes:', cotacoes);
    if (error) console.error('Erro cotacoes:', error);
  }, [cotacoes, error]);

  // Lê ?tab=historico para abrir a aba correta via deep link
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'historico' || tab === 'cotacao') {
      setActiveTab(tab);
    }
  }, [location.search]);


  // Busca histórico quando aba Histórico estiver ativa ou filtros mudarem
  useEffect(() => {
    if (activeTab !== 'historico') return;
    const controller = new AbortController();
    async function loadHistory() {
      try {
        setHistoryLoading(true);
        setHistoryError(null);
        const params = new URLSearchParams();
        params.set('coop', historyCoop);
        params.set('period', timeRange);
        if (historyGrao) params.set('grao', historyGrao);
        const resp = await axios.get(`${API_URL}/cotacoes/historico?${params.toString()}`, { signal: controller.signal });
        const series = Array.isArray(resp.data?.series) ? resp.data.series : [];
        const mapped = series.map(pt => ({
          date: typeof pt.date === 'string' ? pt.date.substring(0, 10) : pt.date,
          price: Number(pt.price)
        }));
        setHistorySeries(mapped);
      } catch (e) {
        if (e.name !== 'CanceledError') {
          setHistoryError('Falha ao carregar histórico');
          setHistorySeries([]);
        }
      } finally {
        setHistoryLoading(false);
      }
    }
    loadHistory();
    return () => controller.abort();
  }, [activeTab, historyCoop, historyGrao, timeRange]);
  
  const [selectedCoopName, setSelectedCoopName] = useState(null);

  // Cria lista de cooperativas a partir da API (se houver) ou usa os dados mock/filtrados
  const apiCooperativas = useMemo(() => transformarCotacoesParaCooperativas(cotacoes), [cotacoes]);

  // caso contrário mantém o comportamento anterior usando filteredData do hook.
  const displayedData = useMemo(() => {
    const source = apiCooperativas.some(c => c.produtos && c.produtos.length > 0) ? apiCooperativas : filteredData;

    let data = JSON.parse(JSON.stringify(source));

    if (filtroCooperativa) {
      data = data.filter(coop => coop.nome === filtroCooperativa);
    }

    if (searchTerm) {
      data = data.map(coop => ({
        ...coop,
        produtos: coop.produtos.filter(prod =>
          prod.nome.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      })).filter(coop => coop.produtos.length > 0);
    }

    return data;
  }, [apiCooperativas, filteredData, filtroCooperativa, searchTerm]);

  useEffect(() => {
    const selectedCoop = displayedData.find(c => c.nome === selectedCoopName);
    const firstWithProducts = displayedData.find(c => c.produtos?.length > 0);
    const shouldPreferCoopWithProducts =
      firstWithProducts && (!selectedCoop || selectedCoop.produtos?.length === 0);

    if (shouldPreferCoopWithProducts || (!selectedCoop && displayedData.length > 0)) {
      setSelectedCoopName(firstWithProducts?.nome || displayedData[0]?.nome || null);
    }
  }, [displayedData, selectedCoopName]);

  const cooperativaParaExibir = useMemo(() => {
      if (!selectedCoopName) return null;
      return displayedData.find(c => c.nome === selectedCoopName) || null;
  }, [displayedData, selectedCoopName]);

  // Atualiza lista de disponíveis no FilterBar para refletir os dados atualmente mostrados
  const cooperativasDisponiveisLocal = useMemo(() => {
    return Array.from(new Set((apiCooperativas.some(c => c.produtos?.length > 0) ? apiCooperativas : cooperativasData).map(coop => coop.nome))).sort();
  }, [apiCooperativas]);

  // Dados atuais para o histórico (preferir série real)
  const chartData = historySeries.length > 0
    ? historySeries
    : (timeRange === '6m' ? historyData[currentGrain].data6m : historyData[currentGrain].data1y);
  const averagePrice = chartData.length > 0 ? (chartData.reduce((sum, item) => sum + Number(item.price), 0) / chartData.length).toFixed(2) : '0.00';
  return (
    <div className="min-h-screen bg-[#f1f4f2] dark:bg-[#0b1410] flex flex-col relative transition-colors duration-300">
      
      <Navbar />
      <main className="pt-6 pb-12 flex-grow relative z-10 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[#012d1d] dark:text-white tracking-tight font-manrope">
                {activeTab === 'cotacao' ? 'Painel de Operações' : 'Inteligência de Mercado'}
              </h1>
              <p className="text-[#414844] dark:text-gray-400 text-sm font-medium mt-1">Acompanhe dinâmicas e preços em tempo real.</p>
            </div>
            
            {/* Elegant Pill Tabs */}
            <div className="flex w-full sm:w-auto overflow-x-auto bg-white/60 dark:bg-[#14241d]/60 p-1 rounded-full shadow-sm border border-gray-200 dark:border-white/10">
              <button
                onClick={() => setActiveTab('cotacao')}
                className={`flex-1 sm:flex-none px-5 sm:px-8 py-2 font-bold text-sm rounded-full transition-all duration-300 whitespace-nowrap ${activeTab === 'cotacao'
                  ? 'bg-white dark:bg-[#012d1d] text-[#012d1d] dark:text-white shadow-sm border border-gray-100 dark:border-white/20' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                Cotação
              </button>
              <button
                onClick={() => setActiveTab('historico')}
                className={`flex-1 sm:flex-none px-5 sm:px-8 py-2 font-bold text-sm rounded-full transition-all duration-300 whitespace-nowrap ${activeTab === 'historico'
                  ? 'bg-white dark:bg-[#012d1d] text-[#012d1d] dark:text-white shadow-sm border border-gray-100 dark:border-white/20' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                Histórico
              </button>
            </div>
          </div>

          {activeTab === 'cotacao' ? (
            <>
              <FilterBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filtroCooperativa={filtroCooperativa}
                setFiltroCooperativa={setFiltroCooperativa}
                cooperativasDisponiveis={cooperativasDisponiveisLocal}
                onClear={limparFiltros}
              />

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-[#14241d] text-on-surface flex flex-col gap-2 py-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                    <div className="px-5 mb-2">
                      <h2 className="text-lg font-bold text-primary dark:text-[#a5d0b9] font-manrope">Cooperativas</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Troca rápida</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {displayedData.map((coop) => {
                        const isActive = selectedCoopName === coop.nome;
                        return (
                          <button
                            key={coop.nome}
                            onClick={() => setSelectedCoopName(coop.nome)}
                            className={`flex items-center justify-between py-2.5 px-5 rounded-r-full mr-4 font-manrope font-semibold text-sm transition-all duration-200 cursor-pointer ${
                              isActive
                                ? 'bg-[#eaf8f1] dark:bg-[#012d1d] text-[#012d1d] dark:text-white border-l-4 border-[#012d1d] dark:border-[#a5d0b9] shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:pl-6 border-l-4 border-transparent'
                            }`}
                          >
                            <div className={`flex items-center ${coop.nome === 'GRANOS' ? 'gap-6' : 'gap-3'}`}>
                              <div className="h-8 w-14 flex-shrink-0 flex items-center justify-center transition-transform hover:scale-105">
                                <img 
                                  src={coop.logo} 
                                  alt={coop.nome} 
                                  className={`max-h-full max-w-full object-contain ${coop.nome !== 'GRANOS' ? 'dark:brightness-0 dark:invert' : ''} ${coop.nome === 'GRANOS' ? 'scale-[1.4] translate-y-0.5' : ''}`} 
                                />
                              </div>
                              <span className="text-sm font-bold">{coop.nome}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {!hasActiveFilter && (
                    <div className="mt-6">
                       <MarketHighlightsCard />
                    </div>
                  )}
                </div>
                
                <div className="lg:col-span-3">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                      <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tighter leading-none font-manrope">Cotações de Hoje</h1>
                        <p className="text-on-surface-variant mt-2 font-medium">Dados atualizados de {cooperativaParaExibir?.nome || 'Mercado'}.</p>
                      </div>
                      <div className="hidden sm:flex bg-surface-container rounded-full p-1 gap-1">
                        <button className="px-6 py-2 rounded-full text-xs font-bold bg-primary text-white">À VISTA</button>
                        <button className="px-6 py-2 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-variant transition-colors">FUTUROS</button>
                      </div>
                    </div>
                    
                    {cooperativaParaExibir ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {cooperativaParaExibir.produtos.map((produto, index) => {
                          const variacaoStr = produto.variacao || '';
                          const isNegative = variacaoStr.includes('-');

                          return (
                            <div key={`${produto.nome}-${index}`} className="bg-white dark:bg-[#14241d] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 flex flex-col justify-between min-h-[120px] hover:shadow-md transition-all duration-200 group">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-[#012d1d] dark:text-white font-bold text-base uppercase tracking-tight">{produto.nome}</h3>
                                  <span className="text-gray-500 dark:text-gray-400 font-medium text-xs">Saca 60kg</span>
                                </div>
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-tight ${isNegative ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                                  {variacaoStr}
                                </span>
                              </div>
                              <div className="mt-auto pt-3">
                                <p className="text-2xl font-black text-[#012d1d] dark:text-white font-manrope tracking-tight">{produto.preco}</p>
                                <div className={`flex items-center gap-1 mt-1 text-[11px] font-bold ${isNegative ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-[#a5d0b9]'}`}>
                                  {isNegative ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                                  {isNegative ? 'Em queda' : 'Em alta'}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-[#14241d] p-6 rounded-2xl text-center border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200">
                        Nenhuma cooperativa correspondente
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {/* Filtros do Histórico */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-base font-medium text-gray-700 mb-3">Filtros</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Cooperativa</label>
                    <select
                      value={historyCoop}
                      onChange={(e) => setHistoryCoop(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm py-2"
                    >
                      <option value="LAR">LAR</option>
                      <option value="COAMO">COAMO</option>
                      <option value="GRANOS">GRANOS</option>
                      <option value="CVALE">C.VALE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Grão</label>
                    <input
                      value={historyGrao}
                      onChange={(e) => setHistoryGrao(e.target.value)}
                      placeholder="ex: Soja, Milho"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm py-2 px-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Período</label>
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm py-2"
                    >
                      <option value="6m">Últimos 6 meses</option>
                      <option value="1y">Último ano</option>
                    </select>
                  </div>
                </div>
                {historyLoading && (
                  <p className="text-xs text-gray-500 mt-2">Carregando histórico...</p>
                )}
                {historyError && (
                  <p className="text-xs text-red-500 mt-2">{historyError}</p>
                )}
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  title="Média"
                  value={`R$ ${averagePrice.replace('.', ',')}`}
                  subtitle={`${timeRange === '6m' ? '6 meses' : '1 ano'}`}
                  icon={Calendar}
                  gradient="from-blue-500 to-blue-600"
                />
              </div>

              {/* Historical Minimalist Table Section */}
              <section className="mt-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                  <h2 className="text-2xl font-extrabold text-primary dark:text-[#c0edd4] tracking-tight font-manrope">Histórico de Fechamento</h2>
                  <button className="text-primary dark:text-[#a5d0b9] font-bold text-sm flex items-center gap-1 hover:underline">
                      Ver relatório completo <span className="material-symbols-outlined text-sm">arrow_outward</span>
                  </button>
                </div>
                <div className="bg-white dark:bg-[#14241d] rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-200 dark:border-white/10">
                  <div className="overflow-x-auto">
                  <table className="min-w-[760px] w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-[#0a120e] border-b border-gray-200 dark:border-white/10">
                        <th className="px-6 md:px-8 py-4 font-bold text-xs text-gray-600 dark:text-gray-400 tracking-widest uppercase">DATA</th>
                        <th className="px-6 md:px-8 py-4 font-bold text-xs text-gray-600 dark:text-gray-400 tracking-widest uppercase">COMMODITY</th>
                        <th className="px-6 md:px-8 py-4 font-bold text-xs text-gray-600 dark:text-gray-400 tracking-widest uppercase">VALOR MÉDIO</th>
                        <th className="px-6 md:px-8 py-4 font-bold text-xs text-gray-600 dark:text-gray-400 tracking-widest uppercase">VARIAÇÃO</th>
                        <th className="px-6 md:px-8 py-4 font-bold text-xs text-gray-600 dark:text-gray-400 tracking-widest uppercase hidden md:table-cell">TENDÊNCIA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f4f5]">
                      {chartData && chartData.length > 0 ? chartData.map((row, idx) => {
                         // Calculamos a variação comparando com o dia anterior no array (que é o próximo item pois geralmente é desc crescente na UI, mas aqui consideramos sequencial)
                         const previousPrice = idx > 0 ? Number(chartData[idx - 1].price) : Number(row.price);
                         const currentPriceVal = Number(row.price);
                         const changeVal = currentPriceVal - previousPrice;
                         const isNeg = changeVal < 0; 
                         const changePct = previousPrice > 0 ? ((Math.abs(changeVal) / previousPrice) * 100).toFixed(1) : '0.0';
                         const changeStr = isNeg ? `-${changePct}%` : `+${changePct}%`;

                         return (
                           <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                             <td className="px-6 md:px-8 py-6 font-bold text-primary dark:text-[#a5d0b9] whitespace-nowrap">{row.date}</td>
                             <td className="px-6 md:px-8 py-6 text-gray-600 dark:text-gray-300 font-semibold">{historyGrao || historyData[currentGrain]?.name || 'Geral'} ({historyCoop})</td>
                             <td className="px-6 md:px-8 py-6 text-xl font-extrabold text-[#012d1d] dark:text-white whitespace-nowrap">R$ {currentPriceVal.toFixed(2).replace('.', ',')}</td>
                             <td className="px-6 md:px-8 py-6">
                               {isNeg ? (
                                 <span className="text-red-500 font-bold tracking-tight">{changeStr}</span>
                               ) : (
                                 <div className="flex items-center">
                                   <span className="bg-[#c0edd4] dark:bg-[#012d1d] text-[#012d1d] dark:text-[#a5d0b9] px-2 py-0.5 rounded-full text-xs font-bold tracking-tight">{changeStr}</span>
                                 </div>
                               )}
                             </td>
                             <td className="px-6 md:px-8 py-6 hidden md:table-cell">
                               <svg className="w-24 h-8" viewBox="0 0 100 30">
                                 {isNeg ? (
                                   <path className="fill-none stroke-[2] stroke-[#ba1a1a] dark:stroke-[#ffb4ab]" strokeLinecap="round" d="M0 10 L20 12 L40 10 L60 22 L80 20 L100 25"></path>
                                 ) : (
                                   <path className="fill-none stroke-[2] stroke-[#1b4332] dark:stroke-[#549373]" strokeLinecap="round" d="M0 25 L20 22 L40 26 L60 18 L80 20 L100 10"></path>
                                 )}
                               </svg>
                             </td>
                           </tr>
                         )
                      }) : (
                        <tr>
                          <td colSpan="5" className="px-8 py-10 text-center text-on-surface-variant font-medium">Nenhum dado encontrado para o período. Tente alterar os filtros.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
