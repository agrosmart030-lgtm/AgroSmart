import { Router } from "express";
import bcrypt from "bcrypt";
import { sendVerificationCode } from "../utils/emailService.js";

export default function createRegistroRoutes(supabase) {
  const router = Router();

  // Armazena códigos de verificação em memória (temporário)
  const verificationCodes = new Map();

  // 🔹 Enviar código por e-mail
  router.post("/send-code", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "E-mail é obrigatório" });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min
    verificationCodes.set(email, { code, expiresAt });

    try {
      console.log(`[registro] Código gerado para ${email}: ${code}`);
      const info = await sendVerificationCode(email, code);
      return res.json({ success: true, message: "Código enviado", info });
    } catch (err) {
      console.error("[registro] Erro ao enviar e-mail:", err);
      verificationCodes.delete(email);
      return res.status(500).json({ success: false, message: "Erro ao enviar e-mail", error: err.message });
    }
  });

  // 🔹 Verificar código
  router.post("/verify-code", (req, res) => {
    const { email, code } = req.body;
    const record = verificationCodes.get(email);

    if (!record) return res.status(400).json({ success: false, message: "Nenhum código encontrado" });
    if (record.expiresAt < Date.now()) {
      verificationCodes.delete(email);
      return res.status(400).json({ success: false, message: "Código expirado" });
    }
    if (record.code !== String(code)) {
      return res.status(400).json({ success: false, message: "Código inválido" });
    }

    verificationCodes.delete(email);
    return res.json({ success: true, message: "E-mail verificado" });
  });

  // 🔹 Registrar novo usuário
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
      const record = verificationCodes.get(email);
      if (record) {
        if (record.code !== String(_verification_code))
          return res.status(400).json({ success: false, message: "E-mail não verificado corretamente" });
        if (record.expiresAt < Date.now()) {
          verificationCodes.delete(email);
          return res.status(400).json({ success: false, message: "Código expirado" });
        }
        verificationCodes.delete(email);
      }

      // Limpa máscaras
      const cleanCPF = cpf ? cpf.replace(/\D/g, "") : null;
      const cleanCNPJ = cnpj ? cnpj.replace(/\D/g, "") : null;

      // Verifica se já existe e-mail
      const { data: jaExiste, error: erroExiste } = await supabase
        .from("tb_usuario")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (erroExiste) throw erroExiste;
      if (jaExiste) return res.status(400).json({ success: false, message: "E-mail já cadastrado" });

      // Criptografa senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // Insere usuário principal
      const { data: usuario, error: erroUsuario } = await supabase
        .from("tb_usuario")
        .insert([
          {
            nome_completo,
            email,
            senha: senhaHash,
            cidade,
            estado,
            tipo_usuario,
            codigo_ibge,
          },
        ])
        .select()
        .single();

      if (erroUsuario) throw erroUsuario;

      // Cadastro por tipo
      if (tipo_usuario === "agricultor") {
        await supabase.from("tb_agricultor").insert([
          {
            usuario_id: usuario.id,
            cpf: cleanCPF,
            nome_propriedade: nomePropriedade,
            area_cultivada: areaCultivada,
          },
        ]);

        if (graos) {
          const graosArr = Array.isArray(graos) ? graos : graos.split(",");
          for (const grao of graosArr) {
            await supabase.from("tb_usuario_grao").insert([
              {
                usuario_id: usuario.id,
                grao_id: (
                  await supabase.from("tb_grao").select("id").eq("nome", grao.trim()).limit(1).single()
                ).data.id,
                tipo_relacao: "cultiva",
              },
            ]);
          }
        }
      } else if (tipo_usuario === "empresario") {
        await supabase.from("tb_empresario").insert([
          {
            usuario_id: usuario.id,
            cpf: cleanCPF,
            nome_empresa: nomeComercio,
            cnpj: cleanCNPJ,
          },
        ]);

        if (graos) {
          const graosArr = Array.isArray(graos) ? graos : graos.split(",");
          for (const grao of graosArr) {
            await supabase.from("tb_usuario_grao").insert([
              {
                usuario_id: usuario.id,
                grao_id: (
                  await supabase.from("tb_grao").select("id").eq("nome", grao.trim()).limit(1).single()
                ).data.id,
                tipo_relacao: "interesse",
              },
            ]);
          }
        }
      } else if (tipo_usuario === "cooperativa") {
        await supabase.from("tb_cooperativa").insert([
          {
            usuario_id: usuario.id,
            nome_cooperativa: nomeCooperativa,
            cnpj: cleanCNPJ,
            regiao_atuacao: areaAtuacao,
          },
        ]);
      }

      return res.status(201).json({ success: true, usuario });
    } catch (error) {
      console.error("Erro detalhado no cadastro Supabase:", error);
      return res.status(500).json({ success: false, error: error.message || String(error) });
    }
  });

  return router;
}
