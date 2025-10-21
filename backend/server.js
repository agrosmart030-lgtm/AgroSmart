import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import supabase from './utils/supabase.js';

dotenv.config();

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

app.set("supabase", supabase);

const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('tb_usuario').select('count');
    if (error) throw error;
    console.log("Conexão com Supabase estabelecida com sucesso.");
  } catch (err) {
    console.error("Erro ao conectar ao Supabase:", err);
  }
};

testConnection();

// Importa e usa as rotas de login e registro
import createLoginRoutes from "./routes/login.js";
import createRegistroRoutes from "./routes/registro.js";

app.use("/api/login", createLoginRoutes(supabase));
app.use("/api/registro", createRegistroRoutes(supabase));

// Importa e usa as rotas de tabelas
import createTabelasRoutes from "./routes/tabelas.js";
app.use("/api/tabelas", createTabelasRoutes(supabase));

// Importa e usa as rotas de FAQ
import createFaqRoutes from "./routes/faq.js";
app.use("/api/faq", createFaqRoutes(supabase));

// Importa e usa as rotas de configuração
import createConfiguracaoRoutes from "./routes/configuracao.js";
app.use("/api/configuracao", createConfiguracaoRoutes(supabase));

import usuarios from "./routes/usuarios.js";
app.use("/api", usuarios);
import createCotacoesRoutes from "./routes/cotacoes.js";
app.use("/api/cotacoes", createCotacoesRoutes(supabase));

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "AgroSmart Methodos",
    version: "1.0.0",
    description: "Documentação da API de Login e Registro do AgroSmart",
  },
  paths: {
    "/api/login": {
      post: {
        summary: "Realizar login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  senha: { type: "string" },
                },
                required: ["email", "senha"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login bem-sucedido",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    usuario: { type: "object" },
                  },
                },
              },
            },
          },
          401: {
            description: "Credenciais inválidas",
          },
        },
      },
    },
    "/api/registro": {
      post: {
        summary: "Registrar novo usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome_completo: { type: "string" },
                  email: { type: "string" },
                  senha: { type: "string" },
                  cidade: { type: "string" },
                  estado: { type: "string" },
                  tipo_usuario: { type: "string" },
                  codigo_ibge: { type: "integer" },
                },
                required: [
                  "nome_completo",
                  "email",
                  "senha",
                  "estado",
                  "tipo_usuario",
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Usuário registrado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    usuario: { type: "object" },
                  },
                },
              },
            },
          },
          400: {
            description: "E-mail já cadastrado",
          },
        },
      },
    },
    "/api/tabelas": {
      get: {
        summary: "Listar todas as tabelas do banco de dados",
        description:
          "Retorna um array com o nome de todas as tabelas do schema público do banco de dados PostgreSQL.",
        responses: {
          200: {
            description: "Lista de tabelas retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tabelas: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Erro ao consultar tabelas",
          },
        },
      },
    },
    "/api/tabelas/dados": {
      get: {
        summary: "Listar todas as tabelas e seus dados",
        description:
          "Retorna um array com o nome de todas as tabelas e até 20 registros de cada uma.",
        responses: {
          200: {
            description: "Lista de tabelas e dados retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tabelas: {
                      type: "array",
                      items: { type: "string" },
                    },
                    dados: {
                      type: "object",
                      additionalProperties: {
                        type: "array",
                        items: { type: "object" },
                      },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Erro ao consultar dados das tabelas",
          },
        },
      },
    },
    "/api/tabelas/{tabela}": {
      get: {
        summary: "Listar dados de uma tabela específica",
        description: "Retorna até 20 registros da tabela informada.",
        parameters: [
          {
            name: "tabela",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Nome da tabela a ser consultada",
          },
        ],
        responses: {
          200: {
            description: "Dados da tabela retornados com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tabela: { type: "string" },
                    dados: {
                      type: "array",
                      items: { type: "object" },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Tabela não encontrada." },
          500: { description: "Erro ao consultar dados da tabela" },
        },
      },
    },
    "/api/tabelas/agricultores": {
      post: {
        summary: "Adicionar agricultor (preencher tabela)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  usuario_id: { type: "integer" },
                  cpf: { type: "string" },
                  nome_propriedade: { type: "string" },
                  area_cultivada: { type: "number" },
                },
                required: ["usuario_id", "cpf"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Agricultor criado",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/api/tabelas/empresarios": {
      post: {
        summary: "Adicionar empresário (preencher tabela)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  usuario_id: { type: "integer" },
                  cpf: { type: "string" },
                  nome_empresa: { type: "string" },
                  cnpj: { type: "string" },
                },
                required: ["usuario_id", "nome_empresa"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Empresário criado",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/api/tabelas/cooperativas": {
      post: {
        summary: "Adicionar cooperativa (preencher tabela)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  usuario_id: { type: "integer" },
                  nome_cooperativa: { type: "string" },
                  cnpj: { type: "string" },
                  regiao_atuacao: { type: "string" },
                  numero_associados: { type: "integer" },
                },
                required: ["usuario_id", "nome_cooperativa", "cnpj"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Cooperativa criada",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/api/tabelas/graos": {
      post: {
        summary: "Adicionar grão (preencher tabela)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: { type: "string" },
                  codigo_api: { type: "string" },
                  unidade_medida: { type: "string" },
                  cotacao_atual: { type: "number" },
                  data_atualizacao: { type: "string", format: "date-time" },
                },
                required: ["nome"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Grão criado",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/api/tabelas/usuario-grao": {
      post: {
        summary: "Adicionar relacionamento usuário-grão (preencher tabela)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  usuario_id: { type: "integer" },
                  grao_id: { type: "integer" },
                  tipo_relacao: { type: "string" },
                },
                required: ["usuario_id", "grao_id", "tipo_relacao"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Relacionamento criado",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/api/tabelas/historico-cotacao": {
      post: {
        summary: "Adicionar histórico de cotação (preencher tabela)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  grao_id: { type: "integer" },
                  preco: { type: "number" },
                  data_cotacao: { type: "string", format: "date" },
                },
                required: ["grao_id", "preco", "data_cotacao"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Histórico de cotação criado",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/api/faq": {
      post: {
        summary: "Enviar mensagem para o FAQ",
        description: "Adiciona uma nova mensagem enviada pelo usuário ao FAQ.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: { type: "string" },
                  email: { type: "string" },
                  mensagem: { type: "string" },
                },
                required: ["nome", "email", "mensagem"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Mensagem enviada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    faq: { type: "object" },
                  },
                },
              },
            },
          },
          500: { description: "Erro ao enviar mensagem" },
        },
      },
      get: {
        summary: "Listar mensagens do FAQ",
        description: "Retorna as últimas 50 mensagens enviadas pelo FAQ.",
        responses: {
          200: {
            description: "Mensagens listadas com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    faqs: {
                      type: "array",
                      items: { type: "object" },
                    },
                  },
                },
              },
            },
          },
          500: { description: "Erro ao consultar mensagens" },
        },
      },
    },
  },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ...adicione suas rotas e lógica aqui...

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});