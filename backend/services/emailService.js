import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

function createTransporter() {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = toBoolean(process.env.SMTP_SECURE, port === 465);
  const requireTls = toBoolean(process.env.SMTP_REQUIRE_TLS, !secure);
  const timeout = Number(process.env.EMAIL_TIMEOUT_MS || 30000);
  const family = Number(process.env.SMTP_FAMILY || 4);
  const emailPassword = process.env.EMAIL_PASSWORD?.replace(/\s+/g, "");

  return nodemailer.createTransport({
    host: smtpHost,
    port,
    secure,
    requireTLS: requireTls,
    family: [4, 6].includes(family) ? family : 4,
    auth: {
      user: process.env.EMAIL_USER,
      pass: emailPassword,
    },
    connectionTimeout: timeout,
    greetingTimeout: timeout,
    socketTimeout: timeout,
    tls: {
      minVersion: "TLSv1.2",
      servername: smtpHost,
    },
  });
}

export const sendEmail = async ({ to, subject, html, text, attachments }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("Configuracao de e-mail ausente.");
    }
    const from = process.env.EMAIL_FROM || `"AgroSmart" <${process.env.EMAIL_USER}>`;

    const info = await createTransporter().sendMail({
      from,
      to,
      subject,
      html,
      text,
      attachments,
    });

    console.log("Email enviado com sucesso:", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error("ERRO DETALHADO NO ENVIO DE EMAIL:", error);
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};

export default { sendEmail };
