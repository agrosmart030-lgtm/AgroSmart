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
        login(response.data.usuario);
        navigate("/dashboard");
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
    <div className="flex h-screen">
      {/* Imagem lateral */}
      <div
        className="w-3/5 bg-cover bg-center shadow-md"
        style={{ backgroundImage: `url(${loginImg})` }}
      ></div>

      {/* Área do formulário */}
      <div className="w-2/5 bg-[#2e7d32] flex justify-center items-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-[450px] h-[500px] flex flex-col justify-between">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold mb-4 text-[#2e7d32]">
              Bem-vindo de volta!
            </h2>
            <p className="text-sm text-gray-500 mb-12">
              Acesse sua conta para continuar
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 text-left"
            >
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
                isVisible={showSenha}
                onToggle={() => setShowSenha((prev) => !prev)}
              />
              {/* ReCAPTCHA - renderiza somente se a site key estiver configurada */}
              {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
                <div className="pt-2">
                  <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={(token) => setRecaptchaToken(token)}
                  />
                </div>
              ) : null}
              <button
                type="submit"
                className="btn w-full mt-4 bg-[#ffc107] text-black hover:brightness-110"
                disabled={
                  Boolean(import.meta.env.VITE_RECAPTCHA_SITE_KEY) &&
                  !recaptchaToken
                }
              >
                Entrar
              </button>
            </form>
          </div>

          <div className="text-center text-sm pt-4">
            Ainda não tem conta?{" "}
            <a
              href="/cadastro"
              className="text-primary hover:underline transition-all"
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
      <input
        type={inputType}
        placeholder={label}
        className={`input input-bordered w-full pr-10 ${
          errors[name] ? "border-error" : ""
        }`}
        {...register(name, { required: `${label} é obrigatório` })}
      />
      {showToggle && (
        <button
          type="button"
          className="absolute right-2 top-2.5"
          onClick={onToggle}
        >
          <img
            src={isVisible ? eye : eyeOff}
            alt="Toggle Senha"
            className="w-5 h-5 opacity-70 hover:opacity-100 transition"
          />
        </button>
      )}
      <p className="text-error text-xs min-h-[1rem] mt-1">
        {errors[name]?.message}
      </p>
    </div>
  );
};
