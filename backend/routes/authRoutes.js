import { Router } from 'express';
import { body } from 'express-validator';
import { register, verifyAccount, resendVerificationCode, login } from '../controllers/authController.js';

const router = Router();

// Validação para o registro
const registerValidation = [
  body('nome_completo')
    .trim()
    .notEmpty().withMessage('O nome completo é obrigatório')
    .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres'),
    
  body('email')
    .trim()
    .notEmpty().withMessage('O e-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),
    
  body('senha')
    .notEmpty().withMessage('A senha é obrigatória')
    .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
    
  body('cidade')
    .optional()
    .trim(),
    
  body('estado')
    .trim()
    .notEmpty().withMessage('O estado é obrigatório'),
    
  body('tipo_usuario')
    .trim()
    .notEmpty().withMessage('O tipo de usuário é obrigatório')
    .isIn(['produtor', 'tecnico', 'admin']).withMessage('Tipo de usuário inválido'),
    
  body('codigo_ibge')
    .optional()
    .isInt().withMessage('O código IBGE deve ser um número'),
    
  body('telefone')
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Número de telefone inválido. Use o formato internacional (ex: +5511999999999)'),
    
  body('verificationMethod')
    .notEmpty().withMessage('O método de verificação é obrigatório')
    .isIn(['email', 'whatsapp']).withMessage('Método de verificação inválido. Use "email" ou "whatsapp"')
    .custom((value, { req }) => {
      if (value === 'whatsapp' && !req.body.telefone) {
        throw new Error('Número de telefone é obrigatório para verificação por WhatsApp');
      }
      return true;
    })
];

// Rota de login
router.post('/login', [
  body('email')
    .trim()
    .notEmpty().withMessage('O e-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),
    
  body('senha')
    .notEmpty().withMessage('A senha é obrigatória')
], login);

// Rota de registro
router.post('/register', registerValidation, register);

// Rota para verificar a conta
router.post('/verify-account', [
  body('userId')
    .notEmpty().withMessage('ID do usuário é obrigatório')
    .isString().withMessage('ID do usuário inválido'),
    
  body('code')
    .notEmpty().withMessage('O código de verificação é obrigatório')
    .isString().withMessage('Código de verificação inválido')
    .isLength({ min: 4, max: 8 }).withMessage('O código deve ter entre 4 e 8 caracteres')
], verifyAccount);

// Rota para reenviar o código de verificação
router.post('/resend-verification', [
  body('userId')
    .notEmpty().withMessage('ID do usuário é obrigatório')
    .isString().withMessage('ID do usuário inválido'),
    
  body('method')
    .notEmpty().withMessage('O método de verificação é obrigatório')
    .isIn(['email', 'whatsapp']).withMessage('Método de verificação inválido')
], resendVerificationCode);

export default router;
