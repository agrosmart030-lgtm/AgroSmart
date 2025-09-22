import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { generateVerificationCode, storeVerificationCode, verifyCode } from '../services/twoFactorService.js';
import { sendVerificationEmail } from '../services/emailService.js';
import { sendVerificationWhatsApp } from '../services/whatsappService.js';
import { checkLoginAttempts, recordFailedAttempt, resetLoginAttempts } from '../services/rateLimitService.js';

/**
 * Registra um novo usuário com verificação de e-mail/telefone
 */
export const register = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Valida os dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { 
      nome_completo, 
      email, 
      senha, 
      cidade, 
      estado, 
      tipo_usuario, 
      codigo_ibge,
      telefone,
      verificationMethod // 'email' ou 'whatsapp'
    } = req.body;

    // Verifica se o e-mail já está cadastrado
    const emailCheck = await client.query(
      'SELECT id FROM tb_usuario WHERE email = $1', 
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Este e-mail já está cadastrado.'
      });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Insere o usuário como não verificado
    const result = await client.query(
      `INSERT INTO tb_usuario 
       (nome_completo, email, senha, cidade, estado, tipo_usuario, codigo_ibge, telefone, verificado, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false, NOW(), NOW())
       RETURNING id, nome_completo, email, tipo_usuario`,
      [nome_completo, email, hashedPassword, cidade, estado, tipo_usuario, codigo_ibge, telefone || null]
    );

    const newUser = result.rows[0];

    // Gera e envia o código de verificação
    const verificationCode = generateVerificationCode();
    const destination = verificationMethod === 'email' ? email : telefone;
    
    // Armazena o código para verificação
    storeVerificationCode(
      newUser.id.toString(),
      verificationCode,
      verificationMethod,
      destination
    );

    // Envia o código pelo método selecionado
    try {
      if (verificationMethod === 'email') {
        await sendVerificationEmail(destination, verificationCode);
      } else {
        await sendVerificationWhatsApp(destination, verificationCode);
      }
    } catch (error) {
      console.error('Erro ao enviar código de verificação:', error);
      await client.query('ROLLBACK');
      return res.status(500).json({
        success: false,
        error: 'Erro ao enviar código de verificação. Tente novamente.'
      });
    }

    await client.query('COMMIT');
    
    // Resposta sem o código em produção
    const response = {
      success: true,
      message: 'Usuário registrado com sucesso. Por favor, verifique seu e-mail/telefone.',
      userId: newUser.id,
      verificationRequired: true,
      method: verificationMethod,
      destination: verificationMethod === 'email' 
        ? email.replace(/(.{2}).(.{3})(.*)(@.*)/, '$1****$3$4')
        : `+${telefone.replace(/\d(\d{3})(\d{3})(\d{4})/, '*******$3')}`
    };

    // Em ambiente de desenvolvimento, inclui o código para facilitar os testes
    if (process.env.NODE_ENV !== 'production') {
      response.verificationCode = verificationCode;
    }

    res.status(201).json(response);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao registrar usuário.'
    });
  } finally {
    client.release();
  }
};

/**
 * Verifica o código de verificação do usuário
 */
export const verifyAccount = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { userId, code } = req.body;
    
    // Verifica se o código é válido
    const verification = verifyCode(userId, code);
    
    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        error: verification.error || 'Código de verificação inválido ou expirado.',
        remainingAttempts: verification.remainingAttempts
      });
    }
    
    // Atualiza o usuário como verificado
    await client.query(
      'UPDATE tb_usuario SET verificado = true, updated_at = NOW() WHERE id = $1',
      [userId]
    );
    
    // Gera o token JWT
    const user = (await client.query(
      'SELECT id, nome_completo, email, tipo_usuario FROM tb_usuario WHERE id = $1',
      [userId]
    )).rows[0];
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      success: true,
      message: 'Conta verificada com sucesso!',
      token,
      user: {
        id: user.id,
        nome_completo: user.nome_completo,
        email: user.email,
        tipo_usuario: user.tipo_usuario,
        verificado: true
      }
    });
    
  } catch (error) {
    console.error('Erro na verificação da conta:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao verificar a conta.'
    });
  } finally {
    client.release();
  }
};

/**
 * Reenvia o código de verificação
 */
/**
 * Realiza o login do usuário com verificação de tentativas
 */
export const login = async (req, res) => {
  const { email, senha } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;
  
  try {
    // Verifica se o IP ou email está bloqueado
    const ipCheck = checkLoginAttempts(clientIp);
    const emailCheck = checkLoginAttempts(email);
    
    // Se qualquer um estiver bloqueado, retorna erro
    if (ipCheck.isBlocked || emailCheck.isBlocked) {
      const remainingTime = Math.max(ipCheck.remainingTime, emailCheck.remainingTime);
      return res.status(429).json({
        success: false,
        error: `Muitas tentativas de login. Tente novamente em ${remainingTime} segundos.`,
        remainingTime
      });
    }
    
    // Busca o usuário pelo email
    const result = await pool.query(
      'SELECT id, nome_completo, email, senha, tipo_usuario, verificado, two_factor_enabled FROM tb_usuario WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      // Registra tentativa falha para o IP e email
      recordFailedAttempt(clientIp);
      recordFailedAttempt(email);
      
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas.'
      });
    }
    
    const user = result.rows[0];
    
    // Verifica se a conta está verificada
    if (!user.verificado) {
      return res.status(403).json({
        success: false,
        error: 'Por favor, verifique seu e-mail/telefone antes de fazer login.',
        requiresVerification: true,
        userId: user.id
      });
    }
    
    // Verifica a senha
    const isMatch = await bcrypt.compare(senha, user.senha);
    
    if (!isMatch) {
      // Registra tentativa falha para o IP e email
      recordFailedAttempt(clientIp);
      recordFailedAttempt(email);
      
      const ipStatus = checkLoginAttempts(clientIp);
      const emailStatus = checkLoginAttempts(email);
      
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas.',
        remainingAttempts: Math.min(
          ipStatus.maxAttempts - ipStatus.attempts,
          emailStatus.maxAttempts - emailStatus.attempts
        )
      });
    }
    
    // Se chegou aqui, o login foi bem-sucedido
    // Reseta os contadores de tentativas
    resetLoginAttempts(clientIp);
    resetLoginAttempts(email);
    
    // Gera o token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Remove a senha da resposta
    const { senha: _, ...userData } = user;
    
    // Verifica se o 2FA está habilitado
    if (user.two_factor_enabled) {
      return res.status(202).json({
        success: true,
        requires2FA: true,
        tempToken: jwt.sign(
          { userId: user.id, is2FAPending: true },
          process.env.JWT_SECRET,
          { expiresIn: '5m' } // Token temporário válido por 5 minutos
        ),
        message: 'Por favor, complete a verificação em duas etapas.'
      });
    }
    
    // Se não precisar de 2FA, retorna o token de acesso
    res.status(200).json({
      success: true,
      token,
      user: userData,
      message: 'Login realizado com sucesso!'
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar o login. Tente novamente mais tarde.'
    });
  }
};

/**
 * Reenvia o código de verificação
 */
export const resendVerificationCode = async (req, res) => {
  try {
    const { userId, method } = req.body;
    
    // Busca os dados do usuário
    const result = await pool.query(
      'SELECT id, email, telefone, verificado FROM tb_usuario WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado.'
      });
    }
    
    const user = result.rows[0];
    
    if (user.verificado) {
      return res.status(400).json({
        success: false,
        error: 'Esta conta já foi verificada.'
      });
    }
    
    const destination = method === 'email' ? user.email : user.telefone;
    
    if (!destination) {
      return res.status(400).json({
        success: false,
        error: `Nenhum ${method === 'email' ? 'e-mail' : 'telefone'} cadastrado para este usuário.`
      });
    }
    
    // Gera e envia o novo código
    const verificationCode = generateVerificationCode();
    
    storeVerificationCode(
      user.id.toString(),
      verificationCode,
      method,
      destination
    );
    
    // Envia o código
    if (method === 'email') {
      await sendVerificationEmail(destination, verificationCode);
    } else {
      await sendVerificationWhatsApp(destination, verificationCode);
    }
    
    // Resposta sem o código em produção
    const response = {
      success: true,
      message: `Código de verificação enviado para seu ${method === 'email' ? 'e-mail' : 'WhatsApp'}.`,
      method,
      destination: method === 'email' 
        ? user.email.replace(/(.{2}).(.{3})(.*)(@.*)/, '$1****$3$4')
        : `+${user.telefone.replace(/\d(\d{3})(\d{3})(\d{4})/, '*******$3')}`
    };
    
    // Em ambiente de desenvolvimento, inclui o código para facilitar os testes
    if (process.env.NODE_ENV !== 'production') {
      response.verificationCode = verificationCode;
    }
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Erro ao reenviar código de verificação:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao reenviar código de verificação.'
    });
  }
};
