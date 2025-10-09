import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function VerificationStep({ email, onVerificationSuccess, onResendCode }) {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef(Array(6).fill(null));

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value && !/^\d*$/.test(value)) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1);
    setVerificationCode(newCode);
    setError("");

    // Move to next input if current input has a value
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== "")) {
      handleVerify();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!verificationCode[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
      } else if (verificationCode[index]) {
        // Clear current input and stay on the same field
        const newCode = [...verificationCode];
        newCode[index] = '';
        setVerificationCode(newCode);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('').slice(0, 6);
      setVerificationCode([...newCode, ...Array(6 - newCode.length).fill("")]);
      if (newCode.length === 6) {
        setTimeout(handleVerify, 100);
      } else if (newCode.length > 0) {
        inputRefs.current[newCode.length]?.focus();
      }
    } else {
      setError("Por favor, cole um código de 6 dígitos");
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setError("Por favor, preencha todos os dígitos");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post('http://localhost:5001/api/verify-code', {
        email,
        code
      });

      if (response.data.success) {
        onVerificationSuccess();
      } else {
        setError(response.data.message || "Código inválido. Tente novamente.");
        // Clear all inputs and focus first one
        setVerificationCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("Erro ao verificar o código. Tente novamente.");
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
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
      inputRefs.current[0]?.focus();
    } catch (error) {
      setError("Erro ao reenviar o código. Tente novamente.");
      console.error("Resend error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Verificação de E-mail</h3>
        <p className="text-sm text-gray-600 mt-2">
          Enviamos um código de 6 dígitos para <span className="font-medium">{email}</span>
        </p>
      </div>

      <div className="flex justify-center space-x-3">
        {verificationCode.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`w-12 h-14 text-center text-2xl border-2 ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors`}
            disabled={isLoading}
            autoComplete="off"
            aria-label={`Dígito ${index + 1} do código de verificação`}
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <div className="flex flex-col items-center space-y-4">
        <button
          type="button"
          onClick={handleVerify}
          disabled={isLoading || verificationCode.some(digit => !digit)}
          className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Verificando...' : 'Confirmar Código'}
        </button>

        <div className="w-full border-t border-gray-200 my-2"></div>

        <p className="text-sm text-gray-600">
          Não recebeu o código?{' '}
          <button
            type="button"
            onClick={handleResendCode}
            disabled={!canResend || isLoading}
            className={`font-medium ${
              canResend ? 'text-primary hover:underline' : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            {canResend ? 'Reenviar código' : `Aguarde ${countdown}s`}
          </button>
        </p>
      </div>
    </div>
  );
}
