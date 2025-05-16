import { Router } from "express";

const router = Router();

// Rota para testar conexão com o banco (SELECT 1)
router.get("/db-status", async (req, res) => {
  try {
    const pool = req.app.get("pool");
    const result = await pool.query("SELECT 1");
    if (result && result.rows.length > 0) {
      res.json({
        connected: true,
        message: "Conectado ao banco PostgreSQL local!",
      });
    } else {
      res
        .status(500)
        .json({ connected: false, message: "Sem resposta do banco local." });
    }
  } catch (err) {
    res.status(500).json({
      connected: false,
      message: "Erro ao conectar ao banco local.",
      error: err.message,
    });
  }
});

// Rota para testar versão do banco
router.get("/db-version", async (req, res) => {
  try {
    const pool = req.app.get("pool");
    const result = await pool.query("SELECT version() as version");
    res.json({ version: result.rows[0].version });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao obter versão do banco.", details: err.message });
  }
});

export default router;
