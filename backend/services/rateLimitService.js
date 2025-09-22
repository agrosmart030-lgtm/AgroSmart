import NodeCache from 'node-cache';

// Configuração do cache para armazenar tentativas de login
const loginAttemptsCache = new NodeCache({ stdTTL: 600 }); // 10 minutos de expiração

// Limite de tentativas antes do bloqueio
const MAX_LOGIN_ATTEMPTS = 5;
// Tempo de bloqueio em segundos
const BLOCK_TIME = 10;

/**
 * Verifica se o IP ou email está bloqueado por excesso de tentativas
 * @param {string} key - Chave de identificação (pode ser IP ou email)
 * @returns {Object} - Objeto com status de bloqueio e tempo restante
 */
export const checkLoginAttempts = (key) => {
  const attempts = loginAttemptsCache.get(`attempts_${key}`) || 0;
  const lastAttempt = loginAttemptsCache.get(`last_attempt_${key}`) || 0;
  const blockUntil = loginAttemptsCache.get(`block_until_${key}`) || 0;
  
  const now = Math.floor(Date.now() / 1000); // timestamp em segundos
  const isBlocked = blockUntil > now;
  const remainingTime = isBlocked ? (blockUntil - now) : 0;
  
  return {
    isBlocked,
    remainingTime,
    attempts,
    maxAttempts: MAX_LOGIN_ATTEMPTS
  };
};

/**
 * Registra uma tentativa de login falha
 * @param {string} key - Chave de identificação (pode ser IP ou email)
 * @returns {Object} - Status atual após a tentativa
 */
export const recordFailedAttempt = (key) => {
  const now = Math.floor(Date.now() / 1000);
  let attempts = loginAttemptsCache.get(`attempts_${key}`) || 0;
  
  // Incrementa o contador de tentativas
  attempts += 1;
  loginAttemptsCache.set(`attempts_${key}`, attempts);
  loginAttemptsCache.set(`last_attempt_${key}`, now);
  
  // Se excedeu o limite, bloqueia por BLOCK_TIME segundos
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    const blockUntil = now + BLOCK_TIME;
    loginAttemptsCache.set(`block_until_${key}`, blockUntil, BLOCK_TIME);
    
    // Reseta as tentativas após o bloqueio
    setTimeout(() => {
      loginAttemptsCache.del(`attempts_${key}`);
      loginAttemptsCache.del(`block_until_${key}`);
    }, BLOCK_TIME * 1000);
    
    return {
      isBlocked: true,
      remainingTime: BLOCK_TIME,
      attempts,
      maxAttempts: MAX_LOGIN_ATTEMPTS
    };
  }
  
  return {
    isBlocked: false,
    remainingTime: 0,
    attempts,
    maxAttempts: MAX_LOGIN_ATTEMPTS
  };
};

/**
 * Reseta o contador de tentativas para uma chave específica
 * @param {string} key - Chave de identificação
 */
export const resetLoginAttempts = (key) => {
  loginAttemptsCache.del(`attempts_${key}`);
  loginAttemptsCache.del(`last_attempt_${key}`);
  loginAttemptsCache.del(`block_until_${key}`);
};

export default {
  checkLoginAttempts,
  recordFailedAttempt,
  resetLoginAttempts
};
