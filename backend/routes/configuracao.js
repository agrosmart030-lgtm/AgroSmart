import { Router } from "express";

export default function createConfiguracaoRoutes(pool) {
  const router = Router();

  // GET /api/configuracao/:usuario_id
  router.get("/:usuario_id", async (req, res) => {
    const { usuario_id } = req.params;
    try {
      // Busca dados básicos do usuário
      const usuarioResult = await pool.query(
        "SELECT * FROM tb_usuario WHERE id = $1",
        [usuario_id]
      );
      if (usuarioResult.rows.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      const usuario = usuarioResult.rows[0];

      // Busca dados específicos conforme o tipo
      let dadosEspecificos = {};
      if (usuario.tipo_usuario === "agricultor") {
        const agri = await pool.query(
          "SELECT cpf, nome_propriedade, area_cultivada FROM tb_agricultor WHERE usuario_id = $1",
          [usuario_id]
        );
        if (agri.rows.length > 0) dadosEspecificos = agri.rows[0];
      } else if (usuario.tipo_usuario === "empresario") {
        const emp = await pool.query(
          "SELECT cpf, nome_empresa, cnpj FROM tb_empresario WHERE usuario_id = $1",
          [usuario_id]
        );
        if (emp.rows.length > 0) dadosEspecificos = emp.rows[0];
      } else if (usuario.tipo_usuario === "cooperativa") {
        const coop = await pool.query(
          "SELECT nome_cooperativa, cnpj, numero_associados FROM tb_cooperativa WHERE usuario_id = $1",
          [usuario_id]
        );
        if (coop.rows.length > 0) dadosEspecificos = coop.rows[0];
      }

      // Junta tudo num objeto só
      res.json({ ...usuario, ...dadosEspecificos });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
