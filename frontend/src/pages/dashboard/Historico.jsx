// src/pages/dashboard/Historico.jsx
import axios from "axios";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import Footer from "../../componentes/footer";
import Navbar from "../../componentes/navbar";

// Dados para o histórico de preços (mesmos mocks usados antes)
const historyData = {
  soja: {
    name: "Soja",
    unit: "R$/sc 60kg",
    color: "#10B981",
    gradient: "from-emerald-400 to-emerald-600",
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
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  isPositive,
  change,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full">
    <div className="flex justify-between items-start h-full">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        {change !== undefined && (
          <div className="mt-2 flex items-center">
            {isPositive ? (
              <span className="text-green-500 mr-1">▲</span>
            ) : (
              <span className="text-red-500 mr-1">▼</span>
            )}
            <span
              className={`text-xs font-medium ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {change}% {isPositive ? "alta" : "baixa"}
            </span>
          </div>
        )}
      </div>
      <div
        className={`p-2 rounded-lg ${gradient} bg-gradient-to-br text-white`}
      >
        <Icon size={20} />
      </div>
    </div>
  </div>
);

// Componente ChartCard para envolver os gráficos
const ChartCard = ({ title, children, subtitle }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="px-4 pt-4 pb-2 border-b border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const HistoricoPage = () => {
  const [currentGrain, setCurrentGrain] = useState("soja");
  const [timeRange, setTimeRange] = useState("6m");
  const [historyCoop, setHistoryCoop] = useState("LAR");
  const [historyGrao, setHistoryGrao] = useState("");
  const [historySeries, setHistorySeries] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // API base URL (Vite or CRA)
  const viteEnv =
    typeof import.meta !== "undefined" ? import.meta.env : undefined;
  const craEnv = typeof process !== "undefined" ? process.env : undefined;
  const apiBaseUrl =
    (viteEnv && viteEnv.VITE_API_URL) ||
    (craEnv && craEnv.REACT_APP_API_URL) ||
    "http://localhost:5001/api";

  useEffect(() => {
    const controller = new AbortController();
    async function loadHistory() {
      try {
        setHistoryLoading(true);
        setHistoryError(null);
        const params = new URLSearchParams();
        params.set("coop", historyCoop);
        params.set("period", timeRange);
        if (historyGrao) params.set("grao", historyGrao);
        const resp = await axios.get(
          `${apiBaseUrl}/cotacoes/historico?${params.toString()}`,
          { signal: controller.signal }
        );
        const series = Array.isArray(resp.data?.series) ? resp.data.series : [];
        const mapped = series.map((pt) => ({
          date:
            typeof pt.date === "string" ? pt.date.substring(0, 10) : pt.date,
          price: Number(pt.price),
          volume: pt.volume !== undefined ? Number(pt.volume) : undefined,
        }));
        setHistorySeries(mapped);
      } catch (e) {
        if (e.name !== "CanceledError") {
          setHistoryError("Falha ao carregar histórico");
          setHistorySeries([]);
        }
      } finally {
        setHistoryLoading(false);
      }
    }
    loadHistory();
    return () => controller.abort();
  }, [historyCoop, historyGrao, timeRange, apiBaseUrl]);

  const chartData =
    historySeries.length > 0
      ? historySeries
      : timeRange === "6m"
        ? historyData[currentGrain].data6m
        : historyData[currentGrain].data1y;
  const last = chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const prev = chartData.length > 1 ? chartData[chartData.length - 2] : null;
  const currentPrice = last ? Number(last.price) : 0;
  const priceChange =
    last && prev && prev.price
      ? Number(((currentPrice - prev.price) / prev.price) * 100).toFixed(2)
      : 0;
  const isPositiveChange = priceChange >= 0;
  const averagePrice =
    chartData.length > 0
      ? (
          chartData.reduce((sum, item) => sum + Number(item.price), 0) /
          chartData.length
        ).toFixed(2)
      : "0.00";
  const currentUnit = historyData[currentGrain]?.unit || "R$";
  const currentColor = historyData[currentGrain]?.color || "#10B981";

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Histórico de Preços
            </h1>

            <div className="flex border-b border-gray-200">
              <Link
                to="/dashboard"
                className={`px-4 py-2 font-medium text-sm text-gray-500 hover:text-gray-700`}
              >
                Cotação
              </Link>
              <Link
                to="/dashboard/historico"
                className={`px-4 py-2 font-medium text-sm text-green-600 border-b-2 border-green-600`}
              >
                Histórico
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            {/* Filtros do Histórico */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-base font-medium text-gray-700 mb-3">
                Filtros
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Cooperativa
                  </label>
                  <select
                    value={historyCoop}
                    onChange={(e) => setHistoryCoop(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm py-2"
                  >
                    <option value="LAR">LAR</option>
                    <option value="COAMO">COAMO</option>
                    <option value="COCAMAR">COCAMAR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Grão
                  </label>
                  <input
                    value={historyGrao}
                    onChange={(e) => setHistoryGrao(e.target.value)}
                    placeholder="ex: Soja, Milho"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm py-2 px-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Período
                  </label>
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
                <p className="text-xs text-gray-500 mt-2">
                  Carregando histórico...
                </p>
              )}
              {historyError && (
                <p className="text-xs text-red-500 mt-2">{historyError}</p>
              )}
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Média"
                value={`R$ ${averagePrice.replace(".", ",")}`}
                subtitle={`${timeRange === "6m" ? "6 meses" : "1 ano"}`}
                icon={Calendar}
                gradient="from-blue-500 to-blue-600"
              />
            </div>

            {/* Gráfico de Preço */}
            <ChartCard
              title="Variação de Preço"
              subtitle={`${historyCoop}${
                historyGrao ? " - " + historyGrao : ""
              } • ${timeRange === "6m" ? "Últimos 6 meses" : "Último ano"}`}
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorPrice"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={currentColor}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={currentColor}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickMargin={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      width={60}
                      tickFormatter={(value) => `R$ ${value}`}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value) => [`R$ ${value}`, "Preço"]}
                      labelFormatter={(label) => `Data: ${label}`}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                        padding: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={currentColor}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{
                        r: 6,
                        stroke: "#fff",
                        strokeWidth: 2,
                        fill: currentColor,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Gráfico de Volume */}
            <ChartCard
              title="Volume de Negociação"
              subtitle={`${historyCoop}${
                historyGrao ? " - " + historyGrao : ""
              } • ${timeRange === "6m" ? "Últimos 6 meses" : "Último ano"}`}
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorVolume"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={currentColor}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={currentColor}
                          stopOpacity={0.2}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickMargin={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      width={60}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value) => [
                        new Intl.NumberFormat("pt-BR").format(value),
                        "Volume",
                      ]}
                      labelFormatter={(label) => `Data: ${label}`}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                        padding: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                    />
                    <Bar
                      dataKey="volume"
                      fill="url(#colorVolume)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HistoricoPage;
