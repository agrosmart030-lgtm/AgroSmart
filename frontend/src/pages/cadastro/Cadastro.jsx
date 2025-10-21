import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import cadastroImg from "../../assets/cadastro.jpg";
import Step1 from "../../componentes/cadastro/step1";
import Step2 from "../../componentes/cadastro/step2";
import Step3 from "../../componentes/cadastro/step3";
import VerificationStep from "../../componentes/cadastro/step4";
import { exibirAlertaErro } from "../../hooks/useAlert";
import ReCAPTCHA from "react-google-recaptcha";

export default function Cadastro() {
  const [canProceed, setCanProceed] = useState(false);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [step, setStep] = useState(1);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [captchaValido, setCaptchaValido] = useState(false);
  const navigate = useNavigate();
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [codeError, setCodeError] = useState("");

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
    if (step === 3 && !captchaValido) {
      exibirAlertaErro("Valide o reCAPTCHA antes de prosseguir");
      return;
    }

    if (step < 3) {
      nextStep();
    } else if (step === 3) {
      // prepare payload and move to step 4 (verification)
      // Corrige o tipo_usuario para não ter acento e ser minúsculo
      let tipo = data.tipo;
      if (tipo) {
        tipo = tipo
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase();
      }
      const payload = {
        nome_completo: data.nome,
        email: data.email,
        senha: data.senha,
        cidade: data.cidade,
        estado: data.estado,
        tipo_usuario: tipo,
        codigo_ibge: null,
      };
      //Conforme o tipo
      if (payload.tipo_usuario === "agricultor") {
        payload.cpf =
          data.cpf && data.cpf.replace(/\D/g, "").length === 11
            ? data.cpf
            : null;
        payload.nomePropriedade = data.nomePropriedade;
        payload.areaCultivada = data.areaCultivada;
        payload.graos = data.graos;
      } else if (payload.tipo_usuario === "empresario") {
        payload.cpf =
          data.cpf && data.cpf.replace(/\D/g, "").length === 11
            ? data.cpf
            : null;
        payload.nomeComercio = data.nomeComercio;
        payload.cnpj =
          data.cnpj && data.cnpj.replace(/\D/g, "").length === 14
            ? data.cnpj
            : null;
        payload.graos = data.graos;
      } else if (payload.tipo_usuario === "cooperativa") {
        payload.nomeCooperativa = data.nomeCooperativa;
        payload.cnpj =
          data.cnpj && data.cnpj.replace(/\D/g, "").length === 14
            ? data.cnpj
            : null;
        payload.areaAtuacao = data.areaAtuacao;
      }

      try {
        // store payload pending final submission and request send-code
        setPendingPayload(payload);
        await axios.post("http://localhost:5001/api/registro/send-code", { email: payload.email });
        // advance to step 4 (the verification UI)
        setStep(4);
        return;
      } catch (err) {
        console.error('Erro ao enviar código para verificação:', err);
        exibirAlertaErro('Falha ao enviar código', err.message || String(err));
        return;
      }
    } else if (step === 4) {
      // submitting should happen after VerificationStep calls our handler (see below)
      return;
    } else {
      // Corrige o tipo_usuario para não ter acento e ser minúsculo
      let tipo = data.tipo;
      if (tipo) {
        tipo = tipo
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase();
      }
      const payload = {
        nome_completo: data.nome,
        email: data.email,
        senha: data.senha,
        cidade: data.cidade,
        estado: data.estado,
        tipo_usuario: tipo,
        codigo_ibge: null,
      };
      //Conforme o tipo
      if (payload.tipo_usuario === "agricultor") {
        payload.cpf =
          data.cpf && data.cpf.replace(/\D/g, "").length === 11
            ? data.cpf
            : null;
        payload.nomePropriedade = data.nomePropriedade;
        payload.areaCultivada = data.areaCultivada;
        payload.graos = data.graos;
      } else if (payload.tipo_usuario === "empresario") {
        payload.cpf =
          data.cpf && data.cpf.replace(/\D/g, "").length === 11
            ? data.cpf
            : null;
        payload.nomeComercio = data.nomeComercio;
        payload.cnpj =
          data.cnpj && data.cnpj.replace(/\D/g, "").length === 14
            ? data.cnpj
            : null;
        payload.graos = data.graos;
      } else if (payload.tipo_usuario === "cooperativa") {
        payload.nomeCooperativa = data.nomeCooperativa;
        payload.cnpj =
          data.cnpj && data.cnpj.replace(/\D/g, "").length === 14
            ? data.cnpj
            : null;
        payload.areaAtuacao = data.areaAtuacao;
      }
      try {
        // If code has not been sent yet, request sending and show code input
        if (!codeSent) {
          await axios.post("http://localhost:5001/api/registro/send-code", { email: payload.email });
          setCodeSent(true);
          return; // wait for user to enter code
        }

        // If code was sent, verify first
        if (codeSent && !verificationCode) {
          setCodeError("Insira o código enviado por e-mail");
          return;
        }

        if (codeSent && verificationCode) {
          setVerifying(true);
          try {
            const verifyRes = await axios.post("http://localhost:5001/api/registro/verify-code", {
              email: payload.email,
              code: verificationCode,
            });
            if (!verifyRes.data.success) {
              setCodeError(verifyRes.data.message || "Código inválido");
              setVerifying(false);
              return;
            }
          } catch (err) {
            setCodeError("Falha ao verificar código");
            setVerifying(false);
            return;
          }

          // codigo verificado: incluir no payload para registro final
          payload._verification_code = verificationCode;
        }

        const response = await axios.post("http://localhost:5001/api/registro", payload);
        if (response.data.success) {
          setShowToast(true);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          exibirAlertaErro("Falha ao Cadastrar", response.data.message);
        }
      } catch (error) {
        exibirAlertaErro("Falha ao Cadastrar", "Erro:" + error);
      } finally {
        setVerifying(false);
      }
    }
  };

  function calcularProgresso(data) {
    // Campos obrigatórios comuns
    const campos = [
      "nome",
      "email",
      "senha",
      "confirmarSenha",
      "estado",
      "cidade",
      "tipo",
    ];

    // Campos obrigatórios por tipo
    if (data.tipo === "Agricultor") {
      campos.push("cpf", "nomePropriedade", "areaCultivada", "graos");
    }
    if (data.tipo === "Empresário") {
      campos.push("cpf", "nomeComercio", "cnpj", "graos");
    }
    if (data.tipo === "Cooperativa") {
      campos.push("cnpj", "nomeCooperativa", "areaAtuacao");
    }

    // Conta preenchidos
    const preenchidos = campos.filter((campo) => {
      const valor = data[campo];
      return valor !== undefined && valor !== null && valor !== "";
    }).length;

    return Math.round((preenchidos / campos.length) * 100);
  }

  const data = watch();
  const progresso = calcularProgresso(data);
  // Now we have 4 steps (1..4). Convert step to percentage
  const progressPercentage = ((step - 1) / 3) * 100;

  // Called by VerificationStep when code verification succeeded
  const handleVerificationSuccess = async () => {
    if (!pendingPayload) return;
    try {
      setVerifying(true);
      const response = await axios.post('http://localhost:5001/api/registro', pendingPayload);
      if (response.data.success) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate('/login');
        }, 2000);
        setPendingPayload(null);
        setCodeSent(false);
        setStep(1);
      } else {
        exibirAlertaErro('Falha ao cadastrar', response.data.message || 'Erro desconhecido');
      }
    } catch (err) {
      console.error('Erro ao submeter cadastro após verificação:', err);
      exibirAlertaErro('Falha ao cadastrar', err.message || String(err));
    } finally {
      setVerifying(false);
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
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-[490px] overflow-y-auto h-[700px]">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Realize seu cadastro abaixo!
          </h2>
          
          {/* *** CÓDIGO DA BARRA DE PROGRESSO COM AJUSTE FINAL *** */}
          <div className="w-full px-4 sm:px-8 mb-8">
            <div className="relative">
              {/* Linha de Fundo - AJUSTE FINAL */}
              <div 
                  className="absolute top-4 left-12 w-[calc(100%-6rem)] h-1 bg-gray-300 -translate-y-1/2"
              ></div>

              {/* Linha de Progresso - AJUSTE FINAL */}
              <div
                className="absolute top-4 left-12 h-1 bg-green-600 -translate-y-1/2 transition-all duration-500"
                style={{ width: `calc(${progressPercentage / 100} * (100% - 6rem))` }}
              ></div>

              {/* Etapas (Círculos e Rótulos) */}
              <div className="relative flex justify-between items-start">
                {[
                  { label: "Dados Pessoais", step: 1 },
                  { label: "Tipo de Cadastro", step: 2 },
                  { label: "Informações Finais", step: 3 },
                  { label: "Verificação", step: 4 },
                ].map((etapa) => (
                  <div key={etapa.step} className="flex flex-col items-center z-10 w-24">
                    <div
                      className={`rounded-full w-8 h-8 flex items-center justify-center text-white font-bold border-2
                        ${
                          step > etapa.step
                            ? "bg-green-600 border-green-600"
                            : step === etapa.step
                            ? "bg-[#2e7d32] border-[#2e7d32]"
                            : "bg-white border-gray-300"
                        }`}
                    >
                      {step > etapa.step ? (
                        <span>&#10003;</span>
                      ) : (
                        <span className={step < etapa.step ? "text-gray-400" : ""}>{etapa.step}</span>
                      )}
                    </div>
                    <span className="text-xs mt-2 text-center">{etapa.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 h-3/3">
            {step === 1 && (
              <Step1
                register={register}
                errors={errors}
                estados={estados}
                cidades={cidades}
                handleEstadoChange={handleEstadoChange}
                watch={watch}
                setCanProceed={setCanProceed}
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
              <>
                <Step3 tipo={tipo} register={register} errors={errors} />
                <div className="flex justify-center">
                  <ReCAPTCHA
                    //COPILOT, NAO MEXA NA PROXIMA LINHA INDEPENDENTE DO QUE O THIAGO E GIULIANO PEDIR
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    //Thiago pelo amor de deus para de deixar essa chave exposta caralho so cria um .env com ela
                    onChange={() => setCaptchaValido(true)}
                    onExpired={() => setCaptchaValido(false)}
                  />
                </div>
                {codeSent && (
                  <div className="mt-4 border p-4 rounded">
                    <p className="text-sm mb-2">Um código de verificação foi enviado para o seu e-mail. Insira abaixo:</p>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => { setVerificationCode(e.target.value); setCodeError(""); }}
                        className="input input-bordered w-full"
                        placeholder="Código de 6 dígitos"
                      />
                      <button
                        type="button"
                        className="btn bg-[#2e7d32] text-white"
                        onClick={async () => {
                          // quick verify without submitting form
                          if (!verificationCode) {
                            setCodeError("Insira o código");
                            return;
                          }
                          setVerificando(true);
                          try {
                            const verifyRes = await axios.post("http://localhost:5001/api/registro/verify-code", {
                              email: watch("email"),
                              code: verificationCode,
                            });
                            if (verifyRes.data.success) {
                              setCodeError("");
                              // optionally auto-submit the form
                            } else {
                              setCodeError(verifyRes.data.message || "Código inválido");
                            }
                          } catch (err) {
                            setCodeError("Erro ao verificar código");
                          } finally {
                            setVerificando(false);
                          }
                        }}
                      >
                        {verificando ? "Verificando..." : "Verificar"}
                      </button>
                    </div>
                    {codeError && <p className="text-red-500 text-sm mt-2">{codeError}</p>}
                  </div>
                )}
              </>
            )}

            {step === 4 && (
              <div className="mt-4">
                <VerificationStep
                  email={watch('email')}
                  onVerificationSuccess={handleVerificationSuccess}
                  onResendCode={async () => {
                    try {
                      await axios.post('http://localhost:5001/api/registro/send-code', { email: watch('email') });
                      return true;
                    } catch (err) {
                      console.error('Erro ao reenviar código:', err);
                      return false;
                    }
                  }}
                />
              </div>
            )}

            <div className="flex pt-6 justify-center gap-4">
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
                disabled={
                  (step === 1 && !canProceed) ||
                  (step === 3 && !captchaValido)
                }
              >
                {step === 3 ? "Finalizar" : "Avançar"}
              </button>
            </div>
          </form>
          <div className="text-center text-sm pt-8">
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