import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pkg from "pg";
import swaggerUi from "swagger-ui-express";
const { Pool } = pkg;

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "agrosmart",
  password: "Rubinho091123",
  port: 5432,
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

// Importa e usa as rotas de teste de conexão
import dbTestRoutes from "./routes/dbTest.js";
app.use("/test", dbTestRoutes);

// ...adicione suas rotas e lógica aqui...

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
