import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import loginImg from "../../assets/cadastro.jpg";
import eye from "../../assets/eye.svg";
import eyeOff from "../../assets/eye-off.svg";
import { exibirAlertaErro } from "../../hooks/useAlert";

export default function RedefinirSenha() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailRecuperado = location.state?.email || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { email: emailRecuperado } });

  const [loading, setLoading] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Acompanha a senha em tempo real para os requisitos
  const senhaAtual = watch("novaSenha") || "";
  const requisitos = [
    { id: "maiuscula", texto: "Letra maiúscula (A-Z)", valido: /[A-Z]/.test(senhaAtual) },
    { id: "minuscula", texto: "Letra minúscula (a-z)", valido: /[a-z]/.test(senhaAtual) },
    { id: "numero",   texto: "Número (0-9)",          valido: /[0-9]/.test(senhaAtual) },
    { id: "especial", texto: "Símbolo (!@#$%...)",    valido: /[!@#$%^&*(),.?":{}|<>_\-/]/.test(senhaAtual) },
    { id: "tamanho",  texto: "Mínimo 8 caracteres",   valido: senhaAtual.length >= 8 },
  ];
  const requisitosOk = requisitos.every((r) => r.valido);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/reset-password",
        {
          email: data.email,
          code: data.code,
          novaSenha: data.novaSenha,
        }
      );
      if (response.data.success) {
        setSucesso(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        exibirAlertaErro("Erro", response.data.message || "Código inválido ou expirado.");
      }
    } catch (error) {
      exibirAlertaErro(
        "Erro",
        error.response?.data?.message || "Não foi possível redefinir a senha. Tente novamente."
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
            Crie uma nova senha segura
          </h2>
          <p className="text-white/70 text-base">
            Digite o código recebido no seu e-mail e defina uma nova senha de acesso.
          </p>
        </div>
      </div>

      {/* Área do formulário */}
      <div className="w-full lg:w-2/5 flex justify-center items-center p-8 bg-gradient-to-br from-[#1B4332] to-[#012d1d]">
        <div className="bg-white dark:bg-[#1e1e1e] shadow-sm rounded-2xl p-10 w-full max-w-[460px] border border-[#e1e3e4] dark:border-[#333] flex flex-col">

          {!sucesso ? (
            <>
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-[#1B4332] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-extrabold text-[#012d1d] dark:text-white mb-1">
                  Redefinir senha
                </h2>
                <p className="text-sm text-[#717973] dark:text-gray-400">
                  Digite o código enviado para{" "}
                  <span className="font-semibold text-[#1B4332] dark:text-[#a5d0b9]">
                    {emailRecuperado || "seu e-mail"}
                  </span>
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Campo e-mail (editável caso não tenha vindo via state) */}
                {!emailRecuperado && (
                  <div className="relative">
                    <label className="block text-sm font-semibold text-[#414844] dark:text-gray-300 mb-1.5">E-mail</label>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      className={`w-full px-4 py-3 bg-[#f3f4f5] dark:bg-[#2a2a2a] border rounded-xl text-[#012d1d] dark:text-white text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none transition-all placeholder:text-[#717973] dark:placeholder:text-gray-500 ${errors.email ? "border-red-400" : "border-[#e1e3e4] dark:border-[#444]"}`}
                      {...register("email", { required: "E-mail é obrigatório" })}
                    />
                    <p className="text-red-500 text-xs min-h-[1rem] mt-1">{errors.email?.message}</p>
                  </div>
                )}

                {/* Código de verificação */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-[#414844] dark:text-gray-300 mb-1.5">
                    Código de verificação
                  </label>
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className={`w-full px-4 py-3 bg-[#f3f4f5] dark:bg-[#2a2a2a] border rounded-xl text-[#012d1d] dark:text-white text-sm text-center tracking-[0.5em] font-bold focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none transition-all placeholder:text-[#717973] placeholder:tracking-normal dark:placeholder:text-gray-500 ${errors.code ? "border-red-400" : "border-[#e1e3e4] dark:border-[#444]"}`}
                    {...register("code", {
                      required: "Código é obrigatório",
                      minLength: { value: 6, message: "O código tem 6 dígitos" },
                      maxLength: { value: 6, message: "O código tem 6 dígitos" },
                    })}
                  />
                  <p className="text-red-500 text-xs min-h-[1rem] mt-1">{errors.code?.message}</p>
                </div>

                {/* Nova senha */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-[#414844] dark:text-gray-300 mb-1.5">
                    Nova senha
                  </label>
                  <input
                    type={showSenha ? "text" : "password"}
                    placeholder="Min. 8 caracteres"
                    className={`w-full px-4 py-3 pr-10 bg-[#f3f4f5] dark:bg-[#2a2a2a] border rounded-xl text-[#012d1d] dark:text-white text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none transition-all placeholder:text-[#717973] dark:placeholder:text-gray-500 ${errors.novaSenha ? "border-red-400" : "border-[#e1e3e4] dark:border-[#444]"}`}
                    {...register("novaSenha", {
                      required: "Nova senha é obrigatória",
                      validate: () => requisitosOk || "A senha não atende todos os requisitos",
                    })}
                  />
                  <button type="button" className="absolute right-3 top-[38px]" onClick={() => setShowSenha(p => !p)}>
                    <img src={showSenha ? eye : eyeOff} alt="Toggle" className="w-5 h-5 opacity-50 hover:opacity-100 transition" />
                  </button>
                  <p className="text-red-500 text-xs min-h-[1rem] mt-1">{errors.novaSenha?.message}</p>

                  {/* Indicadores de requisitos — aparecem enquanto digita e algum não foi atendido */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      senhaAtual.length > 0 && !requisitosOk
                        ? "opacity-100 max-h-48 mt-2"
                        : "opacity-0 max-h-0"
                    }`}
                  >
                    <p className="text-xs font-semibold text-[#414844] dark:text-gray-300 mb-1">Sua senha deve conter:</p>
                    <ul className="space-y-0.5">
                      {requisitos.map((r) => (
                        <li
                          key={r.id}
                          className={`text-xs flex items-center gap-1.5 transition-colors ${
                            r.valido ? "text-green-600 dark:text-green-400" : "text-red-500"
                          }`}
                        >
                          <span>{r.valido ? "✓" : "✗"}</span>
                          {r.texto}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Confirmar nova senha */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-[#414844] dark:text-gray-300 mb-1.5">
                    Confirmar nova senha
                  </label>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repita a senha"
                    className={`w-full px-4 py-3 pr-10 bg-[#f3f4f5] dark:bg-[#2a2a2a] border rounded-xl text-[#012d1d] dark:text-white text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none transition-all placeholder:text-[#717973] dark:placeholder:text-gray-500 ${errors.confirmarSenha ? "border-red-400" : "border-[#e1e3e4] dark:border-[#444]"}`}
                    {...register("confirmarSenha", {
                      required: "Confirmação é obrigatória",
                      validate: (v) => v === watch("novaSenha") || "As senhas não coincidem",
                    })}
                  />
                  <button type="button" className="absolute right-3 top-[38px]" onClick={() => setShowConfirm(p => !p)}>
                    <img src={showConfirm ? eye : eyeOff} alt="Toggle" className="w-5 h-5 opacity-50 hover:opacity-100 transition" />
                  </button>
                  <p className="text-red-500 text-xs min-h-[1rem] mt-1">{errors.confirmarSenha?.message}</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-2 bg-[#FFBA27] text-[#352300] rounded-xl font-bold text-sm hover:bg-[#e5a820] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Redefinindo..." : "Redefinir senha"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-[#1B4332]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-[#012d1d] dark:text-white mb-2">Senha redefinida!</h2>
              <p className="text-sm text-[#717973] dark:text-gray-400">
                Sua senha foi alterada com sucesso. Redirecionando para o login...
              </p>
              <div className="mt-6 w-full h-1 bg-[#e1e3e4] dark:bg-[#333] rounded-full overflow-hidden">
                <div className="h-full bg-[#1B4332] animate-[progress_3s_linear]" style={{ width: "100%" }} />
              </div>
            </div>
          )}

          <div className="text-center text-sm border-t border-[#e1e3e4] dark:border-[#333] pt-5 mt-6 text-[#414844] dark:text-gray-400">
            <Link
              to="/esqueci-senha"
              className="text-[#1B4332] dark:text-[#a5d0b9] hover:underline transition-all font-semibold"
            >
              ← Reenviar código
            </Link>
            <span className="mx-3 text-[#e1e3e4]">|</span>
            <Link
              to="/login"
              className="text-[#1B4332] dark:text-[#a5d0b9] hover:underline transition-all font-semibold"
            >
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
