import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/context/AuthContext";
import background1 from "../../assets/background1.jpg";
import { exibirAlertaErro } from "../../hooks/useAlert";

export default function LoginAdmin() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/login/admin",
        {
          nome,
          senha,
        }
      );
      if (response.data.success) {
        login({ ...response.data.admin, tipo_usuario: "admin" });
        navigate("/admin");
      } else {
        exibirAlertaErro('Falha ao fazer login', "Consulte suas credenciais novamente");
      }
    } catch (error) {
      exibirAlertaErro('Falha ao fazer login', (error.response?.data?.message || error.message));
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
      style={{ backgroundImage: `url(${background1})` }}
    >
      <h1 className="text-4xl text-gray-200 font-bold mb-6">Login Admin</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Usuário
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Usuário"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Senha
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Entrar
          </button>
          <Link
            to="/"
            className="ml-2 text-green-700 hover:underline font-semibold"
          >
            Voltar ao início
          </Link>
        </div>
      </form>
    </div>
  );
}
