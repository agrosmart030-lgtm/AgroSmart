import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Exemplo Google reCAPTCHA v2 (teste)
export default function NovoAdmin() {
  const [captchaValido, setCaptchaValido] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!captchaValido) {
      alert("Valide o reCAPTCHA antes de prosseguir");
      return;
    }
    // Adicione aqui a lógica de cadastro de admin
    alert("Cadastro de admin enviado!");
  };
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Adicionar novo Admin</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md bg-white p-6 rounded shadow"
      >
        {/* Campos de cadastro de admin aqui */}
        <div className="mb-4">
          Exemplo de campo:{" "}
          <input
            className="input input-bordered w-full"
            placeholder="Nome do admin"
          />
        </div>
        <ReCAPTCHA
          sitekey={SITE_KEY}
          onChange={() => setCaptchaValido(true)}
          onExpired={() => setCaptchaValido(false)}
        />
        <button type="submit" className="btn btn-primary mt-4">
          Cadastrar Admin
        </button>
      </form>
    </div>
  );
}
