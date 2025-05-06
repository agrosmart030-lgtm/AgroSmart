const express = require("express");
const router = express.Router();
const sql = require("../db");

// GET: listar cooperativas
router.get("/", async (req, res) => {
  try {
    const cooperativas = await sql`SELECT * FROM cooperativa`;
    res.json(cooperativas);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar cooperativas" });
  }
});

// POST: adicionar cooperativa
router.post("/", async (req, res) => {
  const { email, senha, cnpj, nome_cooperativa, uf } = req.body;
  try {
    const nova = await sql`
      INSERT INTO cooperativa (email, senha, cnpj, nome_cooperativa, uf)
      VALUES (${email}, ${senha}, ${cnpj}, ${nome_cooperativa}, ${uf})
      RETURNING *`;
    res.status(201).json(nova[0]);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao inserir cooperativa" });
  }
});

module.exports = router;
