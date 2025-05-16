import { Router } from "express";

export default function createLoginRoutes(pool) {
  const router = Router();

  // Login
  router.post("/", async (req, res) => {
    const { email, senha } = req.body;
    try {
      const result = await pool.query(
        "SELECT * FROM tb_usuario WHERE email = $1 AND senha = $2",
        [email, senha]
      );
      if (result.rows.length > 0) {
        res.json({ success: true, usuario: result.rows[0] });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Credenciais inválidas" });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
}
