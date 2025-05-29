import { Router } from "express";

const router = Router();

// Rota para buscar todos os usuários com detalhes específicos
router.get("/usuarios", async (req, res) => {
  try {
    const pool = req.app.get("pool");
    // Busca todos os usuários
    const usuariosResult = await pool.query("SELECT * FROM tb_usuario");
    const usuarios = usuariosResult.rows;

    // Busca detalhes de cada tipo
    const [agricultores, empresarios, cooperativas] = await Promise.all([
      pool.query("SELECT * FROM tb_agricultor"),
      pool.query("SELECT * FROM tb_empresario"),
      pool.query("SELECT * FROM tb_cooperativa"),
    ]);

    // Indexar detalhes por usuario_id
    const mapDetalhes = (arr) => {
      const map = {};
      arr.rows.forEach((item) => {
        map[item.usuario_id] = item;
      });
      return map;
    };
    const detalhesAgricultor = mapDetalhes(agricultores);
    const detalhesEmpresario = mapDetalhes(empresarios);
    const detalhesCooperativa = mapDetalhes(cooperativas);

    // Montar lista final
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
    res
      .status(500)
      .json({ error: "Erro ao buscar usuários", details: err.message });
  }
});

// Atualizar status do usuário
router.patch("/usuarios/:id/status", async (req, res) => {
  try {
    const pool = req.app.get("pool");
    const { id } = req.params;
    const { status } = req.body;
    if (!["ativo", "inativo"].includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }
    await pool.query("UPDATE tb_usuario SET status = $1 WHERE id = $2", [
      status,
      id,
    ]);
    res.json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar status", details: err.message });
  }
});

export default router;
