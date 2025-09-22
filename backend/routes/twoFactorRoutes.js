import { Router } from 'express';
import { sendVerificationCode, verifyVerificationCode } from '../controllers/twoFactorController.js';
import { sendCodeValidation, verifyCodeValidation, enable2FAValidation } from '../validators/twoFactorValidator.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/2fa/send-code:
 *   post:
 *     tags: [Autenticação em Duas Etapas]
 *     summary: Envia um código de verificação para o método escolhido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - method
 *               - destination
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID do usuário
 *               method:
 *                 type: string
 *                 enum: [email, whatsapp]
 *                 description: Método de envio do código
 *               destination:
 *                 type: string
 *                 description: E-mail ou número de telefone (formato internacional) para envio do código
 *     responses:
 *       200:
 *         description: Código de verificação enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 method:
 *                   type: string
 *                 destination:
 *                   type: string
 *       400:
 *         description: Dados inválidos ou erro na requisição
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/send-code', sendCodeValidation, sendVerificationCode);

/**
 * @swagger
 * /api/2fa/verify-code:
 *   post:
 *     tags: [Autenticação em Duas Etapas]
 *     summary: Verifica um código de verificação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - code
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID do usuário
 *               code:
 *                 type: string
 *                 description: Código de verificação recebido
 *     responses:
 *       200:
 *         description: Código verificado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 method:
 *                   type: string
 *                 destination:
 *                   type: string
 *       400:
 *         description: Código inválido, expirado ou excedeu o número de tentativas
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/verify-code', verifyCodeValidation, verifyVerificationCode);

/**
 * @swagger
 * /api/2fa/enable:
 *   post:
 *     tags: [Autenticação em Duas Etapas]
 *     summary: Habilita a autenticação em duas etapas para o usuário
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - method
 *             properties:
 *               method:
 *                 type: string
 *                 enum: [email, whatsapp, authenticator]
 *                 description: Método de autenticação em duas etapas
 *               destination:
 *                 type: string
 *                 description: E-mail ou número de telefone (obrigatório para métodos email e whatsapp)
 *               code:
 *                 type: string
 *                 description: Código de verificação (obrigatório para ativação)
 *     responses:
 *       200:
 *         description: Autenticação em duas etapas habilitada com sucesso
 *       400:
 *         description: Dados inválidos ou código incorreto
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/enable', requireAuth, enable2FAValidation, (req, res) => {
  // Implementação será adicionada posteriormente
  res.status(200).json({ success: true, message: '2FA habilitado com sucesso' });
});

/**
 * @swagger
 * /api/2fa/disable:
 *   post:
 *     tags: [Autenticação em Duas Etapas]
 *     summary: Desabilita a autenticação em duas etapas para o usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Autenticação em duas etapas desabilitada com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/disable', requireAuth, (req, res) => {
  // Implementação será adicionada posteriormente
  res.status(200).json({ success: true, message: '2FA desabilitado com sucesso' });
});

export default router;
