import express from "express";
import cors from "cors";
import pkg from "pg";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega o .env da raiz do projeto
dotenv.config({ path: path.join(__dirname, ".env") });
const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 5001;
const databaseUrl = process.env.DATABASE_URL?.trim();
const pgHost = process.env.PGHOST?.trim();
const pgSslMode = (process.env.PGSSL || "").trim().toLowerCase();
const databaseUrlLower = databaseUrl?.toLowerCase() || "";
const pgHostLower = pgHost?.toLowerCase() || "";
const shouldUseSsl = Boolean(
  ["1", "true", "require", "required"].includes(pgSslMode) ||
    databaseUrlLower.includes("supabase") ||
    databaseUrlLower.includes("sslmode=require") ||
    pgHostLower.includes("supabase"),
);

const configuredCorsOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
]
  .flatMap((value) => (value || "").split(","))
  .map((origin) => origin.trim())
  .filter((origin) => origin && (process.env.NODE_ENV !== "production" || origin !== "*"));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...configuredCorsOrigins,
].map((origin) => origin.replace(/\/$/, ""));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }

      return callback(new Error(`Origem nao permitida pelo CORS: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "AgroSmart API",
    status: "ok",
    health: "/health",
    docs: "/api-docs",
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    databaseConfigured: Boolean(databaseUrl || pgHost),
    captchaEnabled: ["1", "true", "yes", "on"].includes(
      String(process.env.CAPTCHA_ENABLED || "").toLowerCase(),
    ),
  });
});

const databaseConfig = databaseUrl
  ? { connectionString: databaseUrl }
  : {
      user: process.env.PGUSER,
      host: pgHost,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
    };

const pool = new Pool({
  ...databaseConfig,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.stack);
  } else {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
    release();
  }
});

pool.on("error", (err) => {
  console.error("Erro inesperado no cliente do banco de dados:", err);
});

// Adiciona pool no app para acesso nas rotas
app.set("pool", pool);

// Importa e usa as rotas de login e registro
import createLoginRoutes from "./routes/login.js";
import createRegistroRoutes from "./routes/registro.js";
import createVerificationRoutes from "./routes/verification.js";
import createPasswordRoutes, { createResetPasswordRoute } from "./routes/password.js";
import { verifyToken } from "./utils/authMiddleware.js";

app.use("/api/login", createLoginRoutes(pool));
app.use("/api/registro", createRegistroRoutes(pool));

// Rotas públicas de recuperação de senha — sem autenticação
app.use("/api/forgot-password", createPasswordRoutes(pool));
app.use("/api/reset-password", createResetPasswordRoute(pool));
app.use("/api", createVerificationRoutes(pool));

// Importa e usa as rotas de teste de conexão
import dbTestRoutes from "./routes/dbTest.js";
app.use("/test", dbTestRoutes);

// Importa e usa as rotas de tabelas
import createTabelasRoutes from "./routes/tabelas.js";
app.use("/api/tabelas", verifyToken, createTabelasRoutes(pool));

// Importa e usa as rotas de FAQ
import createFaqRoutes from "./routes/faq.js";
app.use("/api/faq", createFaqRoutes(pool));

// ==========================================
// ROTA DA EMBRAPA (RESPONDE AGRO)
// ==========================================
import respondeAgroRoutes from "./routes/respondeAgro.js";
app.use("/api/responde-agro", respondeAgroRoutes);

// Importa e usa as rotas de configuração
import createConfiguracaoRoutes from "./routes/configuracao.js";
app.use("/api/configuracao", verifyToken, createConfiguracaoRoutes(pool));

import usuarios from "./routes/usuarios.js";
app.use("/api", verifyToken, usuarios);
import createCotacoesRoutes from "./routes/cotacoes.js";
app.use("/api/cotacoes", createCotacoesRoutes(pool));

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

app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error("Erro nao tratado na API:", err.message || err);
  return res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Erro interno no servidor."
        : err.message || "Erro interno no servidor.",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Garante que a tabela de cache de cotações exista
async function ensureCotacoesCacheTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tb_cotacoes_cache (
        id SERIAL PRIMARY KEY,
        provedor TEXT NOT NULL,
        dados JSONB NOT NULL,
        data_atualizacao TIMESTAMP NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_tb_cotacoes_cache_provedor ON tb_cotacoes_cache(provedor);
    `);
  } catch (e) {
    console.error("Erro ao garantir tabela tb_cotacoes_cache:", e.message || e);
  }
}

// Top-level: garante a tabela de histórico de cotações
async function ensureCotacoesHistoricoTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tb_cotacoes_historico (
        id SERIAL PRIMARY KEY,
        provedor TEXT NOT NULL,
        grao TEXT,
        preco NUMERIC,
        unidade TEXT,
        local TEXT,
        data_hora TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_hist_provedor ON tb_cotacoes_historico(provedor);
      CREATE INDEX IF NOT EXISTS idx_hist_grao ON tb_cotacoes_historico(grao);
      CREATE INDEX IF NOT EXISTS idx_hist_created_at ON tb_cotacoes_historico(created_at);
    `);
  } catch (e) {
    console.error(
      "Erro ao garantir tabela tb_cotacoes_historico:",
      e.message || e,
    );
  }
}

// --- Keep-alive: evita que a API de scraping adormeça no Render Free
import axios from "axios";

const SCRAPING_API_URL = (
  process.env.AGROSMART_SCRAPING_API_URL || "https://agrosmartapi.onrender.com"
).replace(/\/$/, "");

async function pingScrapingApi() {
  try {
    const headers = process.env.AGROSMART_SCRAPING_API_TOKEN
      ? { 'x-api-token': process.env.AGROSMART_SCRAPING_API_TOKEN }
      : {};
    await axios.get(`${SCRAPING_API_URL}/health`, { timeout: 10000, headers });
    console.log("[keep-alive] API de scraping respondeu.");
  } catch (err) {
    console.warn("[keep-alive] API de scraping não respondeu:", err.message);
  }
}

// Executa no próximo tick para não bloquear o listen
setImmediate(() => {
  Promise.all([
    ensureCotacoesCacheTable(),
    ensureCotacoesHistoricoTable(),
  ]);
  // Pinga a cada 13 minutos para manter a API acordada (Render dorme após ~15min)
  setInterval(pingScrapingApi, 13 * 60 * 1000);
  pingScrapingApi();
});
