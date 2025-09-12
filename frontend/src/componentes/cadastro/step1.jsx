
import InputField from "../inputField";
import React, { useState } from "react";
import axios from "axios";

export default function Step1({
  register,
  errors,
  estados,
  cidades,
  handleEstadoChange,
  watch,
  setCanProceed,
}) {
  const [estadoInput, setEstadoInput] = useState("");
  const [cidadeInput, setCidadeInput] = useState("");
  const [estadoSelecionado, setEstadoSelecionado] = useState(null);
  const [cidadeSelecionada, setCidadeSelecionada] = useState(null);
  const [showEstadoSugestoes, setShowEstadoSugestoes] = useState(false);
  const [showCidadeSugestoes, setShowCidadeSugestoes] = useState(false);
  const [cidadesEstado, setCidadesEstado] = useState([]);
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

  // Validação para permitir avançar apenas se estado e cidade forem selecionados
  React.useEffect(() => {
    const estadoValido = !!estadoSelecionado;
    const cidadeValida = !!cidadeSelecionada;
    setCanProceed && setCanProceed(estadoValido && cidadeValida);
  }, [estadoSelecionado, cidadeSelecionada, setCanProceed]);

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
        <div className="w-1/2 relative">
          <input
            type="text"
            className={`input input-bordered w-full ${errors.estado ? "border-error" : ""}`}
            placeholder="Estado"
            value={estadoInput}
            onChange={e => {
              setEstadoInput(e.target.value);
              setEstadoSelecionado(null);
              setShowEstadoSugestoes(true);
            }}
            autoComplete="off"
            onFocus={() => setShowEstadoSugestoes(true)}
            onBlur={() => setTimeout(() => setShowEstadoSugestoes(false), 150)}
          />
          {showEstadoSugestoes && estadoInput && (
            <div className="absolute bg-white border rounded w-full z-10 max-h-40 overflow-y-auto shadow">
              {estados.filter(e => e.nome.toLowerCase().includes(estadoInput.toLowerCase())).map(e => (
                <div
                  key={e.id}
                  className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                  onMouseDown={() => {
                    setEstadoInput(e.nome);
                    setEstadoSelecionado(e);
                    setShowEstadoSugestoes(false);
                    // Buscar cidades do estado selecionado
                    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${e.id}/municipios`)
                      .then(res => setCidadesEstado(res.data))
                      .catch(() => setCidadesEstado([]));
                    setCidadeInput("");
                    setCidadeSelecionada(null);
                  }}
                >
                  {e.nome}
                </div>
              ))}
            </div>
          )}
          {errors.estado && (
            <p className="text-error text-xs min-h-[1rem] mt-1">{errors.estado.message}</p>
          )}
        </div>
        <div className="w-1/2 relative">
          <input
            type="text"
            className={`input input-bordered w-full ${errors.cidade ? "border-error" : ""}`}
            placeholder="Cidade"
            value={cidadeInput}
            onChange={e => {
              setCidadeInput(e.target.value);
              setCidadeSelecionada(null);
              setShowCidadeSugestoes(true);
            }}
            autoComplete="off"
            disabled={!estadoSelecionado}
            onFocus={() => setShowCidadeSugestoes(true)}
            onBlur={() => setTimeout(() => setShowCidadeSugestoes(false), 150)}
          />
          {showCidadeSugestoes && cidadeInput && estadoSelecionado && (
            <div className="absolute bg-white border rounded w-full z-10 max-h-40 overflow-y-auto shadow">
              {cidadesEstado.filter(c => c.nome.toLowerCase().includes(cidadeInput.toLowerCase())).map(c => (
                <div
                  key={c.id}
                  className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                  onMouseDown={() => {
                    setCidadeInput(c.nome);
                    setCidadeSelecionada(c);
                    setShowCidadeSugestoes(false);
                  }}
                >
                  {c.nome}
                </div>
              ))}
            </div>
          )}
          {errors.cidade && (
            <p className="text-error text-xs min-h-[1rem] mt-1">{errors.cidade.message}</p>
          )}
        </div>
      </div>
    </>
  );
}
