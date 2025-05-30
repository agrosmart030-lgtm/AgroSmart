import React, { useState, useEffect } from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, TrendingUp, TrendingDown, Bell, Heart, User, Plus, Trash2, AlertCircle, X, BarChart3, Calendar } from 'lucide-react';
import Login from '../login/Login.jsx';
import Cadastro from '../cadastro/Cadastro.jsx';
import Navbar from '../../componentes/navbar.jsx';

// Mock data
const mockGrainsData = [
  { name: 'Jan', soja: 150, milho: 85, trigo: 120 },
  { name: 'Fev', soja: 155, milho: 88, trigo: 118 },
  { name: 'Mar', soja: 148, milho: 92, trigo: 125 },
  { name: 'Abr', soja: 162, milho: 89, trigo: 130 },
  { name: 'Mai', soja: 158, milho: 95, trigo: 128 },
];

const mockQuotations = [
  { id: 1, grain: 'Soja', price: 158.50, cooperative: 'Cocamar', location: 'Maringá-PR', lastUpdate: '2025-05-22 14:30', trend: 'up' },
  { id: 2, grain: 'Milho', price: 95.20, cooperative: 'Lar', location: 'Medianeira-PR', lastUpdate: '2025-05-22 14:25', trend: 'down' },
  { id: 3, grain: 'Trigo', price: 128.00, cooperative: 'Coamo', location: 'Campo Mourão-PR', lastUpdate: '2025-05-22 14:20', trend: 'up' },
  { id: 4, grain: 'Soja', price: 156.80, cooperative: 'Lar', location: 'Cascavel-PR', lastUpdate: '2025-05-22 14:15', trend: 'up' },
  { id: 5, grain: 'Milho', price: 96.50, cooperative: 'Coamo', location: 'Londrina-PR', lastUpdate: '2025-05-22 14:10', trend: 'up' },
];

const cooperatives = [
  { name: 'Cocamar', avgPrice: 157.25, trend: 'up', change: '+2.5%' },
  { name: 'Lar', avgPrice: 125.15, trend: 'down', change: '-1.2%' },
  { name: 'Coamo', avgPrice: 142.25, trend: 'up', change: '+3.1%' },
];

export default function GrainsDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrain, setSelectedGrain] = useState('all');
  const [selectedCooperative, setSelectedCooperative] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [favorites, setFavorites] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showGrainDetails, setShowGrainDetails] = useState(false);
  const [selectedGrainDetails, setSelectedGrainDetails] = useState(null);
  const [newAlert, setNewAlert] = useState({ grain: '', cooperative: '', priceTarget: '', condition: 'above' });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('grainsUser') || 'null');
    if (savedUser) {
      setUser(savedUser);
      setIsLoggedIn(true);
      setFavorites(JSON.parse(localStorage.getItem('grainsFavorites') || '[]'));
      setAlerts(JSON.parse(localStorage.getItem('grainsAlerts') || '[]'));
    }
  }, []);

  const handleLogin = (email) => {
    const userData = { name: 'João Silva', email, avatar: '👤' };
    setUser(userData);
    setIsLoggedIn(true);
    setShowAuthModal(false);
    localStorage.setItem('grainsUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setFavorites([]);
    setAlerts([]);
    localStorage.removeItem('grainsUser');
    localStorage.removeItem('grainsFavorites');
    localStorage.removeItem('grainsAlerts');
  };

  const addToFavorites = (item) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    
    const newFavorite = { ...item, id: Date.now() };
    const newFavorites = [...favorites, newFavorite];
    setFavorites(newFavorites);
    localStorage.setItem('grainsFavorites', JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (id) => {
    const newFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(newFavorites);
    localStorage.setItem('grainsFavorites', JSON.stringify(newFavorites));
  };

  const createAlert = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    
    const alert = { ...newAlert, id: Date.now(), active: true };
    const newAlerts = [...alerts, alert];
    setAlerts(newAlerts);
    localStorage.setItem('grainsAlerts', JSON.stringify(newAlerts));
    setShowAlertModal(false);
    setNewAlert({ grain: '', cooperative: '', priceTarget: '', condition: 'above' });
  };

  const toggleAlert = (id) => {
    const newAlerts = alerts.map(alert => 
      alert.id === id ? { ...alert, active: !alert.active } : alert
    );
    setAlerts(newAlerts);
    localStorage.setItem('grainsAlerts', JSON.stringify(newAlerts));
  };

  const deleteAlert = (id) => {
    const newAlerts = alerts.filter(alert => alert.id !== id);
    setAlerts(newAlerts);
    localStorage.setItem('grainsAlerts', JSON.stringify(newAlerts));
  };

  const handleNavigateToLogin = () => {
    setCurrentPage('login');
    setShowAuthModal(false);
  };

  const handleNavigateToCadastro = () => {
    setCurrentPage('cadastro');
    setShowAuthModal(false);
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleGrainClick = (grain) => {
    setSelectedGrainDetails(grain);
    setShowGrainDetails(true);
  };

  const handleViewHistory = () => {
    if (!isLoggedIn) {
      setShowGrainDetails(false);
      setShowAuthModal(true);
      return;
    }
    alert('Redirecionando para página de histórico...');
    setShowGrainDetails(false);
  };

  const AuthModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-96 max-w-90vw">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2" style={{ color: '#2e7d32' }}>
            Bem-vindo ao AgroSmart!
          </h3>
          <p className="text-gray-600">
            Para acessar funcionalidades personalizadas como alertas e favoritos, você precisa estar logado.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleNavigateToLogin}
            className="btn w-full text-lg py-4 h-auto"
            style={{ backgroundColor: '#2e7d32', color: 'white' }}
          >
            <User size={20} className="mr-2" />
            Já tenho conta - Fazer Login
          </button>
          
          <button
            onClick={handleNavigateToCadastro}
            className="btn btn-outline w-full text-lg py-4 h-auto"
            style={{ borderColor: '#2e7d32', color: '#2e7d32' }}
          >
            <Plus size={20} className="mr-2" />
            Primeira vez aqui - Cadastrar-me
          </button>
          
          <button
            onClick={() => setShowAuthModal(false)}
            className="btn btn-ghost w-full"
          >
            Continuar sem login
            <span className="text-xs text-gray-500 block">
              (apenas visualização)
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  const GrainDetailsModal = () => (
    showGrainDetails && selectedGrainDetails && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold" style={{ color: '#2e7d32' }}>
              Detalhes do Grão
            </h3>
            <button
              onClick={() => setShowGrainDetails(false)}
              className="btn btn-sm btn-ghost"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-lg font-semibold">{selectedGrainDetails.grain}</h4>
                {selectedGrainDetails.trend === 'up' ? 
                  <TrendingUp size={20} className="text-green-600" /> : 
                  <TrendingDown size={20} className="text-red-600" />
                }
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Preço Atual</p>
                  <p className="font-bold text-lg" style={{ color: '#2e7d32' }}>
                    R$ {selectedGrainDetails.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Tendência</p>
                  <p className={`font-semibold ${selectedGrainDetails.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedGrainDetails.trend === 'up' ? 'Alta' : 'Baixa'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Cooperativa</p>
                  <p className="font-semibold">{selectedGrainDetails.cooperative}</p>
                </div>
                <div>
                  <p className="text-gray-600">Localidade</p>
                  <p className="font-semibold">{selectedGrainDetails.location}</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <p className="text-gray-600 text-xs">Última atualização</p>
                <p className="text-sm">{selectedGrainDetails.lastUpdate}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  addToFavorites(selectedGrainDetails);
                  setShowGrainDetails(false);
                }}
                className="btn btn-outline flex-1"
                style={{ borderColor: '#2e7d32', color: '#2e7d32' }}
              >
                <Heart size={16} />
                Favoritar
              </button>
              
              <button
                onClick={handleViewHistory}
                className="btn flex-1"
                style={{ backgroundColor: '#2e7d32', color: 'white' }}
              >
                <BarChart3 size={16} />
                Ver Histórico
              </button>
            </div>
            
            {!isLoggedIn && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Login necessário</p>
                    <p className="text-yellow-700">
                      Para ver o histórico completo, faça login em sua conta.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );

  const AlertModal = () => (
    showAlertModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold" style={{ color: '#2e7d32' }}>Criar Alerta</h3>
            <button onClick={() => setShowAlertModal(false)} className="btn btn-sm btn-ghost">
              <X size={18} />
            </button>
          </div>
          
          <div className="space-y-4">
            <select
              value={newAlert.grain}
              onChange={(e) => setNewAlert({...newAlert, grain: e.target.value})}
              className="select select-bordered w-full"
            >
              <option value="">Selecione o grão</option>
              <option value="Soja">Soja</option>
              <option value="Milho">Milho</option>
              <option value="Trigo">Trigo</option>
            </select>

            <select
              value={newAlert.cooperative}
              onChange={(e) => setNewAlert({...newAlert, cooperative: e.target.value})}
              className="select select-bordered w-full"
            >
              <option value="">Selecione a cooperativa</option>
              <option value="Cocamar">Cocamar</option>
              <option value="Lar">Lar</option>
              <option value="Coamo">Coamo</option>
            </select>

            <select
              value={newAlert.condition}
              onChange={(e) => setNewAlert({...newAlert, condition: e.target.value})}
              className="select select-bordered w-full"
            >
              <option value="above">Preço acima de</option>
              <option value="below">Preço abaixo de</option>
            </select>

            <input
              type="number"
              placeholder="Valor do preço"
              value={newAlert.priceTarget}
              onChange={(e) => setNewAlert({...newAlert, priceTarget: e.target.value})}
              className="input input-bordered w-full"
            />

            <div className="flex gap-2">
              <button onClick={() => setShowAlertModal(false)} className="btn btn-outline flex-1">
                Cancelar
              </button>
              <button
                onClick={createAlert}
                className="btn flex-1"
                style={{ backgroundColor: '#2e7d32', color: 'white' }}
                disabled={!newAlert.grain || !newAlert.cooperative || !newAlert.priceTarget}
              >
                Criar Alerta
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  if (currentPage === 'login') {
    return <Login onBackToDashboard={handleBackToDashboard} />;
  }

  if (currentPage === 'cadastro') {
    return <Cadastro onBackToDashboard={handleBackToDashboard} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <Navbar 
          isLoggedIn={isLoggedIn}
          user={user}
          handleLogout={handleLogout}
          handleNavigateToLogin={handleNavigateToLogin}
          setShowAuthModal={setShowAuthModal}
        />
      </div>

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar grãos, cooperativas ou localidades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={selectedGrain}
                  onChange={(e) => setSelectedGrain(e.target.value)}
                  className="select select-bordered"
                >
                  <option value="all">Todos os grãos</option>
                  <option value="soja">Soja</option>
                  <option value="milho">Milho</option>
                  <option value="trigo">Trigo</option>
                </select>
                <select
                  value={selectedCooperative}
                  onChange={(e) => setSelectedCooperative(e.target.value)}
                  className="select select-bordered"
                >
                  <option value="all">Todas cooperativas</option>
                  <option value="Cocamar">Cocamar</option>
                  <option value="Lar">Lar</option>
                  <option value="Coamo">Coamo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cooperative Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {cooperatives.map((coop, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: '#2e7d32' }}>{coop.name}</h3>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${
                      coop.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {coop.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {coop.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  R$ {coop.avgPrice.toFixed(2)}
                </div>
                <p className="text-gray-600 text-sm">Preço médio atual</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Charts Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#2e7d32' }}>
                  Tendências das Cotações
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockGrainsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="soja" stackId="1" stroke="#2e7d32" fill="#2e7d32" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="milho" stackId="1" stroke="#ffc107" fill="#ffc107" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="trigo" stackId="1" stroke="#1976d2" fill="#1976d2" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quotations Table */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#2e7d32' }}>
                  Cotações Atualizadas
                </h2>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Grão</th>
                        <th>Preço (R$/saca)</th>
                        <th>Cooperativa</th>
                        <th>Localidade</th>
                        <th>Última Atualização</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockQuotations.map((quote) => (
                        <tr key={quote.id} className="hover">
                          <td>
                            <button
                              onClick={() => handleGrainClick(quote)}
                              className="flex items-center gap-2 hover:text-green-600 transition-colors cursor-pointer"
                            >
                              {quote.grain}
                              {quote.trend === 'up' ? 
                                <TrendingUp size={16} className="text-green-600" /> : 
                                <TrendingDown size={16} className="text-red-600" />
                              }
                            </button>
                          </td>
                          <td className="font-semibold">R$ {quote.price.toFixed(2)}</td>
                          <td>{quote.cooperative}</td>
                          <td>{quote.location}</td>
                          <td className="text-sm text-gray-600">{quote.lastUpdate}</td>
                          <td>
                            <button
                              onClick={() => addToFavorites(quote)}
                              className="btn btn-sm btn-ghost"
                              style={{ color: '#2e7d32' }}
                            >
                              <Heart size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Alerts Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold" style={{ color: '#2e7d32' }}>
                    Meus Alertas
                  </h2>
                  <button
                    onClick={() => isLoggedIn ? setShowAlertModal(true) : setShowAuthModal(true)}
                    className="btn btn-sm"
                    style={{ backgroundColor: '#ffc107', color: 'black' }}
                  >
                    <Plus size={16} />
                    Criar
                  </button>
                </div>
                {!isLoggedIn ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Faça login para criar alertas personalizados</p>
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Nenhum alerta criado ainda</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">{alert.grain} - {alert.cooperative}</p>
                            <p className="text-sm text-gray-600">
                              {alert.condition === 'above' ? 'Acima de' : 'Abaixo de'} R$ {alert.priceTarget}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => toggleAlert(alert.id)}
                              className={`btn btn-xs ${alert.active ? 'btn-success' : 'btn-outline'}`}
                            >
                              {alert.active ? 'Ativo' : 'Inativo'}
                            </button>
                            <button
                              onClick={() => deleteAlert(alert.id)}
                              className="btn btn-xs btn-error btn-outline"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Favorites Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#2e7d32' }}>
                  Meus Favoritos
                </h2>
                {!isLoggedIn ? (
                  <div className="text-center py-8 text-gray-500">
                    <Heart size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Faça login para salvar favoritos</p>
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Heart size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Nenhum favorito salvo ainda</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {favorites.map((fav) => (
                      <div key={fav.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">{fav.grain}</p>
                            <p className="text-sm text-gray-600">{fav.cooperative} - {fav.location}</p>
                            <p className="font-semibold" style={{ color: '#2e7d32' }}>
                              R$ {fav.price.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromFavorites(fav.id)}
                            className="btn btn-xs btn-ghost text-red-500"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAuthModal && <AuthModal />}
      <GrainDetailsModal />
      <AlertModal />
    </div>
  );
}