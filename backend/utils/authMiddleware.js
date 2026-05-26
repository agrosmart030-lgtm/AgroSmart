import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Acesso negado. Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token inválido ou expirado." });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.tipo_usuario === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Acesso restrito apenas para administradores." });
  }
};
