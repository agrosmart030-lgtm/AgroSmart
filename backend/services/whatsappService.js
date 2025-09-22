import Vonage from '@vonage/server-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do cliente Vonage (Nexmo)
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
}, { debug: process.env.NODE_ENV === 'development' });

/**
 * Envia um código de verificação via WhatsApp
 * @param {string} to - Número de telefone no formato internacional (ex: 5511999999999)
 * @param {string} code - Código de verificação
 * @returns {Promise<Object>} Resultado do envio
 */
export const sendVerificationWhatsApp = (to, code) => {
  return new Promise((resolve, reject) => {
    // Formata o número para o padrão internacional (remove caracteres não numéricos e adiciona o prefixo)
    const phoneNumber = to.replace(/\D/g, '');
    
    const from = process.env.VONAGE_BRAND_NAME || 'AgroSmart';
    const text = `Seu código de verificação do AgroSmart é: ${code}\n\nEste código expirará em 5 minutos.`;

    vonage.message.sendSms(
      from,
      phoneNumber,
      text,
      { type: 'unicode' },
      (err, responseData) => {
        if (err) {
          console.error('Erro ao enviar WhatsApp:', err);
          reject(new Error('Falha ao enviar código de verificação por WhatsApp'));
        } else {
          if (responseData.messages[0].status === '0') {
            resolve({
              success: true,
              messageId: responseData.messages[0]['message-id'],
              to: responseData.messages[0].to
            });
          } else {
            console.error('Erro ao enviar WhatsApp:', responseData.messages[0]['error-text']);
            reject(new Error(responseData.messages[0]['error-text']));
          }
        }
      }
    );
  });
};

/**
 * Envia um código de verificação 2FA via WhatsApp
 * @param {string} phoneNumber - Número de telefone no formato internacional
 * @param {string} code - Código de verificação
 * @returns {Promise<Object>} Resultado do envio
 */
export const send2FACodeWhatsApp = (phoneNumber, code) => {
  return sendVerificationWhatsApp(phoneNumber, code);
};

/**
 * Valida um número de telefone
 * @param {string} phoneNumber - Número de telefone a ser validado
 * @returns {boolean} Verdadeiro se o número for válido
 */
export const isValidPhoneNumber = (phoneNumber) => {
  // Validação simples de número de telefone (pode ser ajustada conforme necessário)
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Formato E.164
  return phoneRegex.test(phoneNumber);
};
