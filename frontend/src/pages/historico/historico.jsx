import {
  Activity,
  BarChart3,
  Calendar,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Navbar from "../../componentes/navbar";
import Footer from "../../componentes/footer";
// Dados simulados para diferentes grãos e cooperativas
const grainData = {
  soja: {
    name: "Soja",
    unit: "R$/sc 60kg",
    color: "#10B981",
    gradient: "from-emerald-400 to-emerald-600",
    cooperativas: {
      coamo: { currentPrice: 178.5, change: +5.2 },
      lar: { currentPrice: 175.2, change: +4.8 },
      cocamar: { currentPrice: 180.3, change: +6.0 },
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
      cocamar: { currentPrice: 90.5, change: -2.5 },
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
    data1y: [
      { date: "2024-05", price: 78.9, volume: 3640 },
      { date: "2024-06", price: 82.3, volume: 3780 },
      { date: "2024-07", price: 85.7, volume: 3920 },
      { date: "2024-08", price: 88.2, volume: 4050 },
      { date: "2024-09", price: 86.4, volume: 3850 },
      { date: "2024-10", price: 90.6, volume: 4180 },
      { date: "2024-11", price: 92.8, volume: 4120 },
      { date: "2024-12", price: 88.5, volume: 3890 },
      { date: "2025-01", price: 91.2, volume: 4050 },
      { date: "2025-02", price: 87.6, volume: 3780 },
      { date: "2025-03", price: 90.1, volume: 4180 },
      { date: "2025-04", price: 91.3, volume: 4220 },
      { date: "2025-05", price: 89.4, volume: 4080 },
    ],
  },
  trigo: {
    name: "Trigo",
    unit: "R$/sc 60kg",
    color: "#DC2626",
    gradient: "from-red-400 to-red-600",
    cooperativas: {
      coamo: { currentPrice: 142.7, change: +3.8 },
      lar: { currentPrice: 140.5, change: +3.5 },
      cocamar: { currentPrice: 144.2, change: +4.0 },
    },
    data6m: [
      { date: "2024-11", price: 138.2, volume: 1850 },
      { date: "2024-12", price: 135.6, volume: 1720 },
      { date: "2025-01", price: 140.8, volume: 1920 },
      { date: "2025-02", price: 139.4, volume: 1880 },
      { date: "2025-03", price: 141.9, volume: 1950 },
      { date: "2025-04", price: 143.2, volume: 2020 },
      { date: "2025-05", price: 142.7, volume: 1980 },
    ],
    data1y: [
      { date: "2024-05", price: 128.4, volume: 1540 },
      { date: "2024-06", price: 132.8, volume: 1620 },
      { date: "2024-07", price: 134.5, volume: 1680 },
      { date: "2024-08", price: 137.2, volume: 1750 },
      { date: "2024-09", price: 135.9, volume: 1690 },
      { date: "2024-10", price: 139.6, volume: 1820 },
      { date: "2024-11", price: 138.2, volume: 1850 },
      { date: "2024-12", price: 135.6, volume: 1720 },
      { date: "2025-01", price: 140.8, volume: 1920 },
      { date: "2025-02", price: 139.4, volume: 1880 },
      { date: "2025-03", price: 141.9, volume: 1950 },
      { date: "2025-04", price: 143.2, volume: 2020 },
      { date: "2025-05", price: 142.7, volume: 1980 },
    ],
  },
};

// Componente Header
const Header = ({
  currentGrain,
  selectedGrain,
  timeRange,
  onGrainChange,
  onTimeRangeChange,
}) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div
          className={`bg-gradient-to-r ${currentGrain.gradient} p-4 rounded-xl shadow-lg`}
        >
          <BarChart3 className="h-10 w-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Histórico de Preços de Grãos
          </h1>
          <p className="text-gray-600 text-lg">
            Acompanhe a evolução dos preços em tempo real
          </p>
        </div>
      </div>
      <div className="text-right bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-500 font-medium">Última Atualização</p>
        <p className="text-xl font-bold text-gray-800">28 Mai 2025</p>
        <p className="text-sm text-green-600 font-medium">14:30 BRT</p>
      </div>
    </div>

    <div className="flex flex-wrap gap-4">
      <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
        <BarChart3 className="h-5 w-5 text-gray-600" />
        <select
          value={selectedGrain}
          onChange={(e) => onGrainChange(e.target.value)}
          className="bg-transparent border-none font-semibold text-gray-800 focus:outline-none cursor-pointer"
        >
          <option value="soja">🌱 Soja</option>
          <option value="milho">🌽 Milho</option>
          <option value="trigo">🌾 Trigo</option>
        </select>
      </div>
      <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
        <Calendar className="h-5 w-5 text-gray-600" />
        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
          className="bg-transparent border-none font-semibold text-gray-800 focus:outline-none cursor-pointer"
        >
          <option value="6m">📊 Últimos 6 meses</option>
          <option value="1y">📈 Último ano</option>
        </select>
      </div>
    </div>
  </div>
);

// Ajustando os ícones para melhor formatação e mantendo-os no canto superior direito, mas com tamanho menor
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  isPositive,
  change,
}) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
          {title}
        </p>
        <div className="space-y-2">
          {typeof value === "object" ? (
            value
          ) : (
            <p className="text-4xl font-bold text-gray-900">{value}</p>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
        {change !== undefined && (
          <div
            className={`flex items-center mt-3 ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-5 w-5 mr-1" />
            ) : (
              <TrendingDown className="h-5 w-5 mr-1" />
            )}
            <span className="font-semibold text-base">
              {isPositive ? "+" : ""}
              {change.toFixed(1)}% este mês
            </span>
          </div>
        )}
      </div>
      <div className={`bg-gradient-to-r ${gradient} p-5 rounded-xl shadow-lg flex justify-end items-start`}>
        {Icon && <Icon className="h-6 w-6 text-white" />}
      </div>
    </div>
  </div>
);

// Componente ChartCard
const ChartCard = ({ title, children, subtitle }) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
    </div>
    {children}
  </div>
);

// Componente DataTable
const DataTable = ({ data, currentGrain }) => {
  const formatPrice = (value) => `R$ ${value.toFixed(2)}`;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800">
          Dados Detalhados - {currentGrain.name}
        </h3>
        <p className="text-gray-600">Histórico completo de preços e volumes</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-5 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                Período
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                Preço ({currentGrain.unit})
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                Volume (sacas)
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                Variação
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((row, index) => {
              const prevPrice = index > 0 ? data[index - 1].price : row.price;
              const change = ((row.price - prevPrice) / prevPrice) * 100;
              const isPositiveChange = change > 0;

              return (
                <tr
                  key={row.date}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-base font-bold text-gray-900">
                      {row.date}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-base font-semibold text-gray-900">
                      {formatPrice(row.price)}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-base text-gray-900">
                      {row.volume.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    {index === 0 ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                        Inicial
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                          isPositiveChange
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isPositiveChange ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {isPositiveChange ? "+" : ""}
                        {change.toFixed(1)}%
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
  );
};

// Componente Principal
const GrainPriceHistory = () => {
  const [selectedGrain, setSelectedGrain] = useState("soja");
  const [timeRange, setTimeRange] = useState("6m");
  const [data, setData] = useState([]);

  useEffect(() => {
    const currentGrain = grainData[selectedGrain];
    const selectedData =
      timeRange === "6m" ? currentGrain.data6m : currentGrain.data1y;
    setData(selectedData);
  }, [selectedGrain, timeRange]);

  const currentGrain = grainData[selectedGrain];
  const isPositive = currentGrain.cooperativas.coamo.change > 0;
  const averageVolume =
    data.reduce((acc, item) => acc + item.volume, 0) / data.length || 0;

  const formatPrice = (value) => `R$ ${value.toFixed(2)}`;
  const formatVolume = (value) => `${(value / 1000).toFixed(1)}k sc`;

  const cooperativasValues = (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-green-600 text-lg">COAMO:</span>
        <span className="font-bold text-2xl text-gray-900">
          {formatPrice(currentGrain.cooperativas.coamo.currentPrice)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-green-600 text-lg">LAR:</span>
        <span className="font-bold text-2xl text-gray-900">
          {formatPrice(currentGrain.cooperativas.lar.currentPrice)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-green-600 text-lg">COCAMAR:</span>
        <span className="font-bold text-2xl text-gray-900">
          {formatPrice(currentGrain.cooperativas.cocamar.currentPrice)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 pt-12">
      <Navbar />
      <div className="w-full px-8 py-8">
        <Header
          currentGrain={currentGrain}
          selectedGrain={selectedGrain}
          timeRange={timeRange}
          onGrainChange={setSelectedGrain}
          onTimeRangeChange={setTimeRange}
        />

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <StatCard
            title="Preços Atuais"
            value={cooperativasValues}
            subtitle={currentGrain.unit}
            icon={DollarSign}
            gradient="from-green-400 to-green-600"
          />

          <StatCard
            title="Variação Mensal"
            value={`${
              isPositive ? "+" : ""
            }${currentGrain.cooperativas.coamo.change.toFixed(1)}%`}
            subtitle="vs mês anterior (COAMO)"
            icon={isPositive ? TrendingUp : TrendingDown}
            gradient={
              isPositive
                ? "from-green-400 to-green-600"
                : "from-red-400 to-red-600"
            }
            isPositive={isPositive}
            change={currentGrain.cooperativas.coamo.change}
          />

          <StatCard
            title="Volume Médio"
            value={formatVolume(averageVolume)}
            subtitle="sacas/mês no período"
            icon={Activity}
            gradient="from-green-400 to-green-600"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <ChartCard
            title={`Evolução de Preços`}
            subtitle={`${currentGrain.name} - ${
              timeRange === "6m" ? "Últimos 6 meses" : "Último ano"
            }`}
          >
            <ResponsiveContainer width="100%" height={450}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 14, fill: "#666" }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <YAxis
                  tick={{ fontSize: 14, fill: "#666" }}
                  tickFormatter={(value) => `R$ ${value}`}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <Tooltip
                  formatter={(value) => [formatPrice(value), "Preço"]}
                  labelFormatter={(label) => `Período: ${label}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={currentGrain.color}
                  strokeWidth={4}
                  dot={{ fill: currentGrain.color, strokeWidth: 2, r: 6 }}
                  activeDot={{
                    r: 8,
                    stroke: currentGrain.color,
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title={`Volume de Negociação`}
            subtitle={`${currentGrain.name} - ${
              timeRange === "6m" ? "Últimos 6 meses" : "Último ano"
            }`}
          >
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 14, fill: "#666" }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <YAxis
                  tick={{ fontSize: 14, fill: "#666" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <Tooltip
                  formatter={(value) => [formatVolume(value), "Volume"]}
                  labelFormatter={(label) => `Período: ${label}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="volume"
                  fill={currentGrain.color}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Tabela de Dados */}
        <div className="mb-12">
          <DataTable data={data} currentGrain={currentGrain} />
        </div>
      </div>
      <Footer /> {/* Adicionando o Footer */}
    </div>
  );
};

export default GrainPriceHistory;
