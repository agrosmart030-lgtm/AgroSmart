import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "../services/emailService.js";

dotenv.config();

const verificationCodes = new Map();
const router = express.Router();

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/send-verification-email", async (req, res) => {
  try {
    const { email, nome } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !nome) {
      return res.status(400).json({
        success: false,
        message: "Email e nome sao obrigatorios",
      });
    }

    const verificationCode = generateVerificationCode();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    const result = await sendEmail({
      to: normalizedEmail,
      subject: "Codigo de Verificacao - AgroSmart",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #2e7d32;">Ola, ${nome}!</h2>
          <p>Para prosseguir com seu cadastro no <strong>AgroSmart</strong>, utilize o codigo de verificacao abaixo:</p>
          <div style="background-color: #f1f8e9; color: #2e7d32; padding: 20px; text-align: center; margin: 25px 0; font-size: 32px; letter-spacing: 8px; font-weight: bold; border-radius: 4px;">
            ${verificationCode}
          </div>
          <p style="color: #666; font-size: 14px;">Este codigo e valido por 10 minutos. Caso nao tenha solicitado, ignore este e-mail.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 12px; text-align: center;">Equipe AgroSmart - Tecnologia para o Campo</p>
        </div>
      `,
    });

    if (result.success) {
      verificationCodes.set(normalizedEmail, { code: verificationCode, expiresAt });

      return res.status(200).json({
        success: true,
        message: "Codigo de verificacao enviado com sucesso",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Ocorreu uma falha ao enviar o e-mail. Por favor, tente novamente mais tarde.",
      error: result.error || result.code || "EMAIL_SEND_FAILED",
    });
  } catch (error) {
    console.error("Erro na rota de verificacao:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Erro interno no servidor de verificacao",
    });
  }
});

router.post("/verify-code", (req, res) => {
  try {
    const { email, code } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !code) {
      return res.status(400).json({
        success: false,
        message: "Email e codigo sao obrigatorios",
      });
    }

    const storedData = verificationCodes.get(normalizedEmail);
    const currentTime = Date.now();

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "Codigo invalido ou expirado",
      });
    }

    if (storedData.expiresAt < currentTime) {
      verificationCodes.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: "Codigo expirado",
      });
    }

    if (storedData.code !== code) {
      return res.status(400).json({
        success: false,
        message: "Codigo invalido",
      });
    }

    verificationCodes.delete(normalizedEmail);

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Configuracao de autenticacao indisponivel.",
      });
    }

    const payload = {
      success: true,
      message: "Email verificado com sucesso",
      token: jwt.sign(
        {
          email: normalizedEmail,
          verified: true,
          purpose: "email_verification",
        },
        process.env.JWT_SECRET,
        { expiresIn: "15m" },
      ),
    };

    return res.status(200).json(payload);
  } catch (error) {
    console.error("Erro ao verificar codigo:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Erro ao verificar codigo",
    });
  }
});

export default () => router;
