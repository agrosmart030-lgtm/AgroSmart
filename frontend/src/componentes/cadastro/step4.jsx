import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Step4({ email, onVerificationSuccess, onResendCode }) {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = [];

  useEffect(() => {
    // Start countdown for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    
    // Only allow numbers and limit to 1 character
    if (value && !/^\d*$/.test(value)) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1); // Take only the last character
    setVerificationCode(newCode);
    setError("");

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs[index + 1]?.focus();
    }

    // If all fields are filled, submit automatically
    if (newCode.every(digit => digit !== "")) {
      handleVerify();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('').slice(0, 6);
      setVerificationCode([...newCode, ...Array(6 - newCode.length).fill("")]);
      
      // Auto-submit if all digits are pasted
      if (newCode.length === 6) {
        // Small delay to allow state to update
        setTimeout(handleVerify, 100);
      } else if (newCode.length > 0) {
        // Focus the next empty field
        inputRefs[newCode.length]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setError("Por favor, preencha todos os dígitos");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/verify-2fa', {
        email,
        code
      });

      if (response.data.success) {
        onVerificationSuccess();
      } else {
        setError(response.data.message || "Código inválido. Tente novamente.");
        // Clear the input fields on error
        setVerificationCode(["", "", "", "", "", ""]);
        inputRefs[0]?.focus();
      }
    } catch (error) {
      setError("Erro ao verificar o código. Tente novamente.");
      console.error("Verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      await onResendCode();
      setCountdown(60);
      setCanResend(false);
      setVerificationCode(["", "", "", "", "", ""]);
      inputRefs[0]?.focus();
    } catch (error) {
      setError("Erro ao reenviar o código. Tente novamente.");
      console.error("Resend error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-3/4">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold mb-2">Verificação de E-mail</h3>
        <p className="text-gray-600">
          Enviamos um código de 6 dígitos para <span className="font-semibold">{email}</span>
        </p>
        <p className="text-gray-600">Digite o código abaixo para verificar seu e-mail:</p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            ref={(el) => (inputRefs[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength="1"
            value={verificationCode[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="w-12 h-12 text-2xl text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
            autoFocus={index === 0}
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          Não recebeu o código?{' '}
          <button
            type="button"
            onClick={handleResendCode}
            disabled={!canResend || isLoading}
            className={`font-medium ${
              canResend ? 'text-primary hover:underline' : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            {canResend ? 'Reenviar código' : `Reenviar em ${countdown}s`}
          </button>
        </p>
      </div>
    </div>
  );
}
