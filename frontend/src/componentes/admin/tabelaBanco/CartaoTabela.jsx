import React from "react";
import {
  Table,
  Users,
  Building,
  Wheat,
  TrendingUp,
  MessageSquare,
  Shield,
} from "lucide-react";

const CartaoTabela = ({ tabela, aoSelecionar, selecionada }) => {
  const obterIcone = (nomeTabela) => {
    const icones = {
      tb_usuario: Users,
      tb_agricultor: Users,
      tb_empresario: Building,
      tb_cooperativa: Building,
      tb_grao: Wheat,
      tb_usuario_grao: TrendingUp,
      tb_historico_cotacao: TrendingUp,
      tb_faq: MessageSquare,
      tb_admin: Shield,
    };
    return icones[nomeTabela] || Table;
  };

  const obterCor = (nomeTabela) => {
    const cores = {
      tb_usuario: "bg-blue-100 text-blue-600",
      tb_agricultor: "bg-green-100 text-green-600",
      tb_empresario: "bg-purple-100 text-purple-600",
      tb_cooperativa: "bg-orange-100 text-orange-600",
      tb_grao: "bg-yellow-100 text-yellow-600",
      tb_usuario_grao: "bg-indigo-100 text-indigo-600",
      tb_historico_cotacao: "bg-red-100 text-red-600",
      tb_faq: "bg-pink-100 text-pink-600",
      tb_admin: "bg-gray-100 text-gray-600",
    };
    return cores[nomeTabela] || "bg-gray-100 text-gray-600";
  };

  const Icone = obterIcone(tabela.nome);

  return (
    <div
      className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        selecionada
          ? "border-green-500 bg-green-50 shadow-md"
          : "border-gray-200 bg-white hover:border-green-300 hover:shadow-sm"
      }`}
      onClick={() => aoSelecionar(tabela)}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className={`p-2 rounded-lg ${obterCor(tabela.nome)}`}>
          <Icone className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {tabela.nomeExibicao}
        </h3>
      </div>
      <p className="text-sm text-gray-600 mb-3">{tabela.descricao}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{tabela.qtdRegistros} registros</span>
        <span>{tabela.colunas.length} colunas</span>
      </div>
    </div>
  );
};

export default CartaoTabela;
