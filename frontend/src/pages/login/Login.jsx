import axios from "axios";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import loginImg from "../../assets/cadastro.jpg";
import eyeOff from "../../assets/eye-off.svg";
import eye from "../../assets/eye.svg";
import { useAuth } from "../../hooks/context/AuthContext";
import { exibirAlertaErro } from "../../hooks/useAlert";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  useEffect(() => {
    // limpa token ao montar
    setRecaptchaToken(null);
  }, []);
  const [showSenha, setShowSenha] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      // inclui token do reCAPTCHA no payload (se existir)
      const payload = {
        email: data.email,
        senha: data.senha,
        recaptchaToken: recaptchaToken,
      };
      const response = await axios.post(
        "http://localhost:5001/api/login",
        payload
      );
      if (response.data.success) {
        login(response.data.usuario, response.data.token);
        if (response.data.tipo_usuario === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        exibirAlertaErro(
          "Senha ou Email errados !",
          "Confira novamente suas informações."
        );
      }
    } catch (error) {
      exibirAlertaErro(
        "Falha ao fazer login",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#f3f4f5]">
      {/* Imagem lateral */}
      <div className="hidden lg:block w-3/5 relative overflow-hidden">
        <img
          src={loginImg}
          alt="Campo agrícola"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#012d1d]/60 to-transparent"></div>
        <div className="absolute bottom-12 left-12 z-10 max-w-md">
          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            O Futuro do Agronegócio é Inteligente
          </h2>
          <p className="text-white/70 text-base">
            Transformamos dados complexos em decisões de excelência para o campo.
          </p>
        </div>
      </div>

      {/* Área do formulário */}
      <div className="w-full lg:w-2/5 flex justify-center items-center p-8 bg-gradient-to-br from-[#1B4332] to-[#012d1d]">
        <div className="bg-white shadow-sm rounded-2xl p-10 w-full max-w-[460px] border border-[#e1e3e4] flex flex-col">
          <div className="flex-1">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-[#1B4332] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <img src="/Vector.svg" alt="AgroSmart" className="w-6 h-6 brightness-0 invert" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#012d1d] mb-1">
                Bem-vindo de volta!
              </h2>
              <p className="text-sm text-[#717973]">
                Acesse sua conta para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                type={showSenha ? "text" : "password"}
                register={register}
                errors={errors}
                showToggle={true}
                isVisible={showSenha}
                onToggle={() => setShowSenha((prev) => !prev)}
              />
              {/* ReCAPTCHA - renderiza somente se a site key estiver configurada */}
              {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
                <div className="flex justify-center mt-2">
                  <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={(token) => setRecaptchaToken(token)}
                  />
                </div>
              ) : null}
              <button
                type="submit"
                className="w-full py-3 mt-2 bg-[#FFBA27] text-[#352300] rounded-xl font-bold text-sm hover:bg-[#e5a820] transition-colors shadow-sm"
                disabled={
                  Boolean(import.meta.env.VITE_RECAPTCHA_SITE_KEY) &&
                  !recaptchaToken
                }
              >
                Entrar
              </button>
            </form>
          </div>

          <div className="text-center text-sm border-t border-[#e1e3e4] pt-5 mt-6 text-[#414844]">
            Ainda não tem conta?{" "}
            <a
              href="/cadastro"
              className="text-[#1B4332] hover:underline transition-all font-semibold"
            >
              Cadastre-se
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const InputField = ({
  label,
  name,
  register,
  errors,
  type = "text",
  showToggle = false,
  isVisible,
  onToggle,
}) => {
  const inputType = showToggle ? (isVisible ? "text" : "password") : type;

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-[#414844] mb-1.5">
        {label}
      </label>
      <input
        type={inputType}
        placeholder={label}
        className={`w-full px-4 py-3 bg-[#f3f4f5] border rounded-xl text-[#012d1d] text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none transition-all placeholder:text-[#717973] ${
          errors[name] ? "border-red-400" : "border-[#e1e3e4]"
        }`}
        {...register(name, { required: `${label} é obrigatório` })}
      />
      {showToggle && (
        <button
          type="button"
          className="absolute right-3 top-[38px]"
          onClick={onToggle}
        >
          <img
            src={isVisible ? eye : eyeOff}
            alt="Toggle Senha"
            className="w-5 h-5 opacity-50 hover:opacity-100 transition"
          />
        </button>
      )}
      <p className="text-red-500 text-xs min-h-[1rem] mt-1">
        {errors[name]?.message}
      </p>
    </div>
  );
};
