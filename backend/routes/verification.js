import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendEmail } from '../services/emailService.js';

dotenv.config();

// In-memory storage for verification codes (in production, use a database)
const verificationCodes = new Map();

const router = express.Router();

// Generate a 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email
router.post('/send-verification-email', async (req, res) => {
  try {
    const { email, nome } = req.body;

    if (!email || !nome) {
      return res.status(400).json({ success: false, message: 'Email e nome são obrigatórios' });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiration

    // Store the verification code
    verificationCodes.set(email, { code: verificationCode, expiresAt });

    // Send email using centralized service
    const result = await sendEmail({
      to: email,
      subject: 'Código de Verificação - AgroSmart',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #2e7d32;">Olá, ${nome}!</h2>
          <p>Para prosseguir com seu cadastro no <strong>AgroSmart</strong>, utilize o código de verificação abaixo:</p>
          <div style="background-color: #f1f8e9; color: #2e7d32; padding: 20px; text-align: center; margin: 25px 0; font-size: 32px; letter-spacing: 8px; font-weight: bold; border-radius: 4px;">
            ${verificationCode}
          </div>
          <p style="color: #666; font-size: 14px;">Este código é válido por 10 minutos. Caso não tenha solicitado, ignore este e-mail.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 12px; text-align: center;">Equipe AgroSmart - Tecnologia para o Campo</p>
        </div>
      `,
    });

    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'Código de verificação enviado com sucesso' 
      });
    } else {
      // Return a 500 but still with a nice message for the user
      res.status(500).json({ 
        success: false, 
        message: 'Ocorreu uma falha ao enviar o e-mail. Por favor, tente novamente mais tarde.' ,
        error: result.error // helps the developer see what's wrong (e.g., EAUTH)
      });
    }
  } catch (error) {
    console.error('Erro na rota de verificação:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno no servidor de verificação' 
    });
  }
});

// Verify code
router.post('/verify-code', (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email e código são obrigatórios' });
    }

    const storedData = verificationCodes.get(email);
    const currentTime = Date.now();

    if (!storedData) {
      return res.status(400).json({ success: false, message: 'Código inválido ou expirado' });
    }

    if (storedData.expiresAt < currentTime) {
      verificationCodes.delete(email);
      return res.status(400).json({ success: false, message: 'Código expirado' });
    }

    if (storedData.code !== code) {
      return res.status(400).json({ success: false, message: 'Código inválido' });
    }

    // If we get here, the code is valid
    verificationCodes.delete(email);
    
    // Generate a JWT token for the verification
    const token = jwt.sign(
      { email, verified: true },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Email verificado com sucesso',
      token
    });
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao verificar código' 
    });
  }
});

export default (pool) => {
  return router;
};
