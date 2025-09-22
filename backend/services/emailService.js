import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465', // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Envia um e-mail com o código de verificação
 * @param {string} to - Endereço de e-mail do destinatário
 * @param {string} code - Código de verificação
 * @returns {Promise<Object>} Resultado do envio
 */
export const sendVerificationEmail = async (to, code) => {
  try {
    const mailOptions = {
      from: `"AgroSmart" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject: 'Seu Código de Verificação - AgroSmart',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verificação de E-mail</h2>
          <p>Olá,</p>
          <p>Seu código de verificação para o AgroSmart é:</p>
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; text-align: center; font-size: 24px; letter-spacing: 5px;">
            <strong>${code}</strong>
          </div>
          <p>Este código expirará em 5 minutos.</p>
          <p>Se você não solicitou este código, por favor, ignore este e-mail.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Esta é uma mensagem automática, por favor não responda este e-mail.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erro ao enviar e-mail de verificação:', error);
    throw new Error('Falha ao enviar e-mail de verificação');
  }
};

/**
 * Envia um código de verificação por e-mail
 * @param {string} email - Endereço de e-mail do destinatário
 * @param {string} code - Código de verificação
 * @returns {Promise<Object>} Resultado do envio
 */
export const send2FACodeEmail = async (email, code) => {
  return sendVerificationEmail(email, code);
};
