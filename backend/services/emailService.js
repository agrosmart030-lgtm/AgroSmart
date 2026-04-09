import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter for sending emails with more robust config
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Sends an email using the centralized transporter
 * @param {Object} options - Email options (to, subject, html)
 * @returns {Promise<Object>} - The result of sendMail
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Configuração de e-mail ausente (.env)');
    }

    const mailOptions = {
      from: `"AgroSmart" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso:', info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error('ERRO DETALHADO NO ENVIO DE EMAIL:', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code // helps identify SMTP errors like EAUTH
    };
  }
};

export default { sendEmail };
