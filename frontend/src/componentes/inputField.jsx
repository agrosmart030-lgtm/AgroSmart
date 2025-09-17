import React, { useState } from "react";
import eye from "../assets/eye.svg";        // ícone para mostrar a senha
import eyeOff from "../assets/eye-off.svg"; // ícone para ocultar a senha

export default function InputField({
  label,
  name,
  register,
  errors,
  type = "text",
  showToggle = false,
  validate,
  mask,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const inputType = showToggle ? (isVisible ? "text" : "password") : type;

  const onToggle = () => setIsVisible((prev) => !prev);

  // Função para formatar CPF / CNPJ
  const formatValue = (value) => {
    if (mask === "cpf") {
      return value
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    if (mask === "cnpj") {
      return value
        .replace(/\D/g, "")
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
    return value;
  };

  return (
    <div className="relative">
      <input
        type={inputType}
        placeholder={label}
        className={`input input-bordered w-full pr-10 ${
          errors[name] ? "border-error" : ""
        }`}
        {...register(name, {
          required: `${label} é obrigatório`,
          ...validate,
          onChange: (e) => {
            e.target.value = formatValue(e.target.value);
          },
        })}
      />

      {/* Botão para mostrar/ocultar senha */}
      {showToggle && (
        <button
          type="button"
          className="absolute right-3.5 top-3.5"
          onClick={onToggle}
        >
          <img
            src={isVisible ? eye : eyeOff}
            alt="Toggle Senha"
            className="w-5 h-5 opacity-70 hover:opacity-100 transition"
          />
        </button>
      )}

      {/* Mensagem de erro */}
      <p className="text-error text-xs min-h-[1rem] mt-1">
        {errors[name]?.message}
      </p>
    </div>
  );
}
