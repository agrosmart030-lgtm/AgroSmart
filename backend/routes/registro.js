import { Router } from "express";
import bcrypt from "bcrypt";

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
      cpf,
      nomePropriedade,
      areaCultivada,
      graos,
      nomeComercio,
      cnpj,
      nomeCooperativa,
      areaAtuacao,
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
      // Hash da senha antes de inserir
      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(senha, saltRounds);
      // Insere novo usuário com senha hash
      const usuarioResult = await pool.query(
        `INSERT INTO tb_usuario (nome_completo, email, senha, cidade, estado, tipo_usuario, codigo_ibge)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          nome_completo,
          email,
          senhaHash,
          cidade,
          estado,
          tipo_usuario,
          codigo_ibge,
        ]
      );
      const usuario = usuarioResult.rows[0];
      // Cadastro específico por tipo
      if (tipo_usuario === "agricultor") {
        await pool.query(
          `INSERT INTO tb_agricultor (usuario_id, cpf, nome_propriedade, area_cultivada)
            VALUES ($1, $2, $3, $4)`,
          [usuario.id, cpf, nomePropriedade, areaCultivada]
        );
        // Relacionamento com grãos (se houver)
        if (graos) {
          const graosArr = Array.isArray(graos) ? graos : graos.split(",");
          for (const grao of graosArr) {
            await pool.query(
              `INSERT INTO tb_usuario_grao (usuario_id, grao_id, tipo_relacao)
                VALUES ($1, (SELECT id FROM tb_grao WHERE nome = $2 LIMIT 1), 'cultiva')`,
              [usuario.id, grao.trim()]
            );
          }
        }
      } else if (tipo_usuario === "empresario") {
        await pool.query(
          `INSERT INTO tb_empresario (usuario_id, cpf, nome_empresa, cnpj)
            VALUES ($1, $2, $3, $4)`,
          [usuario.id, cpf, nomeComercio, cnpj]
        );
        if (graos) {
          const graosArr = Array.isArray(graos) ? graos : graos.split(",");
          for (const grao of graosArr) {
            await pool.query(
              `INSERT INTO tb_usuario_grao (usuario_id, grao_id, tipo_relacao)
                VALUES ($1, (SELECT id FROM tb_grao WHERE nome = $2 LIMIT 1), 'interesse')`,
              [usuario.id, grao.trim()]
            );
          }
        }
      } else if (tipo_usuario === "cooperativa") {
        await pool.query(
          `INSERT INTO tb_cooperativa (usuario_id, nome_cooperativa, cnpj, regiao_atuacao)
            VALUES ($1, $2, $3, $4)`,
          [usuario.id, nomeCooperativa, cnpj, areaAtuacao]
        );
      }
      res.status(201).json({ success: true, usuario });
    } catch (error) {
      console.error("Erro detalhado no cadastro:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
}
