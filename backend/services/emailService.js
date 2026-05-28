import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

const toNumber = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const redactSecrets = (value) => {
  let message = String(value || "");
  const secrets = [process.env.EMAIL_PASSWORD].filter(Boolean);

  for (const secret of secrets) {
    message = message.replace(new RegExp(escapeRegExp(secret), "g"), "[redacted]");
  }

  return message;
};

function getEmailConfig() {
  const host = process.env.SMTP_HOST || "smtp.sendgrid.net";
  const port = toNumber(process.env.SMTP_PORT || "2525", 2525);
  const secure = toBoolean(process.env.SMTP_SECURE, false);
  const requireTLS = toBoolean(process.env.SMTP_REQUIRE_TLS, true);
  const configuredFamily = toNumber(process.env.SMTP_FAMILY || "4", 4);
  const family = [4, 6].includes(configuredFamily) ? configuredFamily : 4;
  const timeout = toNumber(process.env.EMAIL_TIMEOUT_MS || "30000", 30000);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD?.trim();

  return {
    host,
    port,
    secure,
    requireTLS,
    family,
    timeout,
    user,
    pass,
  };
}

function getEmailDiagnostics(config) {
  return {
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
    family: config.family,
  };
}

function createTransporter() {
  const config = getEmailConfig();

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
    family: config.family,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    connectionTimeout: config.timeout,
    greetingTimeout: config.timeout,
    socketTimeout: config.timeout,
    tls: {
      minVersion: "TLSv1.2",
      servername: config.host,
    },
  });
}

export const sendEmail = async ({ to, subject, html, text, attachments }) => {
  const config = getEmailConfig();
  const diagnostics = getEmailDiagnostics(config);

  try {
    if (!config.user || !config.pass) {
      throw new Error("Configuracao de e-mail ausente.");
    }
    const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    const info = await createTransporter().sendMail({
      from,
      to,
      subject,
      html,
      text,
      attachments,
    });

    console.log("Email enviado com sucesso:", {
      messageId: info.messageId,
      ...diagnostics,
    });
    return { success: true, info };
  } catch (error) {
    const safeError = {
      message: redactSecrets(error.message),
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      ...diagnostics,
    };

    console.error("Erro ao enviar email:", safeError);
    return {
      success: false,
      error: safeError.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
    };
  }
};

export default { sendEmail };
