import React, { useState, useEffect } from "react";
import Navbar from "../../componentes/navbar";
import CartaoFaq from "../../componentes/admin/faqAdmin/CartaoFaq";
import SecaoFiltrosFaq from "../../componentes/admin/faqAdmin/SecaoFiltrosFaq";
import CartoesEstatisticasFaq from "../../componentes/admin/faqAdmin/CartoesEstatisticasFaq";
import { MessageCircle } from "lucide-react";

const PaginaFaqAdmin = () => {
  const [faqs, setFaqs] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [cartaoExpandido, setCartaoExpandido] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("all");
  const [filtroData, setFiltroData] = useState("all");

  useEffect(() => {
    const buscarFaqs = async () => {
      setCarregando(true);
      try {
        const response = await fetch("http://localhost:5001/api/faq");
        const data = await response.json();
        setFaqs(data.faqs);
      } catch (error) {
        console.error("Erro ao buscar FAQs:", error);
        setFaqs([]); // Em caso de erro, define faqs como vazio
      }
      setCarregando(false);
    };
    buscarFaqs();
  }, []);

  const faqsFiltrados = faqs.filter((faq) => {
    const busca = termoBusca.toLowerCase();
    return (
      faq.nome.toLowerCase().includes(busca) ||
      faq.email.toLowerCase().includes(busca) ||
      faq.mensagem.toLowerCase().includes(busca)
    );
    // Adicione lógica de filtro de status/data se desejar
  });

  const alternarCartao = (id) => {
    setCartaoExpandido(cartaoExpandido === id ? null : id);
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-8 pt-28">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando mensagens...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8 pt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Mensagens do FAQ
          </h1>
          <p className="text-gray-600">
            Veja e responda dúvidas enviadas pelos usuários.
          </p>
        </div>
        <CartoesEstatisticasFaq faqs={faqs} />
        <SecaoFiltrosFaq
          termoBusca={termoBusca}
          setTermoBusca={setTermoBusca}
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
          filtroData={filtroData}
          setFiltroData={setFiltroData}
        />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Mostrando {faqsFiltrados.length} de {faqs.length} mensagens
            </h2>
            <div className="flex space-x-2">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
                Exportar
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                Resposta Automática
              </button>
            </div>
          </div>
          <div className="space-y-0">
            {faqsFiltrados.length > 0 ? (
              faqsFiltrados.map((faq) => (
                <CartaoFaq
                  key={faq.id}
                  faq={faq}
                  expandido={cartaoExpandido === faq.id}
                  aoAlternar={() => alternarCartao(faq.id)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma mensagem encontrada.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaFaqAdmin;
