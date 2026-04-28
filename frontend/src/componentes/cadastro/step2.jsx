import React from "react";
import { FaSeedling, FaStore, FaHandshake } from "react-icons/fa";

export default function Step2({
  selectedTipo,
  setSelectedTipo,
  setValue,
  errors,
  register,
}) {
  const handleTipoChange = (tipo) => {
    setSelectedTipo(tipo);
    setValue("tipo", tipo, { shouldValidate: true });
  };

  const tipos = [
    {
      value: "Agricultor",
      label: "Agricultor",
      description: "Produtor rural ou proprietário de terras",
      icon: FaSeedling,
      colorBg: "bg-[#e8f5e9]",
      colorIcon: "text-[#1B4332]",
      colorBorder: "border-[#1B4332]",
      colorBgActive: "bg-[#1B4332]",
    },
    {
      value: "Empresário",
      label: "Comerciante",
      description: "Empresa ou comércio do setor agrícola",
      icon: FaStore,
      colorBg: "bg-[#fff8e1]",
      colorIcon: "text-[#513700]",
      colorBorder: "border-[#513700]",
      colorBgActive: "bg-[#513700]",
    },
    {
      value: "Cooperativa",
      label: "Cooperativa",
      description: "Cooperativa agroindustrial ou de produtores",
      icon: FaHandshake,
      colorBg: "bg-[#e0f2f1]",
      colorIcon: "text-[#004d40]",
      colorBorder: "border-[#004d40]",
      colorBgActive: "bg-[#004d40]",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center py-4">
      <label className="block text-lg font-bold mb-2 text-center text-[#012d1d]">
        Escolha o tipo de usuário
      </label>
      <p className="text-sm text-[#717973] mb-6 text-center">
        Selecione o perfil que melhor descreve você
      </p>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
        {tipos.map((tipo) => {
          const isSelected = selectedTipo === tipo.value;
          const Icon = tipo.icon;

          return (
            <button
              key={tipo.value}
              type="button"
              className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left w-full ${
                isSelected
                  ? `${tipo.colorBorder} ${tipo.colorBg} shadow-md scale-[1.02]`
                  : "border-[#e1e3e4] bg-white hover:border-[#c1c8c2] hover:shadow-sm"
              }`}
              onClick={() => handleTipoChange(tipo.value)}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isSelected
                    ? `${tipo.colorBgActive} text-white`
                    : `${tipo.colorBg} ${tipo.colorIcon}`
                }`}
              >
                <Icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className={`block font-bold text-sm transition-colors ${
                    isSelected ? "text-[#012d1d]" : "text-[#414844]"
                  }`}
                >
                  {tipo.label}
                </span>
                <span className="block text-xs text-[#717973] mt-0.5">
                  {tipo.description}
                </span>
              </div>
              {/* Selection indicator */}
              <div
                className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? `${tipo.colorBorder} ${tipo.colorBgActive}`
                    : "border-[#c1c8c2]"
                }`}
              >
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <input
        type="hidden"
        {...register("tipo", { required: "Selecione o tipo de usuário" })}
      />
      {errors.tipo && (
        <p className="text-red-500 text-xs mt-3">{errors.tipo.message}</p>
      )}
    </div>
  );
}
