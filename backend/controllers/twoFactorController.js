import { generateVerificationCode, storeVerificationCode, verifyCode } from '../services/twoFactorService.js';
import { send2FACodeEmail } from '../services/emailService.js';
import { send2FACodeWhatsApp, isValidPhoneNumber } from '../services/whatsappService.js';
import { validationResult } from 'express-validator';

/**
 * Envia um código de verificação para o método escolhido (e-mail ou WhatsApp)
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 */
export const sendVerificationCode = async (req, res) => {
  try {
    // Valida os parâmetros da requisição
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { userId, method, destination } = req.body;
    
    // Verifica se o método de envio é válido
    if (!['email', 'whatsapp'].includes(method)) {
      return res.status(400).json({
        success: false,
        error: 'Método de verificação inválido. Use "email" ou "whatsapp".'
      });
    }

    // Valida o destino com base no método
    if (method === 'whatsapp' && !isValidPhoneNumber(destination)) {
      return res.status(400).json({
        success: false,
        error: 'Número de telefone inválido. Use o formato internacional (ex: 5511999999999).'
      });
    }

    // Gera um código de verificação
    const code = generateVerificationCode();
    
    // Armazena o código no cache
    const stored = storeVerificationCode(userId, code, method, destination);
    
    if (!stored) {
      return res.status(500).json({
        success: false,
        error: 'Falha ao gerar código de verificação. Tente novamente.'
      });
    }

    // Envia o código pelo método selecionado
    try {
      if (method === 'email') {
        await send2FACodeEmail(destination, code);
      } else if (method === 'whatsapp') {
        await send2FACodeWhatsApp(destination, code);
      }

      // Não revela o código na resposta em produção
      const responseMessage = process.env.NODE_ENV === 'development' 
        ? `Código de verificação enviado para ${method} (apenas em desenvolvimento): ${code}`
        : `Código de verificação enviado para o ${method} informado`;

      res.status(200).json({
        success: true,
        message: responseMessage,
        method,
        destination: method === 'email' 
          ? destination.replace(/(.{2}).(.{3})(.*)(@.*)/, '$1****$3$4') // Ofusca parte do e-mail
          : `+${destination.replace(/\D/g, '').replace(/(\d{2})(\d{2})(\d+)(\d{4})/, '$1 **** **** $4')}` // Ofusca parte do telefone
      });
    } catch (error) {
      console.error(`Erro ao enviar código de verificação por ${method}:`, error);
      return res.status(500).json({
        success: false,
        error: `Falha ao enviar código de verificação por ${method}. Tente novamente.`
      });
    }
  } catch (error) {
    console.error('Erro no controlador sendVerificationCode:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao processar a solicitação.'
    });
  }
};

/**
 * Verifica um código de verificação
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 */
export const verifyVerificationCode = async (req, res) => {
  try {
    // Valida os parâmetros da requisição
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { userId, code } = req.body;
    
    // Verifica o código
    const result = verifyCode(userId, code);
    
    if (!result.valid) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Código de verificação inválido ou expirado.',
        remainingAttempts: result.remainingAttempts
      });
    }
    
    // Se chegou aqui, o código é válido
    res.status(200).json({
      success: true,
      message: 'Código verificado com sucesso!',
      method: result.method,
      destination: result.destination
    });
    
  } catch (error) {
    console.error('Erro no controlador verifyVerificationCode:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao verificar o código.'
    });
  }
};

/**
 * Middleware para verificar se o 2FA está habilitado e requer verificação
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Próxima função de middleware
 */
export const require2FA = (req, res, next) => {
  // Verifica se o usuário está autenticado
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Usuário não autenticado.'
    });
  }
  
  // Verifica se o 2FA está habilitado para o usuário
  if (req.user.twoFactorEnabled) {
    // Verifica se o 2FA já foi verificado nesta sessão
    if (req.session.twoFactorVerified) {
      return next();
    }
    
    // Se não foi verificado, retorna um erro 403 (Forbidden)
    return res.status(403).json({
      success: false,
      error: 'Verificação em duas etapas necessária.',
      requires2FA: true,
      userId: req.user.id
    });
  }
  
  // Se o 2FA não estiver habilitado, continua para a próxima rota
  next();
};
