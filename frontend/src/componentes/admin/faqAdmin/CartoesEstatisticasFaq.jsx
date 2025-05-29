import React from "react";
import { MessageCircle, Plus, Calendar, User } from "lucide-react";

const CartoesEstatisticasFaq = ({ faqs }) => {
  const total = faqs.length;
  const pendentes = faqs.filter((faq) => faq.pendentes).length;
  const respondidas = faqs.filter((faq) => faq.respondida).length;
  const novasHoje = faqs.filter((faq) => {
    const hoje = new Date();
    const dataFaq = new Date(faq.data_envio);
    return dataFaq.toDateString() === hoje.toDateString();
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total de Mensagens</p>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </div>
          <MessageCircle className="h-8 w-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Novas Hoje</p>
            <p className="text-2xl font-bold text-green-600">{novasHoje}</p>
          </div>
          <Plus className="h-8 w-8 text-green-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">{pendentes}</p>
          </div>
          <Calendar className="h-8 w-8 text-yellow-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Respondidas</p>
            <p className="text-2xl font-bold text-purple-600">{respondidas}</p>
          </div>
          <User className="h-8 w-8 text-purple-500" />
        </div>
      </div>
    </div>
  );
};

export default CartoesEstatisticasFaq;
