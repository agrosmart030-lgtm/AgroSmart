import { Router } from "express";
import bcrypt from "bcrypt";
import { sendVerificationCode } from "../utils/emailService.js";

export default function createRegistroRoutes(pool) {
  const router = Router();

  // In-memory store para códigos de verificação: email => { code, expiresAt }
  const verificationCodes = new Map();

  // Gera e envia código para o e-mail fornecido
  router.post("/send-code", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "E-mail é obrigatório" });
    const code = String(Math.floor(100000 + Math.random() * 900000)); // 6 dígitos
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos
    verificationCodes.set(email, { code, expiresAt });
    try {
      console.log('[registro] Gerado código para', email, 'code=', code, 'expiraEm=', new Date(expiresAt).toISOString());
      const info = await sendVerificationCode(email, code);
      console.log('[registro] sendVerificationCode retornou:', info);
      return res.json({ success: true, message: "Código enviado", info });
    } catch (err) {
      console.error('[registro] Erro ao enviar código para', email, err);
      verificationCodes.delete(email);
      return res.status(500).json({ success: false, message: "Falha ao enviar código", error: err.message || String(err) });
    }
  });

  // Verifica código
  router.post("/verify-code", (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ success: false, message: "E-mail e código são obrigatórios" });
    const record = verificationCodes.get(email);
    console.log('[registro] verify-code called for', email, 'providedCode=', code, 'record=', record);
    if (!record) {
      console.warn('[registro] Nenhum código encontrado para este e-mail', email);
      return res.status(400).json({ success: false, message: "Nenhum código encontrado para este e-mail" });
    }
    if (record.expiresAt < Date.now()) {
      verificationCodes.delete(email);
      console.warn('[registro] Código expirado para', email);
      return res.status(400).json({ success: false, message: "Código expirado" });
    }
    if (record.code !== String(code)) {
      console.warn('[registro] Código inválido para', email, 'esperado=', record.code, 'fornecido=', code);
      return res.status(400).json({ success: false, message: "Código inválido" });
    }
    // sucesso: marque como verificado (remoção indica uso único)
    verificationCodes.delete(email);
    console.log('[registro] Código verificado com sucesso para', email);
    return res.json({ success: true, message: "E-mail verificado" });
  });

  // Registro de novo usuário (agora exige que o front envie o código para verificação prévia)
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
      _verification_code,
    } = req.body;
    try {
      // Validar que o código foi verificado anteriormente. Para simplicidade aceitamos o código enviado no corpo
      // ou podemos ter aceitado a verificação via /verify-code que removeu o registro do Map. Aqui verificamos se o código
      // que veio corresponde ao registro ainda presente (uma segunda verificação) OU se o Map não tem registro (já verificado).
      const record = verificationCodes.get(email);
      console.log('[registro] no registro, verificando código interno para', email, 'record=', record, '_verification_code=', _verification_code);
      if (record) {
        if (record.code !== String(_verification_code)) {
          console.warn('[registro] registro: código inválido durante registro para', email, 'esperado=', record.code, 'fornecido=', _verification_code);
          return res.status(400).json({ success: false, message: "E-mail não verificado. Use /send-code e /verify-code." });
        }
        if (record.expiresAt < Date.now()) {
          verificationCodes.delete(email);
          console.warn('[registro] registro: código expirado durante registro para', email);
          return res.status(400).json({ success: false, message: "Código expirou. Solicite um novo código." });
        }
        // use-once
        verificationCodes.delete(email);
      }

      // Remove máscara de CPF e CNPJ
      const cleanCPF = cpf ? cpf.replace(/\D/g, "") : undefined;
      const cleanCNPJ = cnpj ? cnpj.replace(/\D/g, "") : undefined;

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
          [usuario.id, cleanCPF, nomePropriedade, areaCultivada]
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
          [usuario.id, cleanCPF, nomeComercio, cleanCNPJ]
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
          [usuario.id, nomeCooperativa, cleanCNPJ, areaAtuacao]
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
