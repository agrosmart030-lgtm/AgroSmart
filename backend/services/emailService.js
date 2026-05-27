import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

function createTransporter() {
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = toBoolean(process.env.SMTP_SECURE, port === 465);
  const requireTls = toBoolean(process.env.SMTP_REQUIRE_TLS, !secure);
  const timeout = Number(process.env.EMAIL_TIMEOUT_MS || 30000);
  const emailPassword = process.env.EMAIL_PASSWORD?.replace(/\s+/g, "");

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure,
    requireTLS: requireTls,
    auth: {
      user: process.env.EMAIL_USER,
      pass: emailPassword,
    },
    connectionTimeout: timeout,
    greetingTimeout: timeout,
    socketTimeout: timeout,
    tls: {
      minVersion: "TLSv1.2",
    },
  });
}

export const sendEmail = async ({ to, subject, html, text, attachments }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("Configuracao de e-mail ausente.");
    }

    const info = await createTransporter().sendMail({
      from: `"AgroSmart" <${process.env.EMAIL_USER}>`,
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
