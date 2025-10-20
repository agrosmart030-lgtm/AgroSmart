import React, { useState, useEffect } from "react";
import Navbar from "../../componentes/navbar";
import CartaoTabela from "../../componentes/admin/tabelaBanco/CartaoTabela";
import VisualizadorTabela from "../../componentes/admin/tabelaBanco/VisualizadorTabela";

const API_URL = "http://localhost:5001/api/tabelas";

const TabelasBanco = () => {
  const [tabelas, setTabelas] = useState([]);
  const [tabelaSelecionada, setTabelaSelecionada] = useState(null);
  const [dadosTabela, setDadosTabela] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoInicial, setCarregandoInicial] = useState(true);

  useEffect(() => {
    const carregarTabelas = async () => {
      setCarregandoInicial(true);
      try {
        const resp = await fetch(API_URL);
        const json = await resp.json();
        const tabelasFormatadas = await Promise.all(
          json.tabelas.map(async (nome) => {
            try {
              const respDados = await fetch(`${API_URL}/${nome}`);
              const jsonDados = await respDados.json();
              const dados = jsonDados.dados || [];
              const colunas =
                jsonDados.colunas ||
                (dados.length > 0
                  ? Object.keys(dados[0]).map((nome) => ({
                      nome,
                      nomeExibicao: nome,
                      tipo: "",
                    }))
                  : []);
              return {
                nome,
                nomeExibicao: nome,
                descricao: `Tabela ${nome}`,
                qtdRegistros: dados.length,
                colunas,
              };
            } catch {
              return {
                nome,
                nomeExibicao: nome,
                descricao: `Tabela ${nome}`,
                qtdRegistros: 0,
                colunas: [],
              };
            }
          })
        );
        setTabelas(tabelasFormatadas);
      } catch (e) {
        setTabelas([]);
        console.log("Erro ao carregar tabelas:", e);
      }
      setCarregandoInicial(false);
    };
    carregarTabelas();
  }, []);

  // Busca os dados e colunas da tabela selecionada
  const aoSelecionarTabela = async (tabela) => {
    setCarregando(true);
    try {
      const resp = await fetch(`${API_URL}/${tabela.nome}`);
      const json = await resp.json();
      const dados = json.dados || [];
      const colunas =
        json.colunas ||
        (dados.length > 0
          ? Object.keys(dados[0]).map((nome) => ({
              nome,
              nomeExibicao: nome,
              tipo: "",
            }))
          : []);
      setTabelaSelecionada({ ...tabela, colunas });
      setDadosTabela(dados);
    } catch (e) {
      setDadosTabela([]);
      setTabelaSelecionada({ ...tabela, colunas: [] });
      console.log("Erro ao carregar tabelas:", e);
    }
    setCarregando(false);
  };

  const aoAtualizar = () => {
    if (tabelaSelecionada) {
      aoSelecionarTabela(tabelaSelecionada);
    }
  };

  if (carregandoInicial) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando tabelas do banco...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 pt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Consulta de Tabelas do Banco
          </h1>
          <p className="text-gray-600">
            Consulte e gerencie as tabelas do sistema AgroSmart.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tabelas.map((tabela) => (
            <CartaoTabela
              key={tabela.nome}
              tabela={tabela}
              aoSelecionar={aoSelecionarTabela}
              selecionada={tabelaSelecionada?.nome === tabela.nome}
            />
          ))}
        </div>
        <VisualizadorTabela
          tabela={tabelaSelecionada}
          dados={dadosTabela}
          carregando={carregando}
          aoAtualizar={aoAtualizar}
        />
      </div>
    </div>
  );
};

export default TabelasBanco;
