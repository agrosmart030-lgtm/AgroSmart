import { Router } from "express";
import bcrypt from "bcrypt";
import { isValidCPF, isValidCNPJ } from "../utils/validators.js";
import { verifyCaptchaIfEnabled } from "../utils/captcha.js";

export default function createRegistroRoutes(pool) {
  const router = Router();

  router.post("/", verifyCaptchaIfEnabled, async (req, res) => {
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

    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedTipo = String(tipo_usuario || "").trim().toLowerCase();

    if (!nome_completo || !normalizedEmail || !senha || !estado || !normalizedTipo) {
      return res.status(400).json({
        success: false,
        message: "Nome, e-mail, senha, estado e tipo de usuario sao obrigatorios.",
      });
    }

    if (!["agricultor", "empresario", "cooperativa"].includes(normalizedTipo)) {
      return res.status(400).json({
        success: false,
        message: "Tipo de usuario invalido.",
      });
    }

    if (["agricultor", "empresario"].includes(normalizedTipo) && cpf && !isValidCPF(cpf)) {
      return res.status(400).json({ success: false, message: "CPF invalido" });
    }

    if (["empresario", "cooperativa"].includes(normalizedTipo) && cnpj && !isValidCNPJ(cnpj)) {
      return res.status(400).json({ success: false, message: "CNPJ invalido" });
    }

    let client;

    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const cleanCPF = cpf ? cpf.replace(/\D/g, "") : undefined;
      const cleanCNPJ = cnpj ? cnpj.replace(/\D/g, "") : undefined;

      const existe = await client.query(
        "SELECT 1 FROM tb_usuario WHERE email = $1",
        [normalizedEmail],
      );

      if (existe.rows.length > 0) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ success: false, message: "E-mail ja cadastrado" });
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      const usuarioResult = await client.query(
        `INSERT INTO tb_usuario (nome_completo, email, senha, cidade, estado, tipo_usuario, codigo_ibge)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          nome_completo,
          normalizedEmail,
          senhaHash,
          cidade,
          estado,
          normalizedTipo,
          codigo_ibge,
        ],
      );
      const usuario = usuarioResult.rows[0];

      if (normalizedTipo === "agricultor") {
        await client.query(
          `INSERT INTO tb_agricultor (usuario_id, cpf, nome_propriedade, area_cultivada)
           VALUES ($1, $2, $3, $4)`,
          [usuario.id, cleanCPF, nomePropriedade, areaCultivada],
        );

        await insertGraosDoUsuario(client, usuario.id, graos, "cultiva");
      } else if (normalizedTipo === "empresario") {
        await client.query(
          `INSERT INTO tb_empresario (usuario_id, cpf, nome_empresa, cnpj)
           VALUES ($1, $2, $3, $4)`,
          [usuario.id, cleanCPF, nomeComercio, cleanCNPJ],
        );

        await insertGraosDoUsuario(client, usuario.id, graos, "interesse");
      } else if (normalizedTipo === "cooperativa") {
        await client.query(
          `INSERT INTO tb_cooperativa (usuario_id, nome_cooperativa, cnpj, regiao_atuacao)
           VALUES ($1, $2, $3, $4)`,
          [usuario.id, nomeCooperativa, cleanCNPJ, areaAtuacao],
        );
      }

      await client.query("COMMIT");
      delete usuario.senha;

      return res.status(201).json({ success: true, usuario });
    } catch (error) {
      await client?.query("ROLLBACK").catch(() => {});
      console.error("Erro detalhado no cadastro:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno ao realizar cadastro.",
        ...(process.env.NODE_ENV !== "production" ? { error: error.message } : {}),
      });
    } finally {
      client?.release();
    }
  });

  return router;
}

async function insertGraosDoUsuario(client, usuarioId, graos, tipoRelacao) {
  if (!graos) return;

  const graosArr = Array.isArray(graos) ? graos : String(graos).split(",");

  for (const grao of graosArr) {
    const nomeGrao = String(grao || "").trim();
    if (!nomeGrao) continue;

    await client.query(
      `INSERT INTO tb_usuario_grao (usuario_id, grao_id, tipo_relacao)
       VALUES ($1, (SELECT id FROM tb_grao WHERE nome = $2 LIMIT 1), $3)`,
      [usuarioId, nomeGrao, tipoRelacao],
    );
  }
}
