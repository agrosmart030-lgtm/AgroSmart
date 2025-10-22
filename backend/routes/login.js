import { Router } from "express";
import bcrypt from "bcrypt";

export default function createLoginRoutes() {
  const router = Router();

  // Login
  router.post("/", async (req, res) => {
    const supabase = req.app.get("supabase"); // Obtém o cliente Supabase configurado
    const { email, senha } = req.body;

    try {
      // Busca o usuário pelo e-mail
      const { data: usuario, error: errorUsuario } = await supabase
        .from("tb_usuario")
        .select("*")
        .eq("email", email)
        .single();

      if (errorUsuario && errorUsuario.code === "PGRST116") {
        // Caso não encontre na tabela de usuários, busca na tabela de admins
        const { data: admin, error: errorAdmin } = await supabase
          .from("tb_admin")
          .select("*")
          .eq("email", email)
          .single();

        if (errorAdmin) {
          return res
            .status(401)
            .json({ success: false, message: "Credenciais inválidas" });
        }

        // Verifica a senha do admin
        const senhaCorreta = await bcrypt.compare(senha, admin.senha); // Senha criptografada
        if (!senhaCorreta) {
          return res
            .status(401)
            .json({ success: false, message: "Credenciais inválidas" });
        }

        return res.json({ success: true, usuario: admin, tipo_usuario: "admin" });
      }

      if (errorUsuario) {
        throw errorUsuario;
      }

      // Verifica a senha do usuário
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

  return router;
}