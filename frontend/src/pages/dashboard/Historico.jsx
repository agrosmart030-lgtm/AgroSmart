// src/pages/dashboard/Historico.jsx
import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Footer from "../../componentes/footer";
import Navbar from "../../componentes/navbar";

const HistoricoPage = () => {
  const location = useLocation();

  // inicializa a partir do estado de navegação (quando vindo do Dashboard)
  const initialCoop = (location.state && location.state.coop) || "COAMO";
  const initialGraoRaw = (location.state && location.state.grao) || "SOJA";
  const initialGrao = String(initialGraoRaw).toUpperCase();

  const [produtosSelecionados, setProdutosSelecionados] = useState([
    initialGrao,
  ]);
  const [cooperativaSelecionada, setCooperativaSelecionada] =
    useState(initialCoop);
  const [periodo, setPeriodo] = useState("30");

  const produtos = ["SOJA", "MILHO", "TRIGO", "CAFÉ"];

  const cooperativas = [
    { id: "COAMO", nome: "COAMO", logo: "🌾" },
    { id: "LAR", nome: "LAR", logo: "❤️" },
    { id: "COCAMAR", nome: "COCAMAR", logo: "🌱" },
  ];

  const coresProdutos = {
    SOJA: "#22c55e",
    MILHO: "#f59e0b",
    TRIGO: "#eab308",
    CAFÉ: "#84cc16",
  };

  // --- Novas funções: converte hex para rgba e cria box-shadow verde com profundidade
  const hexToRgba = (hex, alpha = 1) => {
    const h = hex.replace("#", "");
    const bigint = parseInt(
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h,
      16
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getBoxShadow = (hex = "#10B981", intensity = 0.12) => {
    // profundidade principal + leve elevação
    return `0 30px 60px ${hexToRgba(hex, intensity)}, 0 6px 18px ${hexToRgba(hex, intensity * 0.5)}, inset 0 -6px 24px ${hexToRgba("#000000", 0.02)}`;
  };
  // --- fim das funções

  // atualiza caso location.state mude após montagem
  useEffect(() => {
    if (location.state) {
      if (
        location.state.coop &&
        location.state.coop !== cooperativaSelecionada
      ) {
        setCooperativaSelecionada(location.state.coop);
      }
      if (location.state.grao) {
        const g = String(location.state.grao).toUpperCase();
        if (!produtosSelecionados.includes(g)) {
          setProdutosSelecionados([g]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // Gera histórico simulado para um produto/cooperativa em 'periodo' dias
  const gerarHistorico = (produto, cooperativa) => {
    const dias = parseInt(periodo, 10) || 15;
    const historico = [];
    const precoBase =
      produto === "SOJA"
        ? 128.5
        : produto === "MILHO"
          ? 56.3
          : produto === "TRIGO"
            ? 67.0
            : 29.24;

    for (let i = dias - 1; i >= 0; i--) {
      const data = new Date();
      data.setDate(data.getDate() - i);
      const variacao = (Math.random() - 0.5) * 10;
      const preco = parseFloat((precoBase + variacao).toFixed(2));
      historico.push({
        data: data.toLocaleDateString("pt-BR"),
        dataSimples: `${data.getDate()}/${data.getMonth() + 1}`,
        preco: preco.toFixed(2),
        precoNum: preco,
        variacao: parseFloat(((Math.random() - 0.5) * 5).toFixed(2)),
      });
    }
    return historico;
  };

  // dados para o gráfico (últimos 15 dias por padrão)
  const gerarDadosGrafico = () => {
    const dias = 15;
    const dadosGrafico = [];
    for (let i = dias - 1; i >= 0; i--) {
      const data = new Date();
      data.setDate(data.getDate() - i);
      const item = {
        data: `${data.getDate()}/${data.getMonth() + 1}`,
        dataCompleta: data.toLocaleDateString("pt-BR"),
      };

      produtosSelecionados.forEach((produto) => {
        const precoBase =
          produto === "SOJA"
            ? 128.5
            : produto === "MILHO"
              ? 56.3
              : produto === "TRIGO"
                ? 67.0
                : 29.24;
        const variacao = (Math.random() - 0.5) * 8;
        item[produto] = parseFloat((precoBase + variacao).toFixed(2));
      });

      dadosGrafico.push(item);
    }
    return dadosGrafico;
  };

  const toggleProduto = (produto) => {
    if (produtosSelecionados.includes(produto)) {
      setProdutosSelecionados(
        produtosSelecionados.filter((p) => p !== produto)
      );
    } else {
      setProdutosSelecionados([...produtosSelecionados, produto]);
    }
  };

  const dadosGrafico = useMemo(
    () => gerarDadosGrafico(),
    [produtosSelecionados, periodo]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Painel principal com Tabs (mesma aparência do Dashboard) */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Painel de Historico
            </h1>

            <div className="flex border-b border-gray-200">
              <Link
                to="/dashboard"
                className="px-4 py-2 font-medium text-sm text-gray-500 hover:text-gray-700"
              >
                Cotação
              </Link>
              <Link
                to="/dashboard/historico"
                className="px-4 py-2 font-medium text-sm text-green-600 border-b-2 border-green-600"
              >
                Histórico
              </Link>
            </div>
          </div>
          {/* Filtros */}
          <div
            className="bg-white rounded-2xl p-6 shadow mb-6 border"
            style={{ boxShadow: getBoxShadow("#10B981", 0.08) }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cooperativa
                </label>
                <select
                  value={cooperativaSelecionada}
                  onChange={(e) => setCooperativaSelecionada(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300"
                >
                  {cooperativas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Grão
                </label>
                <input
                  value={produtosSelecionados.join(", ")}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {produtos.map((p) => (
                    <button
                      key={p}
                      onClick={() => toggleProduto(p)}
                      className={`px-3 py-1 rounded-full font-semibold text-sm ${produtosSelecionados.includes(p) ? "text-white" : "text-gray-700"}`}
                      style={{
                        background: produtosSelecionados.includes(p)
                          ? coresProdutos[p]
                          : "#f3f4f6",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Período (dias)
                </label>
                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300"
                >
                  <option value="7">Últimos 7 dias</option>
                  <option value="15">Últimos 15 dias</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="60">Últimos 60 dias</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabelas e Gráfico */}
          {produtosSelecionados.length === 0 ? (
            <div className="rounded-2xl p-8 bg-yellow-50 border mb-6">
              <p className="text-center font-semibold">
                Selecione pelo menos um produto para visualizar o histórico
              </p>
            </div>
          ) : (
            <>
              {produtosSelecionados.map((produto) => {
                const historico = gerarHistorico(
                  produto,
                  cooperativaSelecionada
                );
                const ultimoPreco = parseFloat(
                  historico[historico.length - 1].preco
                );
                const primeiroPreco = parseFloat(historico[0].preco);
                const variacaoTotal =
                  ((ultimoPreco - primeiroPreco) / primeiroPreco) * 100;
                const corProduto = coresProdutos[produto];

                return (
                  <div
                    key={produto}
                    className="bg-white rounded-2xl p-6 shadow mb-6 border"
                    style={{ boxShadow: getBoxShadow(corProduto, 0.18) }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3
                          className="text-xl font-bold"
                          style={{ color: corProduto }}
                        >
                          {produto}
                        </h3>
                        <p className="text-sm text-gray-600">
                          🏢 {cooperativaSelecionada} • Saca 60kg
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-extrabold">
                          R$ {ultimoPreco.toFixed(2)}
                        </div>
                        <div
                          className={`inline-flex items-center gap-2 mt-2 font-bold px-3 py-1 rounded-full ${variacaoTotal >= 0 ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"}`}
                        >
                          {variacaoTotal >= 0 ? (
                            <TrendingUp size={16} />
                          ) : (
                            <TrendingDown size={16} />
                          )}{" "}
                          {variacaoTotal >= 0 ? "+" : ""}
                          {variacaoTotal.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr>
                            <th className="p-3 text-sm font-bold text-gray-700">
                              Data
                            </th>
                            <th className="p-3 text-sm font-bold text-gray-700 text-right">
                              Preço (R$)
                            </th>
                            <th className="p-3 text-sm font-bold text-gray-700 text-right">
                              Variação
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {historico.map((item, idx) => (
                            <tr key={idx} className="border-t">
                              <td className="p-3 text-gray-700">{item.data}</td>
                              <td
                                className="p-3 text-right font-bold"
                                style={{ color: corProduto }}
                              >
                                {item.preco}
                              </td>
                              <td className="p-3 text-right">
                                <span
                                  className={`px-2 py-1 rounded-full font-bold ${item.variacao >= 0 ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"}`}
                                >
                                  {item.variacao >= 0 ? "+" : ""}
                                  {item.variacao.toFixed(1)}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              {/* Gráfico */}
              <div
                className="bg-white rounded-2xl p-6 shadow mb-12 border"
                style={{ boxShadow: getBoxShadow("#10B981", 0.1) }}
              >
                <h3 className="text-xl font-bold mb-2">
                  Evolução dos Preços - Últimos 15 Dias
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Visualize as tendências de preços por produto
                </p>

                <div style={{ width: "100%", height: 400 }}>
                  <ResponsiveContainer>
                    <LineChart data={dadosGrafico}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                      <XAxis
                        dataKey="data"
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                      <Tooltip />
                      <Legend />
                      {produtosSelecionados.map((produto) => (
                        <Line
                          key={produto}
                          type="monotone"
                          dataKey={produto}
                          stroke={coresProdutos[produto]}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 6 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HistoricoPage;
