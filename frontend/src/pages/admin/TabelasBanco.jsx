import React, { useState, useEffect } from "react";
import Navbar from "../../componentes/navbar";
import CartaoTabela from "../../componentes/admin/tabelaBanco/CartaoTabela";
import VisualizadorTabela from "../../componentes/admin/tabelaBanco/VisualizadorTabela";

const TabelasBanco = () => {
  const [tabelas, setTabelas] = useState([]);
  const [tabelaSelecionada, setTabelaSelecionada] = useState(null);
  const [dadosTabela, setDadosTabela] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoInicial, setCarregandoInicial] = useState(true);

  // Configuração das tabelas do sistema
  const tabelasSistema = [
    {
      nome: "tb_usuario",
      nomeExibicao: "Usuários",
      descricao: "Dados principais dos usuários cadastrados no sistema",
      qtdRegistros: 0,
      colunas: [
        { nome: "id", nomeExibicao: "ID", tipo: "SERIAL", ePrimaria: true },
        {
          nome: "nome_completo",
          nomeExibicao: "Nome Completo",
          tipo: "VARCHAR(255)",
        },
        { nome: "email", nomeExibicao: "Email", tipo: "VARCHAR(255)" },
        { nome: "senha", nomeExibicao: "Senha", tipo: "VARCHAR(255)" },
        { nome: "cidade", nomeExibicao: "Cidade", tipo: "VARCHAR(100)" },
        { nome: "estado", nomeExibicao: "Estado", tipo: "VARCHAR(100)" },
        {
          nome: "tipo_usuario",
          nomeExibicao: "Tipo de Usuário",
          tipo: "VARCHAR(20)",
        },
        { nome: "codigo_ibge", nomeExibicao: "Código IBGE", tipo: "INTEGER" },
      ],
    },
    {
      nome: "tb_agricultor",
      nomeExibicao: "Agricultores",
      descricao: "Informações específicas dos usuários agricultores",
      qtdRegistros: 0,
      colunas: [
        { nome: "id", nomeExibicao: "ID", tipo: "SERIAL", ePrimaria: true },
        {
          nome: "usuario_id",
          nomeExibicao: "ID do Usuário",
          tipo: "INTEGER",
          eEstrangeira: true,
        },
        { nome: "cpf", nomeExibicao: "CPF", tipo: "CHAR(11)" },
        {
          nome: "nome_propriedade",
          nomeExibicao: "Nome da Propriedade",
          tipo: "VARCHAR(255)",
        },
        {
          nome: "area_cultivada",
          nomeExibicao: "Área Cultivada",
          tipo: "NUMERIC(10,2)",
        },
      ],
    },
    {
      nome: "tb_empresario",
      nomeExibicao: "Empresários",
      descricao: "Informações específicas dos usuários empresários",
      qtdRegistros: 0,
      colunas: [
        { nome: "id", nomeExibicao: "ID", tipo: "SERIAL", ePrimaria: true },
        {
          nome: "usuario_id",
          nomeExibicao: "ID do Usuário",
          tipo: "INTEGER",
          eEstrangeira: true,
        },
        { nome: "cpf", nomeExibicao: "CPF", tipo: "CHAR(11)" },
        {
          nome: "nome_empresa",
          nomeExibicao: "Nome da Empresa",
          tipo: "VARCHAR(255)",
        },
        { nome: "cnpj", nomeExibicao: "CNPJ", tipo: "CHAR(14)" },
      ],
    },
    {
      nome: "tb_cooperativa",
      nomeExibicao: "Cooperativas",
      descricao: "Informações específicas das cooperativas",
      qtdRegistros: 0,
      colunas: [
        { nome: "id", nomeExibicao: "ID", tipo: "SERIAL", ePrimaria: true },
        {
          nome: "usuario_id",
          nomeExibicao: "ID do Usuário",
          tipo: "INTEGER",
          eEstrangeira: true,
        },
        {
          nome: "nome_cooperativa",
          nomeExibicao: "Nome da Cooperativa",
          tipo: "VARCHAR(255)",
        },
        { nome: "cnpj", nomeExibicao: "CNPJ", tipo: "CHAR(14)" },
        {
          nome: "regiao_atuacao",
          nomeExibicao: "Região de Atuação",
          tipo: "VARCHAR(255)",
        },
        {
          nome: "numero_associados",
          nomeExibicao: "Número de Associados",
          tipo: "INTEGER",
        },
      ],
    },
    {
      nome: "tb_grao",
      nomeExibicao: "Grãos",
      descricao: "Cadastro de grãos e commodities do sistema",
      qtdRegistros: 0,
      colunas: [
        { nome: "id", nomeExibicao: "ID", tipo: "SERIAL", ePrimaria: true },
        { nome: "nome", nomeExibicao: "Nome", tipo: "VARCHAR(100)" },
        {
          nome: "codigo_api",
          nomeExibicao: "Código da API",
          tipo: "VARCHAR(50)",
        },
        {
          nome: "unidade_medida",
          nomeExibicao: "Unidade de Medida",
          tipo: "VARCHAR(20)",
        },
        {
          nome: "cotacao_atual",
          nomeExibicao: "Cotação Atual",
          tipo: "NUMERIC(10,2)",
        },
        {
          nome: "data_atualizacao",
          nomeExibicao: "Data de Atualização",
          tipo: "TIMESTAMP",
        },
      ],
    },
    {
      nome: "tb_usuario_grao",
      nomeExibicao: "Relação Usuário-Grão",
      descricao: "Relacionamento entre usuários e grãos de interesse",
      qtdRegistros: 0,
      colunas: [
        { nome: "id", nomeExibicao: "ID", tipo: "SERIAL", ePrimaria: true },
        {
          nome: "usuario_id",
          nomeExibicao: "ID do Usuário",
          tipo: "INTEGER",
          eEstrangeira: true,
        },
        {
          nome: "grao_id",
          nomeExibicao: "ID do Grão",
          tipo: "INTEGER",
          eEstrangeira: true,
        },
        {
          nome: "tipo_relacao",
          nomeExibicao: "Tipo de Relação",
          tipo: "VARCHAR(20)",
        },
      ],
    },
    {
      nome: "tb_historico_cotacao",
      nomeExibicao: "Histórico de Cotações",
      descricao: "Histórico das cotações dos grãos",
      qtdRegistros: 0,
      colunas: [
        { nome: "id", nomeExibicao: "ID", tipo: "SERIAL", ePrimaria: true },
        {
          nome: "grao_id",
          nomeExibicao: "ID do Grão",
          tipo: "INTEGER",
          eEstrangeira: true,
        },
        { nome: "preco", nomeExibicao: "Preço", tipo: "NUMERIC(10,2)" },
        { nome: "data_cotacao", nomeExibicao: "Data da Cotação", tipo: "DATE" },
      ],
    },
    {
      nome: "tb_faq",
      nomeExibicao: "FAQ",
      descricao: "Perguntas e mensagens enviadas pelos usuários",
      qtdRegistros: 0,
      colunas: [
        { nome: "id", nomeExibicao: "ID", tipo: "SERIAL", ePrimaria: true },
        { nome: "nome", nomeExibicao: "Nome", tipo: "VARCHAR(255)" },
        { nome: "email", nomeExibicao: "Email", tipo: "VARCHAR(255)" },
        { nome: "mensagem", nomeExibicao: "Mensagem", tipo: "TEXT" },
        {
          nome: "data_envio",
          nomeExibicao: "Data de Envio",
          tipo: "TIMESTAMP",
        },
      ],
    },
    {
      nome: "tb_admin",
      nomeExibicao: "Administradores",
      descricao: "Usuários administradores do sistema",
      qtdRegistros: 0,
      colunas: [
        { nome: "id", nomeExibicao: "ID", tipo: "SERIAL", ePrimaria: true },
        { nome: "nome", nomeExibicao: "Nome", tipo: "VARCHAR(255)" },
        { nome: "senha", nomeExibicao: "Senha", tipo: "VARCHAR(255)" },
      ],
    },
  ];

  // Dados de exemplo para as tabelas
  const dadosExemplo = {
    tb_usuario: [
      {
        id: 1,
        nome_completo: "João Silva",
        email: "joao@email.com",
        senha: "***",
        cidade: "Ribeirão Preto",
        estado: "SP",
        tipo_usuario: "agricultor",
        codigo_ibge: 3543402,
      },
      {
        id: 2,
        nome_completo: "Maria Santos",
        email: "maria@empresa.com",
        senha: "***",
        cidade: "São Paulo",
        estado: "SP",
        tipo_usuario: "empresario",
        codigo_ibge: 3550308,
      },
      {
        id: 3,
        nome_completo: "Cooperativa Verde",
        email: "contato@verde.coop",
        senha: "***",
        cidade: "Campinas",
        estado: "SP",
        tipo_usuario: "cooperativa",
        codigo_ibge: 3509502,
      },
    ],
    tb_agricultor: [
      {
        id: 1,
        usuario_id: 1,
        cpf: "12345678901",
        nome_propriedade: "Fazenda São João",
        area_cultivada: 150.5,
      },
    ],
    tb_empresario: [
      {
        id: 1,
        usuario_id: 2,
        cpf: "98765432100",
        nome_empresa: "Empresa ABC Ltda",
        cnpj: "12345678000199",
      },
    ],
    tb_cooperativa: [
      {
        id: 1,
        usuario_id: 3,
        nome_cooperativa: "Cooperativa Verde",
        cnpj: "98765432000188",
        regiao_atuacao: "Interior de SP",
        numero_associados: 250,
      },
    ],
    tb_grao: [
      {
        id: 1,
        nome: "Soja",
        codigo_api: "SOJA_API",
        unidade_medida: "saca 60kg",
        cotacao_atual: 185.5,
        data_atualizacao: "2025-05-28 10:30:00",
      },
      {
        id: 2,
        nome: "Milho",
        codigo_api: "MILHO_API",
        unidade_medida: "saca 60kg",
        cotacao_atual: 95.75,
        data_atualizacao: "2025-05-28 10:30:00",
      },
    ],
    tb_usuario_grao: [
      { id: 1, usuario_id: 1, grao_id: 1, tipo_relacao: "cultiva" },
      { id: 2, usuario_id: 2, grao_id: 1, tipo_relacao: "interesse" },
    ],
    tb_historico_cotacao: [
      { id: 1, grao_id: 1, preco: 180.0, data_cotacao: "2025-05-27" },
      { id: 2, grao_id: 1, preco: 185.5, data_cotacao: "2025-05-28" },
    ],
    tb_faq: [
      {
        id: 1,
        nome: "Pedro Costa",
        email: "pedro@email.com",
        mensagem: "Como cadastrar um novo grão?",
        data_envio: "2025-05-28 09:15:00",
      },
    ],
    tb_admin: [{ id: 1, nome: "Admin Sistema", senha: "***" }],
  };

  useEffect(() => {
    const carregarTabelas = async () => {
      setCarregandoInicial(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const tabelasComQtd = tabelasSistema.map((tab) => ({
        ...tab,
        qtdRegistros: dadosExemplo[tab.nome]?.length || 0,
      }));
      setTabelas(tabelasComQtd);
      setCarregandoInicial(false);
    };
    carregarTabelas();
  }, []);

  const aoSelecionarTabela = async (tabela) => {
    setTabelaSelecionada(tabela);
    setCarregando(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setDadosTabela(dadosExemplo[tabela.nome] || []);
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
