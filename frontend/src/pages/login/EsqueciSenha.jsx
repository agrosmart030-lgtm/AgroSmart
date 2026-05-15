import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../../assets/cadastro.jpg";
import { exibirAlertaErro } from "../../hooks/useAlert";

export default function EsqueciSenha() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/forgot-password",
        { email: data.email }
      );
      if (response.data.success) {
        setEmailEnviado(data.email);
        setEnviado(true);
      } else {
        exibirAlertaErro("Erro", response.data.message || "Não foi possível enviar o código.");
      }
    } catch (error) {
      exibirAlertaErro(
        "Erro",
        error.response?.data?.message || "Não foi possível enviar o e-mail. Verifique o endereço e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f3f4f5] dark:bg-[#0f0f0f]">
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
            Recupere o acesso à sua conta
          </h2>
          <p className="text-white/70 text-base">
            Enviaremos um código de verificação para o seu e-mail cadastrado.
          </p>
        </div>
      </div>

      {/* Área do formulário */}
      <div className="w-full lg:w-2/5 flex justify-center items-center p-8 bg-gradient-to-br from-[#1B4332] to-[#012d1d]">
        <div className="bg-white dark:bg-[#1e1e1e] shadow-sm rounded-2xl p-10 w-full max-w-[460px] border border-[#e1e3e4] dark:border-[#333] flex flex-col">

          {!enviado ? (
            <>
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-[#1B4332] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <h2 className="text-2xl font-extrabold text-[#012d1d] dark:text-white mb-1">
                  Esqueci minha senha
                </h2>
                <p className="text-sm text-[#717973] dark:text-gray-400">
                  Digite seu e-mail cadastrado e enviaremos um código de redefinição.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="relative">
                  <label className="block text-sm font-semibold text-[#414844] dark:text-gray-300 mb-1.5">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className={`w-full px-4 py-3 bg-[#f3f4f5] dark:bg-[#2a2a2a] border rounded-xl text-[#012d1d] dark:text-white text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none transition-all placeholder:text-[#717973] dark:placeholder:text-gray-500 ${
                      errors.email ? "border-red-400" : "border-[#e1e3e4] dark:border-[#444]"
                    }`}
                    {...register("email", {
                      required: "E-mail é obrigatório",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "E-mail inválido",
                      },
                    })}
                  />
                  <p className="text-red-500 text-xs min-h-[1rem] mt-1">
                    {errors.email?.message}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-2 bg-[#FFBA27] text-[#352300] rounded-xl font-bold text-sm hover:bg-[#e5a820] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Enviar código de redefinição"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-[#1B4332]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-extrabold text-[#012d1d] dark:text-white mb-2">
                  Código enviado!
                </h2>
                <p className="text-sm text-[#717973] dark:text-gray-400 leading-relaxed">
                  Enviamos um código de 6 dígitos para{" "}
                  <span className="font-semibold text-[#1B4332] dark:text-[#a5d0b9]">{emailEnviado}</span>.
                  <br />Verifique sua caixa de entrada e spam.
                </p>
              </div>

              <button
                onClick={() => navigate("/redefinir-senha", { state: { email: emailEnviado } })}
                className="w-full py-3 bg-[#1B4332] text-white rounded-xl font-bold text-sm hover:bg-[#012d1d] transition-colors shadow-sm"
              >
                Inserir o código →
              </button>

              <button
                onClick={() => setEnviado(false)}
                className="w-full py-3 mt-3 border border-[#e1e3e4] dark:border-[#444] text-[#414844] dark:text-gray-300 rounded-xl font-semibold text-sm hover:bg-[#f3f4f5] dark:hover:bg-[#2a2a2a] transition-colors"
              >
                Tentar outro e-mail
              </button>
            </>
          )}

          <div className="text-center text-sm border-t border-[#e1e3e4] dark:border-[#333] pt-5 mt-6 text-[#414844] dark:text-gray-400">
            Lembrou a senha?{" "}
            <Link
              to="/login"
              className="text-[#1B4332] dark:text-[#a5d0b9] hover:underline transition-all font-semibold"
            >
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
