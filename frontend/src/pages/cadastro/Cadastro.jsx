import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import cadastroImg from "../../assets/cadastro.jpg";
import Step1 from "../../componentes/cadastro/step1";
import Step2 from "../../componentes/cadastro/step2";
import Step3 from "../../componentes/cadastro/step3";

export default function Cadastro() {
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldUnregister: false,
  });

  const tipo = watch("tipo");

  useEffect(() => {
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => setEstados(res.data))
      .catch((err) => console.error("Erro ao carregar estados:", err));
  }, []);

  const handleEstadoChange = (e) => {
    const uf = e.target.value;
    if (uf) {
      axios
        .get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
        )
        .then((res) => setCidades(res.data))
        .catch((err) => console.error("Erro ao carregar cidades:", err));
    }
  };

  const nextStep = async () => {
    const valid = await trigger();
    if (valid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data) => {
    const valid = await trigger();
    if (!valid) return;

    if (step < 3) {
      nextStep();
    } else {
      console.log("Cadastro completo:", data);
      setShowToast(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="flex h-screen">
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success">
            <span>Cadastro realizado com sucesso!</span>
          </div>
        </div>
      )}

      <div
        className="w-3/5 bg-cover bg-center shadow-md"
        style={{ backgroundImage: `url(${cadastroImg})` }}
      >
        {/* Imagem de cadastro */}
      </div>

      <div className="w-2/5 bg-[#2e7d32] flex justify-center items-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-[490px] h-[635px] overflow-y-auto flex flex-col justify-between">
          <h2 className="text-2xl font-bold mb-4 text-center">Realize seu cadastro abaixo!</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 h-3/3">
            {step === 1 && (
              <Step1
                register={register}
                errors={errors}
                estados={estados}
                cidades={cidades}
                handleEstadoChange={handleEstadoChange}
                watch={watch}
              />
            )}
            {step === 2 && (
              <Step2
                register={register}
                selectedTipo={selectedTipo}
                setSelectedTipo={setSelectedTipo}
                setValue={setValue}
                errors={errors}
              />
            )}

            {step === 3 && tipo && (
              <Step3 tipo={tipo} register={register} errors={errors} />
            )}

            <div className="flex justify-between pt-12">
              {step > 1 && (
                <button
                  type="button"
                  className="btn bg-white border-[#2e7d32] text-[#2e7d32] hover:bg-[#2e7d32] hover:text-white"
                  onClick={prevStep}
                >
                  Voltar
                </button>
              )}
              <button
                type="submit"
                className="btn bg-[#ffc107] text-black hover:brightness-110"
              >
                {step === 3 ? "Finalizar" : "Avançar"}
              </button>
            </div>
          </form>
          <div className="text-center text-sm pt-4">
            Já tem cadastro?{" "}
            <a
              href="/login"
              className="text-primary hover:underline transition-all"
            >
              Faça login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
