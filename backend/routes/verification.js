import express from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// In-memory storage for verification codes (in production, use a database)
const verificationCodes = new Map();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Código de Verificação - AgroSmart',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Olá, ${nome}!</h2>
          <p>Seu código de verificação para o AgroSmart é:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${verificationCode}
          </div>
          <p>Este código expira em 10 minutos.</p>
          <p>Se você não solicitou este código, por favor, ignore este e-mail.</p>
          <p>Atenciosamente,<br>Equipe AgroSmart</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      success: true, 
      message: 'Código de verificação enviado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao enviar email de verificação:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao enviar código de verificação' 
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
