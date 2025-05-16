import { Router } from "express";

export default function createTabelasRoutes(pool) {
  const router = Router();

  // Retorna todas as tabelas do banco de dados atual
  router.get("/", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);
      res.json({ tabelas: result.rows.map((r) => r.table_name) });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Retorna todas as tabelas e seus dados (primeiros 20 registros de cada)
  router.get("/dados", async (req, res) => {
    try {
      const tabelasResult = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);
      const tabelas = tabelasResult.rows.map((r) => r.table_name);
      const dados = {};
      for (const tabela of tabelas) {
        try {
          const registros = await pool.query(
            `SELECT * FROM ${tabela} LIMIT 20`
          );
          dados[tabela] = registros.rows;
        } catch (err) {
          dados[tabela] = { erro: err.message };
        }
      }
      res.json({ tabelas, dados });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
