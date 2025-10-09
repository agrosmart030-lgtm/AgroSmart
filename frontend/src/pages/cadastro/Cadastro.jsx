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

export default function cadastro() {
  const [canProceed, setCanProceed] = useState(false);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [captchaValido, setCaptchaValido] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
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
      // Prepare user data for verification
      let tipo = data.tipo;
      if (tipo) {
        tipo = tipo
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase();
      }
      
      const userPayload = {
        nome_completo: data.nome,
        email: data.email,
        senha: data.senha,
        cidade: data.cidade,
        estado: data.estado,
        tipo_usuario: tipo,
        codigo_ibge: null,
      };

      // Add type-specific fields
      if (userPayload.tipo_usuario === "agricultor") {
        userPayload.cpf = data.cpf && data.cpf.replace(/\D/g, "").length === 11 ? data.cpf : null;
        userPayload.nomePropriedade = data.nomePropriedade;
        userPayload.areaCultivada = data.areaCultivada;
        userPayload.graos = data.graos;
      } else if (userPayload.tipo_usuario === "empresario") {
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
        const response = await axios.post('http://localhost:5001/api/send-verification-email', {
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
  const progressPercentage = step === 1 ? 0 : step === 2 ? 33 : step === 3 ? 66 : 100;

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
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-[490px] overflow-y-auto flex flex-col justify-between">
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
                ].filter(etapa => etapa.step <= 4).map((etapa) => (
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
                <div className="flex justify-center">
                  <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={() => setCaptchaValido(true)}
                    onExpired={() => setCaptchaValido(false)}
                  />
                </div>
              </>
            )}
            {step === 4 && userData && (
              <VerificationStep 
                email={userData.email}
                onVerificationSuccess={async () => {
                  try {
                    // Validate required fields
                    const requiredFields = {
                      'nome_completo': 'Nome completo',
                      'email': 'E-mail',
                      'senha': 'Senha',
                      'cidade': 'Cidade',
                      'estado': 'Estado',
                      'cpf': 'CPF',
                      'tipo_usuario': 'Tipo de usuário'
                    };

                    // Check for missing required fields
                    const missingFields = [];
                    for (const [field, label] of Object.entries(requiredFields)) {
                      if (!userData[field]) {
                        missingFields.push(label);
                      }
                    }

                    if (missingFields.length > 0) {
                      throw new Error(`Por favor, preencha os seguintes campos obrigatórios: ${missingFields.join(', ')}`);
                    }

                    // Prepare the data with default values for optional fields
                    const registrationData = {
                      nome_completo: userData.nome_completo || '',
                      email: userData.email || '',
                      senha: userData.senha || '',
                      cidade: userData.cidade || '',
                      estado: userData.estado || '',
                      tipo_usuario: userData.tipo_usuario || '',
                      codigo_ibge: userData.codigo_ibge || null,
                      cpf: userData.cpf || '',
                      // Fields specific to agricultor
                      nomePropriedade: userData.tipo_usuario === 'agricultor' ? (userData.nomePropriedade || '') : undefined,
                      areaCultivada: userData.tipo_usuario === 'agricultor' ? (userData.areaCultivada || '') : undefined,
                      graos: userData.tipo_usuario === 'agricultor' ? (userData.graos || '') : undefined,
                      // Fields specific to empresario
                      nomeComercio: userData.tipo_usuario === 'empresario' ? (userData.nomeComercio || '') : undefined,
                      cnpj: userData.tipo_usuario === 'empresario' ? (userData.cnpj || '') : undefined,
                      // Fields specific to cooperativa
                      nomeCooperativa: userData.tipo_usuario === 'cooperativa' ? (userData.nomeCooperativa || '') : undefined,
                      areaAtuacao: userData.tipo_usuario === 'cooperativa' ? (userData.areaAtuacao || '') : undefined
                    };

                    // Additional validation based on user type
                    if (registrationData.tipo_usuario === 'agricultor') {
                      if (!registrationData.nomePropriedade) {
                        throw new Error('Por favor, informe o nome da propriedade');
                      }
                      if (!registrationData.areaCultivada) {
                        throw new Error('Por favor, informe a área cultivada');
                      }
                    }

                    console.log('Sending registration data:', registrationData);
                    
                    const response = await axios.post(
                      'http://localhost:5001/api/registro',
                      registrationData,
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
                    exibirAlertaErro("Erro", error.message || "Falha ao finalizar o cadastro. Tente novamente.");
                    setStep(3);
                  }
                }}
                onResendCode={async () => {
                  const response = await axios.post('http://localhost:5001/api/send-verification-email', {
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
                className={`btn btn-outline ${step === 1 || step === 4 ? "invisible" : ""}`}
                disabled={step === 1 || step === 4}
              >
                Voltar
              </button>
              {step < 4 ? (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!canProceed && step === 1}
                >
                  {step === 3 ? "Verificar E-mail" : "Próximo"}
                </button>
              ) : null}
            </div>
          </form>
          <div className="text-center text-sm pt-8">
            Já tem uma conta?{' '}
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