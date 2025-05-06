import React from "react";
import InputField from "../inputField";

export default function Step1({
  register,
  errors,
  handleEstadoChange,
  estados,
  cidades,
  watch,
}) {
  return (
    <>
      <InputField
        label="Nome"
        name="nome"
        register={register}
        errors={errors}
      />
      <InputField
        label="E-mail"
        name="email"
        register={register}
        errors={errors}
        type="email"
      />
      <InputField
        label="Senha"
        name="senha"
        register={register}
        errors={errors}
        showToggle
      />
      <InputField
        label="Confirmar Senha"
        name="confirmarSenha"
        register={register}
        errors={errors}
        showToggle
        validate={{
          validate: (value) =>
            value === watch("senha") || "As senhas não coincidem",
        }}
      />

      <div className="flex gap-4">
        <div className="w-1/2">
          <select
            className={`select select-bordered w-full ${
              errors.estado ? "border-error" : ""
            }`}
            {...register("estado", { required: "Estado é obrigatório" })}
            onChange={handleEstadoChange}
          >
            <option value="">Estado</option>
            {estados.map((estado) => (
              <option key={estado.id} value={estado.sigla}>
                {estado.nome}
              </option>
            ))}
          </select>
          {errors.estado && (
            <p className="text-error text-xs min-h-[1rem] mt-1">
              {errors.estado.message}
            </p>
          )}
        </div>

        <div className="w-1/2">
          <select
            className={`select select-bordered w-full ${
              errors.cidade ? "border-error" : ""
            }`}
            {...register("cidade", { required: "Cidade é obrigatória" })}
          >
            <option value="">Cidade</option>
            {cidades.map((cidade) => (
              <option key={cidade.id} value={cidade.nome}>
                {cidade.nome}
              </option>
            ))}
          </select>
          {errors.cidade && (
            <p className="text-error text-xs min-h-[1rem] mt-1">
              {errors.cidade.message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
