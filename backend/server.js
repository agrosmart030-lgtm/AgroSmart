// backend/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sql = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de teste
app.get("/", async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    res.send(`PostgreSQL conectado: ${result[0].version}`);
  } catch (err) {
    res.status(500).send("Erro ao conectar com o banco");
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
const cooperativaRoutes = require("./routes/cooperativa");
app.use("/api/cooperativas", cooperativaRoutes);

