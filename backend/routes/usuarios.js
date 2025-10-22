import { Router } from "express";

const router = Router();

router.get("/usuarios", async (req, res) => {
  const supabase = req.app.get("supabase"); // Obtém o cliente Supabase configurado
  try {
    const { data: usuarios, error: errorUsuarios } = await supabase
      .from("tb_usuario")
      .select("*");

    if (errorUsuarios) throw errorUsuarios;

    const [agricultores, empresarios, cooperativas] = await Promise.all([
      supabase.from("tb_agricultor").select("*"),
      supabase.from("tb_empresario").select("*"),
      supabase.from("tb_cooperativa").select("*"),
    ]);

    const mapDetalhes = (dados) => {
      const map = {};
      (dados.data || []).forEach((item) => (map[item.usuario_id] = item));
      return map;
    };

    const detalhesAgricultor = mapDetalhes(agricultores);
    const detalhesEmpresario = mapDetalhes(empresarios);
    const detalhesCooperativa = mapDetalhes(cooperativas);

    const usuariosComDetalhes = usuarios.map((user) => {
      let detalhes = null;
      if (user.tipo_usuario === "agricultor") {
        detalhes = detalhesAgricultor[user.id] || null;
      } else if (user.tipo_usuario === "empresario") {
        detalhes = detalhesEmpresario[user.id] || null;
      } else if (user.tipo_usuario === "cooperativa") {
        detalhes = detalhesCooperativa[user.id] || null;
      }
      return { ...user, detalhes };
    });

    res.json(usuariosComDetalhes);
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar usuários",
      details: err.message,
    });
  }
});

router.patch("/usuarios/:id/status", async (req, res) => {
  const supabase = req.app.get("supabase"); // Obtém o cliente Supabase configurado
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["ativo", "inativo"].includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const { error } = await supabase
      .from("tb_usuario")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao atualizar status",
      details: err.message,
    });
  }
});

export default router;