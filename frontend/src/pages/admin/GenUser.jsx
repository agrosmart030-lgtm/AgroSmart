import React, { useEffect, useState } from "react";
import axios from "axios";

export default function GenUser() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/tabelas/tb_usuario"
        );
        setUsuarios(res.data.dados || []);
        setLoading(false);
      } catch {
        setError("Erro ao carregar usuários");
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  if (loading) return <div className="p-8">Carregando usuários...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Usuários</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Nome</th>
              <th className="px-4 py-2 border">E-mail</th>
              <th className="px-4 py-2 border">Tipo</th>
              <th className="px-4 py-2 border">Cidade</th>
              <th className="px-4 py-2 border">Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{u.id}</td>
                <td className="px-4 py-2 border">{u.nome_completo}</td>
                <td className="px-4 py-2 border">{u.email}</td>
                <td className="px-4 py-2 border capitalize">
                  {u.tipo_usuario}
                </td>
                <td className="px-4 py-2 border">{u.cidade}</td>
                <td className="px-4 py-2 border">{u.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
