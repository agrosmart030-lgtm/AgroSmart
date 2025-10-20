import { Router } from "express";

export default function createFaqRoutes(pool) {
  const router = Router();

  // Envia mensagem para o FAQ
  router.post("/", async (req, res) => {
    const { nome, email, mensagem } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO tb_faq (nome, email, mensagem) VALUES ($1, $2, $3) RETURNING *`,
        [nome, email, mensagem]
      );
      res.status(201).json({ faq: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Lista mensagens do FAQ
  router.get("/", async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM tb_faq ORDER BY data_envio DESC LIMIT 50`
      );
      res.json({ faqs: result.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
