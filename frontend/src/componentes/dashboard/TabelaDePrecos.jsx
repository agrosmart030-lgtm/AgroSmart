// src/componentes/dashboard/TabelaDePrecos.jsx
import React from 'react';

const TabelaDePrecos = ({ produtos }) => (
    <div className="w-full">
        <table className="w-full text-left">
            <thead>
                <tr className="border-b border-gray-200">
                    <th className="p-3 text-sm font-semibold text-gray-500">Produto</th>
                    <th className="p-3 text-sm font-semibold text-gray-500 text-right">Preço (saca 60kg)</th>
                    <th className="p-3 text-sm font-semibold text-gray-500 text-center">Variação (24h)</th>
                </tr>
            </thead>
            <tbody>
                {produtos.length > 0 ? produtos.map((produto) => (
                    <tr key={produto.nome} className="border-b border-gray-200 last:border-none">
                        <td className="p-4 font-bold text-lg text-gray-800">{produto.nome}</td>
                        <td className="p-4 font-semibold text-2xl text-gray-900 text-right">{produto.preco}</td>
                        <td className="p-4 text-center">
                            <span className={`px-3 py-1 text-base rounded-md font-semibold ${
                                produto.variacao.startsWith('+') 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                                {produto.variacao}
                            </span>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="3" className="p-8 text-center text-gray-500">
                            Nenhum produto encontrado para esta pesquisa.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

// A linha abaixo é crucial para que o componente possa ser importado em outros arquivos.
export default TabelaDePrecos;