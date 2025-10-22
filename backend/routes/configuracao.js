import { Router } from "express";

export default function createConfiguracaoRoutes() {
  const router = Router();

  // GET /api/configuracao/:usuario_id
  router.get("/:usuario_id", async (req, res) => {
    const { usuario_id } = req.params;
    const supabase = req.app.get("supabase"); // Obtém o cliente Supabase configurado

    try {
      // Busca dados básicos do usuário
      const { data: usuario, error: errorUsuario } = await supabase
        .from("tb_usuario")
        .select("*")
        .eq("id", usuario_id)
        .single();

      if (errorUsuario) {
        if (errorUsuario.code === "PGRST116") {
          // código de "No rows found"
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
        throw errorUsuario;
      }

      // Busca dados específicos conforme o tipo
      let dadosEspecificos = {};

      if (usuario.tipo_usuario === "agricultor") {
        const { data, error } = await supabase
          .from("tb_agricultor")
          .select("cpf, nome_propriedade, area_cultivada")
          .eq("usuario_id", usuario_id)
          .single();

        if (error && error.code !== "PGRST116") throw error;
        if (data) dadosEspecificos = data;
      } else if (usuario.tipo_usuario === "empresario") {
        const { data, error } = await supabase
          .from("tb_empresario")
          .select("cpf, nome_empresa, cnpj")
          .eq("usuario_id", usuario_id)
          .single();

        if (error && error.code !== "PGRST116") throw error;
        if (data) dadosEspecificos = data;
      } else if (usuario.tipo_usuario === "cooperativa") {
        const { data, error } = await supabase
          .from("tb_cooperativa")
          .select("nome_cooperativa, cnpj, numero_associados")
          .eq("usuario_id", usuario_id)
          .single();

        if (error && error.code !== "PGRST116") throw error;
        if (data) dadosEspecificos = data;
      }

      // Junta tudo num objeto só
      res.json({ ...usuario, ...dadosEspecificos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}