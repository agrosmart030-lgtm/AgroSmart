import NodeCache from 'node-cache';
import speakeasy from 'speakeasy';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

// Configuração do cache para armazenar códigos de verificação
const verificationCache = new NodeCache({
  stdTTL: parseInt(process.env.TWO_FACTOR_CODE_EXPIRY) || 300, // 5 minutos por padrão
  checkperiod: 60, // Verifica a cada minuto por itens expirados
  deleteOnExpire: true,
  useClones: false,
});

// Cache para controle de tentativas
const attemptsCache = new NodeCache({
  stdTTL: parseInt(process.env.TWO_FACTOR_BLOCK_TIME) || 1800, // 30 minutos por padrão
  checkperiod: 60,
});

/**
 * Gera um código de verificação numérico
 * @param {number} length - Comprimento do código (padrão: 6)
 * @returns {string} Código de verificação
 */
export const generateVerificationCode = (length = 6) => {
  const digits = '0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  
  return code;
};

/**
 * Armazena um código de verificação no cache
 * @param {string} userId - ID do usuário
 * @param {string} code - Código de verificação
 * @param {string} method - Método de envio (email ou whatsapp)
 * @param {string} destination - Destino (e-mail ou número de telefone)
 * @returns {boolean} Verdadeiro se o código foi armazenado com sucesso
 */
export const storeVerificationCode = (userId, code, method, destination) => {
  const key = `verification:${userId}`;
  const data = {
    code,
    method,
    destination,
    attempts: 0,
    verified: false,
    createdAt: new Date().toISOString(),
  };
  
  return verificationCache.set(key, data);
};

/**
 * Verifica se um código de verificação é válido
 * @param {string} userId - ID do usuário
 * @param {string} code - Código de verificação
 * @returns {Object} Resultado da verificação
 */
export const verifyCode = (userId, code) => {
  const key = `verification:${userId}`;
  const attemptKey = `attempts:${userId}`;
  
  // Verifica se o usuário excedeu o limite de tentativas
  const attempts = attemptsCache.get(attemptKey) || 0;
  const maxAttempts = parseInt(process.env.TWO_FACTOR_ATTEMPTS_LIMIT) || 3;
  
  if (attempts >= maxAttempts) {
    return {
      valid: false,
      error: 'Limite de tentativas excedido. Tente novamente mais tarde.',
      remainingAttempts: 0,
    };
  }
  
  // Obtém os dados de verificação do cache
  const verificationData = verificationCache.get(key);
  
  if (!verificationData) {
    attemptsCache.set(attemptKey, attempts + 1);
    return {
      valid: false,
      error: 'Código de verificação inválido ou expirado.',
      remainingAttempts: maxAttempts - (attempts + 1),
    };
  }
  
  // Verifica se o código está correto
  if (verificationData.code !== code) {
    attemptsCache.set(attemptKey, attempts + 1);
    return {
      valid: false,
      error: 'Código de verificação incorreto.',
      remainingAttempts: maxAttempts - (attempts + 1),
    };
  }
  
  // Se chegou aqui, o código está correto
  // Marca como verificado e remove do cache
  verificationData.verified = true;
  verificationCache.del(key);
  attemptsCache.del(attemptKey);
  
  return {
    valid: true,
    method: verificationData.method,
    destination: verificationData.destination,
  };
};

/**
 * Verifica se um usuário tem um código de verificação ativo
 * @param {string} userId - ID do usuário
 * @returns {Object} Dados de verificação ou null se não existir
 */
export const getActiveVerification = (userId) => {
  const key = `verification:${userId}`;
  return verificationCache.get(key) || null;
};

/**
 * Remove um código de verificação do cache
 * @param {string} userId - ID do usuário
 * @returns {boolean} Verdadeiro se o código foi removido com sucesso
 */
export const removeVerificationCode = (userId) => {
  const key = `verification:${userId}`;
  return verificationCache.del(key) > 0;
};

/**
 * Gera um segredo TOTP (Time-based One-Time Password)
 * @returns {Object} Objeto com o segredo e a URL para código QR
 */
export const generateTOTPSecret = () => {
  const secret = speakeasy.generateSecret({
    name: 'AgroSmart', // Nome do serviço
    issuer: 'AgroSmart', // Emissor do código
    length: 20, // Comprimento do segredo
  });
  
  return {
    secret: secret.base32, // Segredo em formato base32
    otpauthUrl: secret.otpauth_url, // URL para gerar o QR Code
  };
};

/**
 * Verifica um código TOTP
 * @param {string} secret - Segredo TOTP em base32
 * @param {string} token - Token a ser verificado
 * @returns {boolean} Verdadeiro se o token for válido
 */
export const verifyTOTP = (secret, token) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1, // Aceita tokens até 1 passo (30s) antes/depois
  });
};
