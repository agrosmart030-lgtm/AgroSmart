import InputField from "../inputField";

export default function Step1({
  register,
  errors,
  estados,
  cidades,
  handleEstadoChange,
  watch,
}) {
  const senha = watch("senha") || "";
  const requisitos = [
    {
      id: "min-maiuscula",
      texto: "Incluir Letras Maiúsculas",
      valido: /[A-Z]/.test(senha),
    },
    {
      id: "min-letra",
      texto: "Incluir Letras Minúsculas",
      valido: /[a-z]/.test(senha),
    },
    {
      id: "numero",
      texto: "Incluir Números",
      valido: /[0-9]/.test(senha),
    },
    {
      id: "especial",
      texto: "Incluir Caractere Especial (!@#$%^&*)",
      valido: /[!@#$%^&*(),.?":{}|<>_\-/]/.test(senha),
    },
    { 
      id: "tamanho",
      texto: "Tamanho maior que 8",
      valido: senha.length >= 8,
    },
  ];

  const requisitosAtendidos = requisitos.every((r) => r.valido);

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
        type="password"
        register={register}
        errors={errors}
        autoComplete="new-password"
        showToggle
        validate={{
          required: "Senha obrigatória",
        }}
      />
      <div
        className={`overflow-hidden transition-all duration-700 ease-in-out ${
          senha.length > 0 && !requisitosAtendidos
            ? "opacity-100 max-h-40 mt-2"
            : "opacity-0 max-h-0 mt-0"
        }`}
        aria-hidden={senha.length === 0 || requisitosAtendidos}
      >
        <div className="text-sm">
          <strong>Sua senha deve conter:</strong>
          <ul className="mt-1 pl-4">
            {requisitos.map((r) => (
              <li
                key={r.id}
                style={{ color: r.valido ? "green" : "red" }}
                id={r.id}
              >
                {r.texto}
              </li>
            ))}
          </ul>
        </div>
      </div>
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
