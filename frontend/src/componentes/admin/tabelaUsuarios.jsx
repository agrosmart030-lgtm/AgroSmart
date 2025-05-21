import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";

// Componente principal para o gráfico de distribuição de usuários
export default function UserDistributionChart() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cores para cada tipo de usuário
  const COLORS = {
    agricultor: "#8BC34A", // Verde
    empresario: "#2196F3", // Azul
    cooperativa: "#FF9800", // Laranja
  };

  // Simula a busca de dados do servidor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5001/test/usuarios-tipo");
        // Conta quantos usuários de cada tipo existem
        const counts = { agricultor: 0, empresario: 0, cooperativa: 0 };
        res.data.forEach((user) => {
          if (counts[user.tipo_usuario] !== undefined)
            counts[user.tipo_usuario]++;
        });
        const data = [
          {
            name: "Agricultores",
            value: counts.agricultor,
            type: "agricultor",
          },
          { name: "Empresários", value: counts.empresario, type: "empresario" },
          {
            name: "Cooperativas",
            value: counts.cooperativa,
            type: "cooperativa",
          },
        ];
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados dos usuários");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Formatar para porcentagem no tooltip
  const renderTooltipContent = (props) => {
    const { payload } = props;
    if (payload && payload.length > 0) {
      const data = payload[0].payload;
      const total = userData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            {data.value} usuários ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Mostrar mensagem de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensagem de erro
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <p className="text-red-600">{error}</p>
        <button
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Calcular total de usuários
  const totalUsers = userData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white p-2 m-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Distribuição de Usuários
      </h2>
      <div className="text-center mb-2">
        <span className="text-2xl font-bold">{totalUsers}</span>
        <span className="text-gray-600 ml-2">usuários registrados</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={userData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(1)}%)`
              }
              labelLine={false}
            >
              {userData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.type]} />
              ))}
            </Pie>
            <Tooltip content={renderTooltipContent} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {userData.map((entry) => (
          <div
            key={entry.type}
            className="bg-gray-50 p-2 rounded-lg text-center"
          >
            <div className="flex items-center justify-center mb-1">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[entry.type] }}
              />
              <span className="font-medium">{entry.name}</span>
            </div>
            <p className="text-lg font-semibold">{entry.value}</p>
            <p className="text-xs text-gray-500">
              {((entry.value / totalUsers) * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
