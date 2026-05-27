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

    if (!email || !nome) {
      return res.status(400).json({
        success: false,
        message: "Email e nome sao obrigatorios",
      });
    }

    const verificationCode = generateVerificationCode();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    verificationCodes.set(email, { code: verificationCode, expiresAt });

    const result = await sendEmail({
      to: email,
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
      return res.status(200).json({
        success: true,
        message: "Codigo de verificacao enviado com sucesso",
      });
    }

    verificationCodes.delete(email);
    return res.status(500).json({
      success: false,
      message:
        "Ocorreu uma falha ao enviar o e-mail. Por favor, tente novamente mais tarde.",
      error: result.error,
    });
  } catch (error) {
    console.error("Erro na rota de verificacao:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno no servidor de verificacao",
    });
  }
});

router.post("/verify-code", (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email e codigo sao obrigatorios",
      });
    }

    const storedData = verificationCodes.get(email);
    const currentTime = Date.now();

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "Codigo invalido ou expirado",
      });
    }

    if (storedData.expiresAt < currentTime) {
      verificationCodes.delete(email);
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

    verificationCodes.delete(email);

    const payload = {
      success: true,
      message: "Email verificado com sucesso",
    };

    if (process.env.JWT_SECRET) {
      payload.token = jwt.sign(
        { email, verified: true },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );
    }

    return res.status(200).json(payload);
  } catch (error) {
    console.error("Erro ao verificar codigo:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao verificar codigo",
    });
  }
});

export default () => router;
