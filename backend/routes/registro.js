import { Router } from "express";

export default function createRegistroRoutes(pool) {
  const router = Router();

  // Registro de novo usuário
  router.post("/", async (req, res) => {
    const {
      nome_completo,
      email,
      senha,
      cidade,
      estado,
      tipo_usuario,
      codigo_ibge,
    } = req.body;
    try {
      const existe = await pool.query(
        "SELECT 1 FROM tb_usuario WHERE email = $1",
        [email]
      );
      if (existe.rows.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "E-mail já cadastrado" });
      }
      // Insere novo usuário
      const result = await pool.query(
        `INSERT INTO tb_usuario (nome_completo, email, senha, cidade, estado, tipo_usuario, codigo_ibge)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [nome_completo, email, senha, cidade, estado, tipo_usuario, codigo_ibge]
      );
      res.status(201).json({ success: true, usuario: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
}
