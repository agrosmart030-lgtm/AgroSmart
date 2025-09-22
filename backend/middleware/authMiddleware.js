import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

/**
 * Middleware para verificar se o usuário está autenticado
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Próxima função de middleware
 */
export const requireAuth = async (req, res, next) => {
  try {
    // Verifica se o token está presente no cabeçalho
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticação não fornecido.'
      });
    }

    // Extrai o token do cabeçalho
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticação inválido.'
      });
    }

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Busca o usuário no banco de dados
    const result = await pool.query('SELECT * FROM tb_usuario WHERE id = $1', [decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não encontrado.'
      });
    }

    // Adiciona o usuário ao objeto de requisição
    req.user = result.rows[0];
    
    // Continua para a próxima rota
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado. Por favor, faça login novamente.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticação inválido.'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro na autenticação.'
    });
  }
};

/**
 * Middleware para verificar se o usuário é um administrador
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Próxima função de middleware
 */
export const requireAdmin = (req, res, next) => {
  // Primeiro verifica se o usuário está autenticado
  requireAuth(req, res, () => {
    // Verifica se o usuário é um administrador
    if (req.user && req.user.tipo_usuario === 'admin') {
      next();
    } else {
      res.status(403).json({
        success: false,
        error: 'Acesso negado. Você não tem permissão para acessar este recurso.'
      });
    }
  });
};

/**
 * Middleware para verificar se o 2FA está habilitado e requer verificação
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Próxima função de middleware
 */
export const require2FA = (req, res, next) => {
  // Se o 2FA não estiver habilitado, continua para a próxima rota
  if (!req.user.two_factor_enabled) {
    return next();
  }
  
  // Verifica se o 2FA já foi verificado nesta sessão
  if (req.session && req.session.twoFactorVerified) {
    return next();
  }
  
  // Se não foi verificado, retorna um erro 403 (Forbidden)
  res.status(403).json({
    success: false,
    error: 'Verificação em duas etapas necessária.',
    requires2FA: true,
    userId: req.user.id
  });
};
