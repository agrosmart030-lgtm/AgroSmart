import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyCaptchaIfEnabled } from "../utils/captcha.js";

async function compareStoredPassword(inputPassword, storedPassword) {
  if (!storedPassword) return false;
  if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
    return bcrypt.compare(inputPassword, storedPassword);
  }
  return inputPassword === storedPassword;
}

export default function createLoginRoutes(pool) {
  const router = Router();

  // Login
    router.post("/", verifyCaptchaIfEnabled, async (req, res) => {
      const { email, senha } = req.body;
      const normalizedEmail = String(email || "").trim().toLowerCase();

      if (!normalizedEmail || !senha) {
        return res.status(400).json({
          success: false,
          message: "E-mail e senha sao obrigatorios.",
        });
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({
          success: false,
          message: "Configuracao de autenticacao indisponivel.",
        });
      }

      try {
        const result = await pool.query(
          "SELECT * FROM tb_usuario WHERE email = $1",
          [normalizedEmail]
        );
        if (result.rows.length === 0) {
          const adminResult = await pool.query(
            "SELECT * FROM tb_admin WHERE email = $1",
            [normalizedEmail]
          );
          if (adminResult.rows.length === 0) {
            return res
              .status(401)
              .json({ success: false, message: "Credenciais inválidas" });
          }
          const admin = adminResult.rows[0];
          const senhaCorreta = await compareStoredPassword(senha, admin.senha);
          if (!senhaCorreta) {
            return res
              .status(401)
              .json({ success: false, message: "Credenciais inválidas" });
          }
          
          // Adiciona o tipo_usuario ao objeto do admin para o frontend
          admin.tipo_usuario = "admin";

          const token = jwt.sign(
            { id: admin.id, email: admin.email, tipo_usuario: "admin" },
            jwtSecret,
            { expiresIn: "24h" }
          );

          delete admin.senha; 
          return res.json({ success: true, usuario: admin, tipo_usuario: "admin", token });
        }
        const usuario = result.rows[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
          return res
            .status(401)
            .json({ success: false, message: "Credenciais inválidas" });
        }

        // Para usuários comuns, o tipo_usuario já vem do banco (agricultor, etc.)
        // Mas garantimos que ele exista ou definimos um padrão se necessário.

        const token = jwt.sign(
          { id: usuario.id, email: usuario.email, tipo_usuario: usuario.tipo_usuario },
          jwtSecret,
          { expiresIn: "24h" }
        );

        delete usuario.senha;
        usuario.nome = usuario.nome || usuario.nome_completo;
        res.json({ success: true, usuario, tipo_usuario: usuario.tipo_usuario, token });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Erro interno ao realizar login.",
          ...(process.env.NODE_ENV !== "production" ? { error: error.message } : {}),
        });
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
