import { Router } from "express";
import bcrypt from "bcrypt";

export default function createLoginRoutes(pool) {
  const router = Router();

  // Login
    router.post("/", async (req, res) => {
      const { email, senha } = req.body;
      try {
        const result = await pool.query(
          "SELECT * FROM tb_usuario WHERE email = $1",
          [email]
        );
        if (result.rows.length === 0) {
          const adminResult = await pool.query(
            "SELECT * FROM tb_admin WHERE email = $1",
            [email]
          );
          if (adminResult.rows.length === 0) {
            return res
              .status(401)
              .json({ success: false, message: "Credenciais inválidas" });
          }
          const admin = adminResult.rows[0];
          // const senhaCorreta = await bcrypt.compare(senha, admin.senha);
          const senhaCorreta = senha === admin.senha;
          if (!senhaCorreta) {
            return res
              .status(401)
              .json({ success: false, message: "Credenciais inválidas" });
          }
          return res.json({ success: true, usuario: admin, tipo_usuario: "admin" });
        }
        const usuario = result.rows[0];
        // Compara senha digitada com hash do banco
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
          return res
            .status(401)
            .json({ success: false, message: "Credenciais inválidas" });
        }
        res.json({ success: true, usuario, tipo_usuario: "usuario" });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

  // Login Admin
  // DESATIVADO POIS AGORA O LOGIN DE ADMIN E USUARIO E FEITO NA MESMA ROTA - ASS. Rubens

  // router.post("/admin", async (req, res) => {
  //   const { nome, senha } = req.body;
  //   try {
  //     const result = await pool.query(
  //       "SELECT * FROM tb_admin WHERE nome = $1 AND senha = $2",
  //       [nome, senha]
  //     );
  //     if (result.rows.length > 0) {
  //       res.json({ success: true, admin: result.rows[0] });
  //     } else {
  //       res
  //         .status(401)
  //         .json({ success: false, message: "Credenciais de admin inválidas" });
  //     }
  //   } catch (error) {
  //     res.status(500).json({ success: false, error: error.message });
  //   }
  // });

  return router;
}
