import express from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      from: `"AgroSmart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ Seu código de verificação - AgroSmart',
      attachments: [{
        filename: 'folha.svg',
        path: path.join(__dirname, '../../frontend/src/assets/folha.svg'),
        cid: 'logo_agrosmart'
      }],
      html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background-color:#f1f4f2;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f4f2;padding:40px 0;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

              <!-- HEADER -->
              <tr><td style="background:linear-gradient(135deg,#1B4332 0%,#012d1d 100%);border-radius:16px 16px 0 0;padding:40px 48px;text-align:center;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr><td align="center" style="padding-bottom:16px;">
                    <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:14px;padding:12px 18px;">
                      <img src="cid:logo_agrosmart" width="32" height="30" alt="🌱" style="display:block;border:none;outline:none;text-decoration:none;" />
                    </div>
                  </td></tr>
                  <tr><td align="center">
                    <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">AgroSmart</h1>
                    <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Plataforma Inteligente do Agronegócio</p>
                  </td></tr>
                </table>
              </td></tr>

              <!-- BODY -->
              <tr><td style="background:#ffffff;padding:48px;">
                <h2 style="margin:0 0 8px;color:#012d1d;font-size:22px;font-weight:700;">Olá, ${nome}! 👋</h2>
                <p style="margin:0 0 24px;color:#717973;font-size:15px;line-height:1.6;">Bem-vindo ao AgroSmart! Para concluir seu cadastro, insira o código de verificação abaixo:</p>

                <!-- CODE BOX -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                  <tr><td align="center">
                    <div style="display:inline-block;background:linear-gradient(135deg,#e8f5e9,#f1f8f4);border:2px solid #1B4332;border-radius:16px;padding:28px 48px;">
                      <p style="margin:0 0 8px;color:#717973;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:2px;">Código de Verificação</p>
                      <p style="margin:0;color:#012d1d;font-size:42px;font-weight:900;letter-spacing:16px;font-family:'Courier New',monospace;">${verificationCode}</p>
                    </div>
                  </td></tr>
                </table>

                <!-- INFO BOXES -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                  <tr>
                    <td width="48%" style="background:#fff8e1;border-radius:10px;padding:14px 16px;vertical-align:top;">
                      <p style="margin:0;font-size:13px;color:#513700;">⏱ <strong>Expira em 10 minutos</strong><br><span style="color:#717973;">Solicite novo código após esse tempo</span></p>
                    </td>
                    <td width="4%"></td>
                    <td width="48%" style="background:#e8f5e9;border-radius:10px;padding:14px 16px;vertical-align:top;">
                      <p style="margin:0;font-size:13px;color:#1B4332;">🔒 <strong>Uso único</strong><br><span style="color:#717973;">Este código só funciona uma vez</span></p>
                    </td>
                  </tr>
                </table>

                <p style="margin:0;color:#b0b5b2;font-size:13px;line-height:1.6;">Se você não solicitou este código, ignore este e-mail. Sua conta permanece segura.</p>
              </td></tr>

              <!-- FOOTER -->
              <tr><td style="background:#f8f9fa;border-radius:0 0 16px 16px;padding:24px 48px;border-top:1px solid #e1e3e4;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color:#b0b5b2;font-size:12px;">
                      <strong style="color:#717973;">AgroSmart</strong> &bull; Plataforma do Agronegócio<br>
                      Este é um e-mail automático, não responda.
                    </td>
                    <td align="right" style="color:#b0b5b2;font-size:12px;">&copy; 2025 AgroSmart</td>
                  </tr>
                </table>
              </td></tr>

            </table>
          </td></tr>
        </table>
      </body>
      </html>
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
  router.post('/forgot-password', async (req, res) => {

    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'E-mail é obrigatório' });
      }

      // Verifica se o email existe no banco
      const result = await pool.query('SELECT * FROM tb_usuario WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        // Responde sucesso mesmo assim (segurança: não revelar se email existe)
        return res.json({ success: true, message: 'Se este e-mail estiver cadastrado, você receberá o código.' });
      }
      const usuario = result.rows[0];

      // Gera código de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos
      verificationCodes.set(email, { code, expiresAt });

      // Envia email
      const mailOptions = {
        from: `"AgroSmart" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Redefinição de Senha - AgroSmart',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 32px; border-radius: 12px;">
            <div style="background: #1B4332; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
              <h1 style="color: white; margin: 0; font-size: 24px;">AgroSmart</h1>
            </div>
            <h2 style="color: #012d1d;">Olá, ${usuario.nome_completo}!</h2>
            <p style="color: #414844;">Recebemos uma solicitação para redefinir a senha da sua conta AgroSmart.</p>
            <p style="color: #414844;">Use o código abaixo para criar uma nova senha:</p>
            <div style="background: #e8f5e9; border: 2px solid #1B4332; padding: 20px; text-align: center; margin: 24px 0; border-radius: 8px;">
              <span style="font-size: 36px; letter-spacing: 12px; font-weight: bold; color: #012d1d;">${code}</span>
            </div>
            <p style="color: #717973; font-size: 13px;">⏱ Este código expira em <strong>15 minutos</strong>.</p>
            <p style="color: #717973; font-size: 13px;">Se você não solicitou isso, ignore este e-mail. Sua senha permanece a mesma.</p>
            <hr style="border: none; border-top: 1px solid #e1e3e4; margin: 24px 0;" />
            <p style="color: #b0b5b2; font-size: 12px; text-align: center;">© AgroSmart - Todos os direitos reservados</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: 'Código enviado com sucesso!' });
    } catch (error) {
      console.error('Erro ao enviar e-mail de recuperação:', error);
      res.status(500).json({ success: false, message: 'Erro ao enviar e-mail. Tente novamente.' });
    }
  });

  // Reset password - verifica código e atualiza senha
  router.post('/reset-password', async (req, res) => {
    try {
      const { email, code, novaSenha } = req.body;

      if (!email || !code || !novaSenha) {
        return res.status(400).json({ success: false, message: 'E-mail, código e nova senha são obrigatórios' });
      }

      const storedData = verificationCodes.get(email);
      if (!storedData) {
        return res.status(400).json({ success: false, message: 'Código inválido ou expirado. Solicite um novo.' });
      }
      if (storedData.expiresAt < Date.now()) {
        verificationCodes.delete(email);
        return res.status(400).json({ success: false, message: 'Código expirado. Solicite um novo.' });
      }
      if (storedData.code !== code) {
        return res.status(400).json({ success: false, message: 'Código incorreto.' });
      }

      // Valida se usuário existe
      const result = await pool.query('SELECT id FROM tb_usuario WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
      }

      // Hash da nova senha e atualização
      const senhaHash = await bcrypt.hash(novaSenha, 10);
      await pool.query('UPDATE tb_usuario SET senha = $1 WHERE email = $2', [senhaHash, email]);

      verificationCodes.delete(email);
      res.json({ success: true, message: 'Senha redefinida com sucesso!' });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      res.status(500).json({ success: false, message: 'Erro interno ao redefinir senha.' });
    }
  });

  return router;
};
