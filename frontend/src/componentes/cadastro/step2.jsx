import React from "react";

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

  return (
    // Esse container assume a altura total do box e centraliza tudo vertical e horizontalmente
    <div className="flex flex-col justify-center items-center h-3/4">
      <label className="block text-lg font-bold mb-6 text-center">
        Escolha o tipo de usuário
      </label>
      {/* Container dos botões */}
      <div className="flex flex-col gap-4 items-center">
        <button
          type="button"
          className={`btn w-96 ${
            selectedTipo === "Agricultor" ? "btn-active" : ""
          }`}
          onClick={() => handleTipoChange("Agricultor")}
        >
          👨‍🌾 Agricultor
        </button>
        <button
          type="button"
          className={`btn w-96 ${
            selectedTipo === "Empresário" ? "btn-active" : ""
          }`}
          onClick={() => handleTipoChange("Empresário")}
        >
          🏪 Comerciante
        </button>
        <button
          type="button"
          className={`btn w-96 ${
            selectedTipo === "Cooperativa" ? "btn-active" : ""
          }`}
          onClick={() => handleTipoChange("Cooperativa")}
        >
          🤝 Cooperativa
        </button>
      </div>
      <input
        type="hidden"
        {...register("tipo", { required: "Selecione o tipo de usuário" })}
      />
      {errors.tipo && (
        <p className="text-error text-xs mt-2">{errors.tipo.message}</p>
      )}
    </div>
  );
}
