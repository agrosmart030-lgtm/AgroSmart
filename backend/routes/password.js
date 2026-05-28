import { Router } from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendEmail } from '../services/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Armazenamento em memória dos códigos de recuperação
const resetCodes = new Map();

export default function createPasswordRoutes(pool) {
  const router = Router();

  // POST /api/forgot-password — envia código por email
  router.post('/', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'E-mail é obrigatório' });
      }

      // Verifica se email existe no banco
      const result = await pool.query('SELECT * FROM tb_usuario WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        // Segurança: não revelar se email existe ou não
        return res.json({ success: true, message: 'Se este e-mail estiver cadastrado, você receberá o código.' });
      }
      const usuario = result.rows[0];

      // Gera código de 6 dígitos e armazena com TTL de 15min
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      resetCodes.set(email, { code, expiresAt: Date.now() + 15 * 60 * 1000 });

      // Envia email HTML estilizado
      const emailResult = await sendEmail({
        to: email,
        subject: '🔑 Redefinição de Senha - AgroSmart',
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
                  <h2 style="margin:0 0 8px;color:#012d1d;font-size:22px;font-weight:700;">Olá, ${usuario.nome_completo}! 👋</h2>
                  <p style="margin:0 0 24px;color:#717973;font-size:15px;line-height:1.6;">Recebemos uma solicitação para redefinir a senha da sua conta AgroSmart. Use o código abaixo para criar uma nova senha:</p>

                  <!-- CODE BOX -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                    <tr><td align="center">
                      <div style="display:inline-block;background:linear-gradient(135deg,#e8f5e9,#f1f8f4);border:2px solid #1B4332;border-radius:16px;padding:28px 48px;">
                        <p style="margin:0 0 8px;color:#717973;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:2px;">Código de Redefinição</p>
                        <p style="margin:0;color:#012d1d;font-size:42px;font-weight:900;letter-spacing:16px;font-family:'Courier New',monospace;">${code}</p>
                      </div>
                    </td></tr>
                  </table>

                  <!-- INFO BOXES -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                    <tr>
                      <td width="48%" style="background:#fff8e1;border-radius:10px;padding:14px 16px;vertical-align:top;">
                        <p style="margin:0;font-size:13px;color:#513700;">⏱ <strong>Expira em 15 minutos</strong><br><span style="color:#717973;">Solicite novo código após esse tempo</span></p>
                      </td>
                      <td width="4%"></td>
                      <td width="48%" style="background:#fce4ec;border-radius:10px;padding:14px 16px;vertical-align:top;">
                        <p style="margin:0;font-size:13px;color:#880e4f;">🚫 <strong>Não compartilhe</strong><br><span style="color:#717973;">Nunca envie este código a ninguém</span></p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0;color:#b0b5b2;font-size:13px;line-height:1.6;">Se você não solicitou a redefinição de senha, ignore este e-mail. Sua senha permanece a mesma e sua conta está segura.</p>
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
      });

      if (!emailResult.success) {
        resetCodes.delete(email);
        return res.status(500).json({
          success: false,
          message: 'Erro ao enviar e-mail. Tente novamente.',
          error: emailResult.error || emailResult.code || 'EMAIL_SEND_FAILED',
        });
      }

      res.json({ success: true, message: 'Código enviado com sucesso!' });
    } catch (error) {
      resetCodes.delete(req.body?.email);
      console.error('Erro ao enviar e-mail de recuperação:', error.message || error);
      res.status(500).json({ success: false, message: 'Erro ao enviar e-mail. Tente novamente.' });
    }
  });

  return router;
}

export function createResetPasswordRoute(pool) {
  const router = Router();

  // POST /api/reset-password — verifica código e atualiza senha
  router.post('/', async (req, res) => {
    try {
      const { email, code, novaSenha } = req.body;

      if (!email || !code || !novaSenha) {
        return res.status(400).json({ success: false, message: 'E-mail, código e nova senha são obrigatórios' });
      }

      const stored = resetCodes.get(email);
      if (!stored) {
        return res.status(400).json({ success: false, message: 'Código inválido ou expirado. Solicite um novo.' });
      }
      if (stored.expiresAt < Date.now()) {
        resetCodes.delete(email);
        return res.status(400).json({ success: false, message: 'Código expirado. Solicite um novo.' });
      }
      if (stored.code !== code) {
        return res.status(400).json({ success: false, message: 'Código incorreto. Verifique e tente novamente.' });
      }

      // Verifica se usuário existe
      const result = await pool.query('SELECT id FROM tb_usuario WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
      }

      // Aplica bcrypt e atualiza senha
      const senhaHash = await bcrypt.hash(novaSenha, 10);
      await pool.query('UPDATE tb_usuario SET senha = $1 WHERE email = $2', [senhaHash, email]);

      resetCodes.delete(email);
      res.json({ success: true, message: 'Senha redefinida com sucesso!' });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      res.status(500).json({ success: false, message: 'Erro interno ao redefinir senha.' });
    }
  });

  return router;
}
