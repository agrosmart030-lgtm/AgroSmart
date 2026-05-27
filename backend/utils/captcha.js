import axios from "axios";

const truthyValues = new Set(["1", "true", "yes", "on"]);

export function isCaptchaEnabled() {
  return truthyValues.has(String(process.env.CAPTCHA_ENABLED || "").toLowerCase());
}

export async function verifyRecaptchaToken(token, remoteIp) {
  if (!isCaptchaEnabled()) {
    return { success: true, skipped: true };
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) {
    return {
      success: false,
      status: 500,
      message: "reCAPTCHA habilitado, mas RECAPTCHA_SECRET_KEY nao foi configurado.",
    };
  }

  if (!token) {
    return {
      success: false,
      status: 400,
      message: "Token do reCAPTCHA nao informado.",
    };
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);
    if (remoteIp) params.append("remoteip", remoteIp);

    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 8000,
      },
    );

    if (!response.data?.success) {
      return {
        success: false,
        status: 400,
        message: "Falha na validacao do reCAPTCHA.",
        codes: response.data?.["error-codes"] || [],
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      status: 502,
      message: "Nao foi possivel validar o reCAPTCHA no momento.",
      error,
    };
  }
}

export async function verifyCaptchaIfEnabled(req, res, next) {
  const result = await verifyRecaptchaToken(
    req.body?.recaptchaToken || req.body?.captchaToken,
    req.ip,
  );

  if (result.success) {
    return next();
  }

  return res.status(result.status || 400).json({
    success: false,
    message: result.message,
    ...(process.env.NODE_ENV !== "production" && result.codes
      ? { recaptchaErrors: result.codes }
      : {}),
  });
}
