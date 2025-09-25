// src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Footer from '../../componentes/footer';
import Navbar from '../../componentes/navbar';
import { useCotacoes } from '../../hooks/useCotacoes';
import FilterBar from '../../componentes/dashboard/FilterBar';
import CooperativaSelectorVertical from '../../componentes/dashboard/CooperativaSelectorVertical';
import MarketHighlightsCard from '../../componentes/dashboard/MarketHighlightsCard';
import PainelDeConteudo from '../../componentes/dashboard/PainelDeConteudo';

// Importando os logos diretamente
import coamoLogo from '../../assets/coamo.png';
import cocamarLogo from '../../assets/cocamar.png';
import larLogo from '../../assets/lar.png';

function transformarCotacoesParaCooperativas(cotacoes) {
  if (!cotacoes) return [];
  return [
    {
      nome: 'COAMO',
      logo: coamoLogo,
      telefone: '556721088600',
      produtos: cotacoes.coamo?.map(item => ({
        nome: item.grao,
        preco: item.preco,
        variacao: item.variacao || '',
      })) || [],
    },
    {
      nome: 'LAR',
      logo: larLogo,
      telefone: '556734243449',
      produtos: cotacoes.larAgro?.map(item => ({
        nome: item.grao,
        preco: item.preco,
        variacao: item.variacao || '',
      })) || [],
    },
    {
      nome: 'COCAMAR',
      logo: cocamarLogo,
      telefone: '551194567890',
      produtos: cotacoes.cocamar?.map(item => ({
        nome: item.grao,
        preco: item.preco,
        variacao: item.variacao || '',
      })) || [],
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
    nome: 'COCAMAR',
    logo: cocamarLogo,
    telefone: '551194567890',
    produtos: [
      { nome: 'SOJA', preco: 'R$ 132,00', variacao: '+1.5%' },
      { nome: 'MILHO', preco: 'R$ 60,00', variacao: '-0.2%' },
      { nome: 'TRIGO', preco: 'R$ 72,00', variacao: '+1.8%' },
      { nome: 'CAFÉ', preco: 'R$ 29,50', variacao: '+0.9%' },
    ],
  },
];


const DashboardPage = () => {
  const {
    searchTerm,
    setSearchTerm,
    filtroCooperativa,
    setFiltroCooperativa,
    cooperativasDisponiveis,
    filteredData,
    limparFiltros,
    hasActiveFilter,
    cotacoes,
    loading,
    error,
  } = useCotacoes(cooperativasData);

  useEffect(() => {
    // Loga o retorno da API de cotações para debug
    console.log('API cotacoes:', cotacoes);
    if (error) console.error('Erro cotacoes:', error);
  }, [cotacoes, error]);
  
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
    const isSelectedInList = displayedData.some(c => c.nome === selectedCoopName);
    if (!isSelectedInList) {
        setSelectedCoopName(displayedData.length > 0 ? displayedData[0].nome : null);
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FilterBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filtroCooperativa={filtroCooperativa}
                setFiltroCooperativa={setFiltroCooperativa}
                cooperativasDisponiveis={cooperativasDisponiveisLocal}
                onClear={limparFiltros}
            />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <CooperativaSelectorVertical 
                cooperativas={displayedData}
                selecionada={cooperativaParaExibir}
                onSelect={(coop) => setSelectedCoopName(coop.nome)}
              />
              {!hasActiveFilter && <MarketHighlightsCard />}
            </div>
            
            <div className="lg:col-span-3">
              <PainelDeConteudo cooperativa={cooperativaParaExibir} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;