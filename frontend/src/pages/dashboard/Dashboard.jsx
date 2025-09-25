// src/pages/dashboard/Dashboard.jsx
import React, { useState, useMemo, useEffect } from 'react';
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
  } = useCotacoes(cooperativasData);
  
  const [selectedCoopName, setSelectedCoopName] = useState(null);

  useEffect(() => {
    const isSelectedInList = filteredData.some(c => c.nome === selectedCoopName);
    if (!isSelectedInList) {
        setSelectedCoopName(filteredData.length > 0 ? filteredData[0].nome : null);
    }
  }, [filteredData, selectedCoopName]);

  const cooperativaParaExibir = useMemo(() => {
      if (!selectedCoopName) return null;
      return filteredData.find(c => c.nome === selectedCoopName);
  }, [filteredData, selectedCoopName]);

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
                cooperativasDisponiveis={cooperativasDisponiveis}
                onClear={limparFiltros}
            />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <CooperativaSelectorVertical 
                cooperativas={filteredData}
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