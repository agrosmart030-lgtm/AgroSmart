import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import Navbar from "../../componentes/navbar";
import Footer from "../../componentes/footer";

// Dados simulados para diferentes grãos e cooperativas
const grainData = {
  soja: {
    name: 'Soja',
    unit: 'R$/sc 60kg',
    color: '#10B981',
    cooperativas: {
      coamo: { currentPrice: 178.50, change: +5.2 },
      lar: { currentPrice: 175.20, change: +4.8 },
      cocamar: { currentPrice: 180.30, change: +6.0 }
    },
    data6m: [
      { date: '2024-11', price: 165.30, volume: 2840 },
      { date: '2024-12', price: 172.80, volume: 3120 },
      { date: '2025-01', price: 169.40, volume: 2950 },
      { date: '2025-02', price: 174.20, volume: 3280 },
      { date: '2025-03', price: 176.90, volume: 3450 },
      { date: '2025-04', price: 175.60, volume: 3180 },
      { date: '2025-05', price: 178.50, volume: 3380 }
    ],
    data1y: [
      { date: '2024-05', price: 152.30, volume: 2640 },
      { date: '2024-06', price: 158.70, volume: 2780 },
      { date: '2024-07', price: 161.20, volume: 2890 },
      { date: '2024-08', price: 163.80, volume: 3020 },
      { date: '2024-09', price: 160.40, volume: 2750 },
      { date: '2024-10', price: 167.90, volume: 3150 },
      { date: '2024-11', price: 165.30, volume: 2840 },
      { date: '2024-12', price: 172.80, volume: 3120 },
      { date: '2025-01', price: 169.40, volume: 2950 },
      { date: '2025-02', price: 174.20, volume: 3280 },
      { date: '2025-03', price: 176.90, volume: 3450 },
      { date: '2025-04', price: 175.60, volume: 3180 },
      { date: '2025-05', price: 178.50, volume: 3380 }
    ]
  },
  milho: {
    name: 'Milho',
    unit: 'R$/sc 60kg',
    color: '#F59E0B',
    cooperativas: {
      coamo: { currentPrice: 89.40, change: -2.1 },
      lar: { currentPrice: 87.90, change: -1.8 },
      cocamar: { currentPrice: 90.50, change: -2.5 }
    },
    data6m: [
      { date: '2024-11', price: 92.80, volume: 4120 },
      { date: '2024-12', price: 88.50, volume: 3890 },
      { date: '2025-01', price: 91.20, volume: 4050 },
      { date: '2025-02', price: 87.60, volume: 3780 },
      { date: '2025-03', price: 90.10, volume: 4180 },
      { date: '2025-04', price: 91.30, volume: 4220 },
      { date: '2025-05', price: 89.40, volume: 4080 }
    ],
    data1y: [
      { date: '2024-05', price: 78.90, volume: 3640 },
      { date: '2024-06', price: 82.30, volume: 3780 },
      { date: '2024-07', price: 85.70, volume: 3920 },
      { date: '2024-08', price: 88.20, volume: 4050 },
      { date: '2024-09', price: 86.40, volume: 3850 },
      { date: '2024-10', price: 90.60, volume: 4180 },
      { date: '2024-11', price: 92.80, volume: 4120 },
      { date: '2024-12', price: 88.50, volume: 3890 },
      { date: '2025-01', price: 91.20, volume: 4050 },
      { date: '2025-02', price: 87.60, volume: 3780 },
      { date: '2025-03', price: 90.10, volume: 4180 },
      { date: '2025-04', price: 91.30, volume: 4220 },
      { date: '2025-05', price: 89.40, volume: 4080 }
    ]
  },
  trigo: {
    name: 'Trigo',
    unit: 'R$/sc 60kg',
    color: '#DC2626',
    cooperativas: {
      coamo: { currentPrice: 142.70, change: +3.8 },
      lar: { currentPrice: 140.50, change: +3.5 },
      cocamar: { currentPrice: 144.20, change: +4.0 }
    },
    data6m: [
      { date: '2024-11', price: 138.20, volume: 1850 },
      { date: '2024-12', price: 135.60, volume: 1720 },
      { date: '2025-01', price: 140.80, volume: 1920 },
      { date: '2025-02', price: 139.40, volume: 1880 },
      { date: '2025-03', price: 141.90, volume: 1950 },
      { date: '2025-04', price: 143.20, volume: 2020 },
      { date: '2025-05', price: 142.70, volume: 1980 }
    ],
    data1y: [
      { date: '2024-05', price: 128.40, volume: 1540 },
      { date: '2024-06', price: 132.80, volume: 1620 },
      { date: '2024-07', price: 134.50, volume: 1680 },
      { date: '2024-08', price: 137.20, volume: 1750 },
      { date: '2024-09', price: 135.90, volume: 1690 },
      { date: '2024-10', price: 139.60, volume: 1820 },
      { date: '2024-11', price: 138.20, volume: 1850 },
      { date: '2024-12', price: 135.60, volume: 1720 },
      { date: '2025-01', price: 140.80, volume: 1920 },
      { date: '2025-02', price: 139.40, volume: 1880 },
      { date: '2025-03', price: 141.90, volume: 1950 },
      { date: '2025-04', price: 143.20, volume: 2020 },
      { date: '2025-05', price: 142.70, volume: 1980 }
    ]
  }
};

const GrainPriceHistory = () => {
  const [selectedGrain, setSelectedGrain] = useState('soja');
  const [timeRange, setTimeRange] = useState('6m');
  const [data, setData] = useState([]);

  useEffect(() => {
    const currentGrain = grainData[selectedGrain];
    const selectedData = timeRange === '6m' ? currentGrain.data6m : currentGrain.data1y;
    setData(selectedData);
  }, [selectedGrain, timeRange]);

  const currentGrain = grainData[selectedGrain];
  const isPositive = currentGrain.cooperativas.coamo.change > 0;

  const formatPrice = (value) => `R$ ${value.toFixed(2)}`;
  const formatVolume = (value) => `${(value / 1000).toFixed(1)}k sc`;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Histórico de Preços de Grãos</h1>
                    <p className="text-gray-600">Acompanhe a variação dos preços dos principais grãos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Última atualização</p>
                  <p className="text-lg font-semibold text-gray-800">28 Mai 2025, 14:30</p>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-gray-500" />
                  <select
                    value={selectedGrain}
                    onChange={(e) => setSelectedGrain(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="soja">Soja</option>
                    <option value="milho">Milho</option>
                    <option value="trigo">Trigo</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="6m">Últimos 6 meses</option>
                    <option value="1y">Último ano</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Preço Atual</p>
                    <div className="space-y-2">
                      <p className="text-2xl font-semibold text-gray-900">COAMO: {formatPrice(currentGrain.cooperativas.coamo.currentPrice)}</p>
                      <p className="text-2xl font-semibold text-gray-900">LAR: {formatPrice(currentGrain.cooperativas.lar.currentPrice)}</p>
                      <p className="text-2xl font-semibold text-gray-900">COCAMAR: {formatPrice(currentGrain.cooperativas.cocamar.currentPrice)}</p>
                    </div>
                    <p className="text-sm text-gray-500">{currentGrain.unit}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Variação Mensal</p>
                    <p className={`text-2xl font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{currentGrain.cooperativas.coamo.change.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">vs mês anterior (COAMO)</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                    {isPositive ? 
                      <TrendingUp className={`h-6 w-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} /> :
                      <TrendingDown className={`h-6 w-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                    }
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Volume Médio</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatVolume(data.reduce((acc, item) => acc + item.volume, 0) / data.length || 0)}
                    </p>
                    <p className="text-sm text-gray-500">sacas/mês</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Preços */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Evolução de Preços - {currentGrain.name}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `R$ ${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [formatPrice(value), 'Preço']}
                      labelFormatter={(label) => `Período: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={currentGrain.color}
                      strokeWidth={3}
                      dot={{ fill: currentGrain.color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de Volume */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Volume de Negociação - {currentGrain.name}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [formatVolume(value), 'Volume']}
                      labelFormatter={(label) => `Período: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="volume" 
                      fill={currentGrain.color}
                      opacity={0.7}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tabela de Dados */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Dados Detalhados - {currentGrain.name}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Período
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço ({currentGrain.unit})
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Volume (sacas)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variação
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, index) => {
                      const prevPrice = index > 0 ? data[index - 1].price : row.price;
                      const change = ((row.price - prevPrice) / prevPrice) * 100;
                      const isPositiveChange = change > 0;
                      
                      return (
                        <tr key={row.date} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {row.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(row.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {row.volume.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {index === 0 ? (
                              <span className="text-gray-500">-</span>
                            ) : (
                              <span className={`${isPositiveChange ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                                {isPositiveChange ? (
                                  <TrendingUp className="h-4 w-4 mr-1" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 mr-1" />
                                )}
                                {isPositiveChange ? '+' : ''}{change.toFixed(1)}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 text-gray-500">
              <p>* Dados simulados para fins demonstrativos</p>
              <p>Fonte: Sistema de Cotações Agrícolas</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GrainPriceHistory;