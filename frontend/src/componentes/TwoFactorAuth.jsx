import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaEnvelope, FaWhatsapp, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const TwoFactorAuth = ({ onVerify, onCancel, method = 'email', contactInfo }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0 && !success) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, success]);

  const handleCodeChange = (index, value) => {
    const numValue = value.replace(/\D/g, '').charAt(0);
    const newCode = [...code];
    newCode[index] = numValue;
    setCode(newCode);
    
    if (numValue !== '' && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
    
    if (newCode.every(digit => digit !== '') && newCode.length === 6) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleVerify = async (verificationCode) => {
    if (verificationCode.length !== 6) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await onVerify(verificationCode);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Código inválido. Tente novamente.');
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Chamada para reenviar o código
      setCountdown(60);
    } catch (err) {
      setError('Erro ao reenviar o código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const maskedContact = () => {
    if (!contactInfo) return '';
    if (method === 'email') {
      const [user, domain] = contactInfo.split('@');
      return `${user[0]}***@${domain}`;
    } else {
      const lastFour = contactInfo.slice(-4);
      return `+55 (**) *****-${lastFour}`;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <FaShieldAlt size={32} color="#4F46E5" />
        <h3 style={styles.title}>Verificação em Duas Etapas</h3>
        <p style={styles.subtitle}>
          Enviamos um código de 6 dígitos para{' '}
          <span style={styles.contact}>{maskedContact()}</span>
        </p>
      </div>

      <div style={styles.codeContainer}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            id={`code-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code[index]}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            style={styles.codeInput}
            disabled={isLoading || success}
            autoFocus={index === 0}
            aria-label={`Dígito ${index + 1} do código de verificação`}
            aria-invalid={error ? 'true' : 'false'}
          />
        ))}
      </div>

      {error && (
        <div style={styles.error}>
          <FaTimesCircle style={{ marginRight: 8 }} />
          {error}
        </div>
      )}

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={styles.success}
          >
            <FaCheckCircle style={{ marginRight: 8 }} />
            Verificação concluída com sucesso!
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.footer}>
        <button
          onClick={onCancel}
          style={styles.cancelButton}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          onClick={handleResendCode}
          style={styles.resendButton}
          disabled={countdown > 0 || isLoading}
        >
          {countdown > 0 ? `Reenviar em ${countdown}s` : 'Reenviar código'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '400px',
    padding: '24px',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    margin: '16px 0 8px',
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#6B7280',
  },
  contact: {
    fontWeight: '600',
    color: '#4F46E5',
  },
  codeContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '24px 0',
    gap: '8px',
  },
  codeInput: {
    width: '100%',
    height: '56px',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: '600',
    borderRadius: '8px',
    border: '2px solid #E5E7EB',
    outline: 'none',
    transition: 'all 0.2s',
    ':focus': {
      borderColor: '#4F46E5',
      boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.2)'
    }
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    marginBottom: '16px',
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
    borderRadius: '6px',
    fontSize: '14px',
  },
  success: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    marginBottom: '16px',
    backgroundColor: '#ECFDF5',
    color: '#059669',
    borderRadius: '6px',
    fontSize: '14px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px',
  },
  cancelButton: {
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #D1D5DB',
    color: '#4B5563',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#F3F4F6',
    },
    ':disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  resendButton: {
    padding: '10px 16px',
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    color: '#4F46E5',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#EEF2FF',
    },
    ':disabled': {
      color: '#9CA3AF',
      backgroundColor: '#F3F4F6',
      cursor: 'not-allowed',
    },
  },
};

export default TwoFactorAuth;