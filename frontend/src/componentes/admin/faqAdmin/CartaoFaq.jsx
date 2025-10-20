import React from "react";
import { MessageCircle, Calendar, Mail, ChevronDown, ChevronUp } from "lucide-react";

const CartaoFaq = ({ faq, expandido, aoAlternar }) => {
  const formatarData = (data) =>
    new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={aoAlternar}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="font-medium text-gray-900">{faq.nome}</h3>
              <p className="text-sm text-gray-500 flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span>{faq.email}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatarData(faq.data_envio)}</span>
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Nova
            </span>
            {expandido ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>
      {expandido && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="mb-3">
            <h4 className="font-medium text-gray-900 mb-2">Mensagem:</h4>
            <p className="text-gray-700 leading-relaxed">{faq.mensagem}</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
              Responder
            </button>
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
              Marcar como Lida
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
              Excluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartaoFaq;