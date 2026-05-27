import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import cadastroImg from "../../assets/cadastro.jpg";
import Step1 from "../../componentes/cadastro/step1";
import Step2 from "../../componentes/cadastro/step2";
import Step3 from "../../componentes/cadastro/step3";
import VerificationStep from "../../componentes/cadastro/VerificationStep";
import { exibirAlertaErro } from "../../hooks/useAlert";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../../services/api";

export default function cadastro() {
  const captchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const captchaEnabled = Boolean(captchaSiteKey);
  const [canProceed, setCanProceed] = useState(false);
  const [estados, setEstados] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [captchaValido, setCaptchaValido] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [userData, setUserData] = useState(null);
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

  useEffect(() => {
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => setEstados(res.data))
      .catch((err) => console.error("Erro ao carregar estados:", err));
  }, []);

  const nextStep = async () => {
    const isFormValid = await trigger();
    if (isFormValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data) => {
    const valid = await trigger();
    if (!valid) return;
    
    if (step === 3 && captchaEnabled && !captchaValido) {
      exibirAlertaErro("Valide o reCAPTCHA antes de prosseguir");
      return;
    }

    if (step < 3) {
      nextStep();
    } else if (step === 3) {
      // Prepare user data for verification
      let tipo = data.tipo;
      if (tipo) {
        tipo = tipo
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase();
      }
      
      // Get the selected estado and cidade objects
      const selectedEstado = data.estado ? estados.find(e => e.sigla === data.estado) : null;
      const selectedCidade = data.cidade && data.cidade_nome ? {
        id: data.cidade,
        nome: data.cidade_nome
      } : null;
      
      if (!selectedEstado || !selectedCidade) {
        exibirAlertaErro("Erro", "Por favor, selecione um estado e uma cidade válidos");
        return;
      }
      
      // Create the user payload with all necessary data
      const userPayload = {
        nome_completo: data.nome,
        email: data.email,
        senha: data.senha,
        cidade: selectedCidade.nome,
        estado: selectedEstado.nome,
        tipo_usuario: tipo,
        codigo_ibge: selectedCidade.id,
        recaptchaToken,
      };

      // Add type-specific fields
      if (tipo === "agricultor") {
        userPayload.cpf = data.cpf && data.cpf.replace(/\D/g, "").length === 11 ? data.cpf : null;
        userPayload.nomePropriedade = data.nomePropriedade;
        userPayload.areaCultivada = data.areaCultivada;
        userPayload.graos = data.graos;
      } else if (tipo === "empresario") {
        userPayload.cpf = data.cpf && data.cpf.replace(/\D/g, "").length === 11 ? data.cpf : null;
        userPayload.nomeComercio = data.nomeComercio;
        userPayload.cnpj = data.cnpj && data.cnpj.replace(/\D/g, "").length === 14 ? data.cnpj : null;
        userPayload.graos = data.graos;
      } else if (userPayload.tipo_usuario === "cooperativa") {
        userPayload.nomeCooperativa = data.nomeCooperativa;
        userPayload.cnpj = data.cnpj && data.cnpj.replace(/\D/g, "").length === 14 ? data.cnpj : null;
        userPayload.areaAtuacao = data.areaAtuacao;
      }

      try {
        // First, send verification email
        const response = await api.post('/api/send-verification-email', {
          email: userPayload.email,
          nome: userPayload.nome_completo
        });

        if (response.data.success) {
          // Save user data for final registration after verification
          setUserData(userPayload);
          // Move to verification step
          nextStep();
        } else {
          exibirAlertaErro("Erro", "Falha ao enviar o código de verificação. Tente novamente.");
        }
      } catch (error) {
        console.error("Verification email error:", error);
        exibirAlertaErro("Erro", "Não foi possível enviar o código de verificação. Tente novamente mais tarde.");
      }
    }
  };

  const progressPercentage = step === 1 ? 0 : step === 2 ? 33 : step === 3 ? 66 : 100;

  return (
    <div className="flex min-h-screen bg-[#f3f4f5]">
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-[#e8f5e9] text-[#1B4332] font-semibold text-sm px-6 py-3 rounded-xl border border-[#c8e6c9] shadow-lg">
            ✓ Cadastro realizado com sucesso!
          </div>
        </div>
      )}

      {/* Imagem lateral */}
      <div className="hidden lg:block w-3/5 relative overflow-hidden">
        <img
          src={cadastroImg}
          alt="Campo agrícola"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#012d1d]/60 to-transparent"></div>
        <div className="absolute bottom-12 left-12 z-10 max-w-md">
          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Junte-se à revolução do agro inteligente
          </h2>
          <p className="text-white/70 text-base">
            Crie sua conta e tenha acesso a cotações em tempo real, previsões climáticas e muito mais.
          </p>
        </div>
      </div>

      {/* Área do formulário */}
      <div className="w-full lg:w-2/5 flex justify-center items-center p-4 sm:p-6 overflow-y-auto bg-gradient-to-br from-[#1B4332] to-[#012d1d]">
        <div className="bg-white shadow-sm rounded-2xl p-5 sm:p-8 w-full max-w-[490px] border border-[#e1e3e4] flex flex-col justify-between">
          <h2 className="text-xl font-bold mb-5 text-center text-[#012d1d]">
            Realize seu cadastro abaixo!
          </h2>
          
          {/* Progress Bar */}
          <div className="w-full px-4 sm:px-8 mb-8">
            <div className="relative">
              {/* Background Line */}
              <div 
                  className="absolute top-4 left-12 w-[calc(100%-6rem)] h-1 bg-[#e1e3e4] -translate-y-1/2"
              ></div>

              {/* Progress Line */}
              <div
                className="absolute top-4 left-12 h-1 bg-[#1B4332] -translate-y-1/2 transition-all duration-500"
                style={{ width: `calc(${progressPercentage / 100} * (100% - 6rem))` }}
              ></div>

              {/* Steps */}
              <div className="relative flex justify-between items-start">
                {[
                  { label: "Dados Pessoais", step: 1 },
                  { label: "Tipo de Cadastro", step: 2 },
                  { label: "Informações Finais", step: 3 },
                  { label: "Verificação", step: 4 },
                ].filter(etapa => etapa.step <= 4).map((etapa) => (
                  <div key={etapa.step} className="flex flex-col items-center z-10 w-24">
                    <div
                      className={`rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 text-sm
                        ${
                          step > etapa.step
                            ? "bg-[#1B4332] border-[#1B4332] text-white"
                            : step === etapa.step
                            ? "bg-[#1B4332] border-[#1B4332] text-white"
                            : "bg-white border-[#e1e3e4] text-[#717973]"
                        }`}
                    >
                      {step > etapa.step ? (
                        <span>&#10003;</span>
                      ) : (
                        <span>{etapa.step}</span>
                      )}
                    </div>
                    <span className="text-xs mt-2 text-center text-[#414844]">{etapa.label}</span>
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
                watch={watch}
                setCanProceed={setCanProceed}
                setValue={setValue}
              />
            )}
            {step === 2 && (
              <Step2
                selectedTipo={selectedTipo}
                setSelectedTipo={setSelectedTipo}
                setValue={setValue}
                errors={errors}
                register={register}
              />
            )}
            {step === 3 && (
              <>
                <Step3
                  tipo={selectedTipo}
                  register={register}
                  errors={errors}
                />
                {captchaEnabled ? (
                  <div className="flex justify-center min-h-[78px] overflow-hidden">
                    <ReCAPTCHA
                      sitekey={captchaSiteKey}
                      onChange={(token) => {
                        setRecaptchaToken(token);
                        setCaptchaValido(Boolean(token));
                      }}
                      onExpired={() => {
                        setRecaptchaToken(null);
                        setCaptchaValido(false);
                      }}
                      onErrored={() => {
                        setRecaptchaToken(null);
                        setCaptchaValido(false);
                      }}
                      className="origin-center scale-[0.88] sm:scale-100"
                    />
                  </div>
                ) : null}
              </>
            )}
            {step === 4 && userData && (
              <VerificationStep 
                email={userData.email}
                onVerificationSuccess={async () => {
                  try {
                    // Get the latest form data
                    const formData = watch();
                    
                    // Merge form data with userData, prioritizing form data
                    const completeUserData = {
                      ...userData,
                      cidade: formData.cidade || userData.cidade,
                      estado: formData.estado || userData.estado,
                      // Include other fields that might be needed
                      ...(userData.tipo_usuario === 'agricultor' && {
                        nomePropriedade: formData.nomePropriedade || userData.nomePropriedade,
                        areaCultivada: formData.areaCultivada || userData.areaCultivada,
                        graos: formData.graos || userData.graos
                      })
                    };

                    // Debug log
                    console.log('Complete user data:', completeUserData);

                    // Validate required fields
                    const requiredFields = {
                      'nome_completo': 'Nome completo',
                      'email': 'E-mail',
                      'senha': 'Senha',
                      'cidade': 'Cidade',
                      'estado': 'Estado',
                      'tipo_usuario': 'Tipo de usuário'
                    };

                    // Only require CPF for agricultor and empresario
                    if (['agricultor', 'empresario'].includes(completeUserData.tipo_usuario)) {
                      requiredFields.cpf = 'CPF';
                    }

                    // Check for missing required fields
                    const missingFields = [];
                    for (const [field, label] of Object.entries(requiredFields)) {
                      if (!completeUserData[field]) {
                        console.error(`Missing field: ${field}`);
                        missingFields.push(label);
                      }
                    }

                    if (missingFields.length > 0) {
                      throw new Error(`Por favor, preencha os seguintes campos obrigatórios: ${missingFields.join(', ')}`);
                    }

                    // Additional validation for agricultor
                    if (completeUserData.tipo_usuario === 'agricultor') {
                      if (!completeUserData.nomePropriedade) {
                        throw new Error('Por favor, informe o nome da propriedade');
                      }
                      if (!completeUserData.areaCultivada) {
                        throw new Error('Por favor, informe a área cultivada');
                      }
                    }

                    console.log('Sending registration data:', completeUserData);
                    
                    const response = await api.post(
                      '/api/registro',
                      completeUserData,
                      {
                        validateStatus: (status) => status < 500 // Don't throw for 4xx errors
                      }
                    );

                    if (response.status === 400) {
                      throw new Error(response.data.message || 'Dados inválidos. Por favor, verifique as informações fornecidas.');
                    }
                    
                    if (response.data.success) {
                      setShowToast(true);
                      setTimeout(() => {
                        navigate("/login");
                      }, 2000);
                    } else {
                      exibirAlertaErro("Falha ao Cadastrar", response.data.message || 'Erro desconhecido ao cadastrar');
                      setStep(3);
                    }
                  } catch (error) {
                    console.error("Registration error:", error);
                    if (error.response?.data?.message?.toLowerCase().includes("recaptcha")) {
                      setRecaptchaToken(null);
                      setCaptchaValido(false);
                    }
                    exibirAlertaErro("Erro", error.message || "Falha ao finalizar o cadastro. Tente novamente.");
                    setStep(3);
                  }
                }}
                onResendCode={async () => {
                  const response = await api.post('/api/send-verification-email', {
                    email: userData.email,
                    nome: userData.nome_completo
                  });
                  return response.data;
                }}
              />
            )}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className={`px-6 py-2.5 rounded-xl border border-[#e1e3e4] text-[#414844] font-semibold text-sm hover:bg-[#f3f4f5] transition-colors ${step === 1 || step === 4 ? "invisible" : ""}`}
                disabled={step === 1 || step === 4}
              >
                Voltar
              </button>
              {step < 4 ? (
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1B4332] text-white font-semibold text-sm hover:bg-[#012d1d] transition-colors shadow-sm"
                  disabled={!canProceed && step === 1}
                >
                  {step === 3 ? "Verificar E-mail" : "Próximo"}
                </button>
              ) : null}
            </div>
          </form>
          <div className="text-center text-sm pt-6 text-[#414844]">
            Já tem uma conta?{' '}
            <a
              href="/login"
              className="text-[#1B4332] hover:underline transition-all font-semibold"
            >
              Faça login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
