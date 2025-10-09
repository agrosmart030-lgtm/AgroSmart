import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "user@example.com",
    pass: process.env.SMTP_PASS || "password",
  },
});


export async function sendVerificationCode(email, code) {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'no-reply@agrosmart.local',
    to: email,
    subject: 'Seu código de verificação AgroSmart',
    text: `Seu código de verificação é: ${code}. Ele expira em 10 minutos.`,
  };

  console.log('[emailService] Iniciando envio de código de verificação...');
  console.log('[emailService] Dados do email:', {
    to: email,
    code,
    mailOptions,
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM,
    }
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[emailService] Email enviado com sucesso:', info);
    return info;
  } catch (err) {
    console.error('[emailService] Falha ao enviar email de verificação:', err);
    throw err;
  }
}

export default transporter;
