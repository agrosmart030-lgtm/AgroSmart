import { body } from 'express-validator';

export const sendCodeValidation = [
  body('userId')
    .notEmpty().withMessage('O ID do usuário é obrigatório')
    .isString().withMessage('O ID do usuário deve ser uma string')
    .trim()
    .escape(),
    
  body('method')
    .notEmpty().withMessage('O método de verificação é obrigatório')
    .isIn(['email', 'whatsapp']).withMessage('Método de verificação inválido. Use "email" ou "whatsapp"'),
    
  body('destination')
    .notEmpty().withMessage('O destino é obrigatório')
    .isString().withMessage('O destino deve ser uma string')
    .custom((value, { req }) => {
      if (req.body.method === 'email') {
        // Validação de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new Error('E-mail inválido');
        }
      } else if (req.body.method === 'whatsapp') {
        // Validação de número de telefone (formato internacional)
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Formato E.164
        if (!phoneRegex.test(value)) {
          throw new Error('Número de telefone inválido. Use o formato internacional (ex: +5511999999999)');
        }
      }
      return true;
    })
];

export const verifyCodeValidation = [
  body('userId')
    .notEmpty().withMessage('O ID do usuário é obrigatório')
    .isString().withMessage('O ID do usuário deve ser uma string')
    .trim()
    .escape(),
    
  body('code')
    .notEmpty().withMessage('O código de verificação é obrigatório')
    .isString().withMessage('O código deve ser uma string')
    .isLength({ min: 4, max: 8 }).withMessage('O código deve ter entre 4 e 8 caracteres')
    .matches(/^\d+$/).withMessage('O código deve conter apenas números')
    .trim()
    .escape()
];

export const enable2FAValidation = [
  body('method')
    .notEmpty().withMessage('O método de verificação é obrigatório')
    .isIn(['email', 'whatsapp', 'authenticator']).withMessage('Método de verificação inválido. Use "email", "whatsapp" ou "authenticator"'),
    
  body('destination')
    .optional({ nullable: true })
    .custom((value, { req }) => {
      if (req.body.method === 'authenticator') return true;
      
      if (!value) {
        throw new Error('O destino é obrigatório para este método de verificação');
      }
      
      if (req.body.method === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new Error('E-mail inválido');
        }
      } else if (req.body.method === 'whatsapp') {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(value)) {
          throw new Error('Número de telefone inválido. Use o formato internacional (ex: +5511999999999)');
        }
      }
      return true;
    })
];
