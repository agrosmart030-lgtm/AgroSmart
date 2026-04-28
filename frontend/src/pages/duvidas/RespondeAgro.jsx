import React, { useState, useEffect } from "react";
import Navbar from "../../componentes/navbar";
import Footer from "../../componentes/footer";

import {
  FaSearch,
  FaLeaf,
  FaSeedling,
  FaSun,
  FaBug,
  FaInfoCircle,
  FaThumbsUp,
  FaThumbsDown,
  FaGlobeAmericas,
} from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function RespondeAgro() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});

  // Novos estados para integração com a API
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Função central que vai chamar a sua API
  const buscarDuvidas = async () => {
    setIsLoading(true);
    try {
      // ---------------------------------------------------------
      // AQUI ENTRARÁ A CONEXÃO REAL COM SEU BACKEND
      // Exemplo usando fetch apontando para sua rota Express:
      //
      // const url = `http://localhost:5000/api/responde-agro?categoria=${selectedCategory}&busca=${searchTerm}`;
      // const response = await fetch(url);
      // const data = await response.json();
      // setFaqs(data);
      // ---------------------------------------------------------

      console.log(
        `📡 Disparando API -> Categoria: ${selectedCategory} | Busca: "${searchTerm}"`,
      );

      // DADOS MOCKADOS: Isso simula o retorno da API para a tela já funcionar
      // Quando a API estiver pronta, basta apagar este setFaqs abaixo
      setTimeout(() => {
        setFaqs([
          {
            id: 1,
            tag: "Soja",
            iconeTag: <FaLeaf className="mr-2" />,
            corFundo: "bg-[#e8f5e9]",
            corTexto: "text-[#1B4332]",
            pergunta:
              "Qual o melhor período para o plantio da soja no Centro-Oeste?",
            resposta:
              "O período ideal para o plantio da soja no Centro-Oeste brasileiro ocorre geralmente entre outubro e novembro, logo após o início das chuvas regulares. Entretanto, é fundamental consultar o Calendário de Zoneamento Agrícola de Risco Climático (ZARC).",
          },
          {
            id: 2,
            tag: "Milho",
            iconeTag: <FaSeedling className="mr-2" />,
            corFundo: "bg-[#fff8e1]",
            corTexto: "text-[#513700]",
            pergunta:
              "Como identificar e controlar a lagarta-do-cartucho no milho?",
            resposta:
              "A lagarta-do-cartucho é identificada pelo formato de 'Y' invertido na cabeça. O dano principal ocorre no cartucho da planta, onde a lagarta se aloja e consome as folhas.",
          },
        ]);
        setIsLoading(false);
      }, 500); // Simulando um atraso de rede de meio segundo
    } catch (error) {
      console.error("Erro ao buscar dados da Embrapa:", error);
      setIsLoading(false);
    }
  };

  // Dispara a busca automaticamente sempre que o usuário trocar de categoria
  useEffect(() => {
    buscarDuvidas();
  }, [selectedCategory]);

  // Função para lidar com o Enter no teclado na barra de pesquisa
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      buscarDuvidas();
    }
  };

  // Função auxiliar para mudar o visual do botão da categoria selecionada
  const getCategoryClass = (categoria) => {
    const baseClass =
      "flex flex-col items-center justify-center min-w-[120px] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group ";
    if (selectedCategory === categoria) {
      return (
        baseClass +
        "bg-[#1B4332] text-white shadow-xl transform hover:scale-105"
      );
    }
    return (
      baseClass +
      "bg-white border border-[#e1e3e4] text-[#414844] hover:border-[#1B4332] hover:text-[#1B4332]"
    );
  };

  const getIconClass = (categoria) => {
    if (selectedCategory === categoria) return "mb-2 text-white";
    return "mb-2 text-[#717973] group-hover:text-[#1B4332]";
  };

  return (
    <div className="bg-[#f3f4f5] text-[#012d1d] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pb-16">
        {/* Hero Section */}
        <section className="relative min-h-[460px] flex items-center justify-center text-white overflow-hidden">
          <img
            alt="Produtor rural em campo"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(1, 45, 29, 0.5), rgba(27, 67, 50, 0.9))",
            }}
          ></div>
          <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl pt-10">
            <span className="inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold mb-6 tracking-wide border border-white/20 uppercase">
              Espaço do Conhecimento
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-sm">
              Como podemos ajudar você hoje?
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Tire suas dúvidas com a autoridade técnica da Embrapa e leve mais
              produtividade para a sua lida no campo.
            </p>

            {/* Search Bar Conectada aos Estados */}
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-[#717973]">
                <FaSearch size={20} />
              </div>
              <input
                className="block w-full pl-16 pr-32 py-5 rounded-2xl border-none focus:ring-2 focus:ring-[#1B4332] text-[#012d1d] shadow-2xl text-base placeholder:text-[#717973] outline-none"
                placeholder="Ex: época de plantio da soja..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button
                onClick={buscarDuvidas}
                className="absolute right-3 top-3 bottom-3 bg-[#1B4332] text-white px-8 rounded-xl font-semibold hover:bg-[#012d1d] transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-center text-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Buscar"
                )}
              </button>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          {/* CategoryFilters Conectados aos Estados */}
          <section className="mb-16">
            <h2 className="text-center text-[#717973] font-bold uppercase tracking-widest text-xs mb-8">
              Navegue por temas de interesse
            </h2>
            <div
              className="flex flex-nowrap md:flex-wrap md:justify-center gap-4 overflow-x-auto pb-4 px-2"
              style={{ scrollbarWidth: "none" }}
            >
              <button
                onClick={() => setSelectedCategory("Todas")}
                className={getCategoryClass("Todas")}
              >
                <FaGlobeAmericas size={28} className={getIconClass("Todas")} />
                <span className="font-semibold text-sm">Todas</span>
              </button>

              <button
                onClick={() => setSelectedCategory("Plantio")}
                className={getCategoryClass("Plantio")}
              >
                <FaSeedling size={28} className={getIconClass("Plantio")} />
                <span className="font-semibold text-sm">Plantio</span>
              </button>

              <button
                onClick={() => setSelectedCategory("Solo")}
                className={getCategoryClass("Solo")}
              >
                <FaLeaf size={28} className={getIconClass("Solo")} />
                <span className="font-semibold text-sm">Solo</span>
              </button>

              <button
                onClick={() => setSelectedCategory("Clima")}
                className={getCategoryClass("Clima")}
              >
                <FaSun size={28} className={getIconClass("Clima")} />
                <span className="font-semibold text-sm">Clima</span>
              </button>

              <button
                onClick={() => setSelectedCategory("Pragas")}
                className={getCategoryClass("Pragas")}
              >
                <FaBug size={28} className={getIconClass("Pragas")} />
                <span className="font-semibold text-sm">Pragas</span>
              </button>
            </div>
          </section>

          {/* FAQSection Renderizada Dinamicamente */}
          <section className="max-w-4xl mx-auto space-y-6">
            {isLoading && faqs.length === 0 ? (
              <div className="flex justify-center items-center py-10">
                <span className="loading loading-spinner loading-lg text-success"></span>
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center text-[#717973] py-10">
                Nenhuma dúvida encontrada para essa busca.
              </div>
            ) : (
              faqs.map((faq) => (
                <article
                  key={faq.id}
                  className="bg-white border border-[#e1e3e4] rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  <button
                    className="w-full text-left p-8 focus:outline-none flex justify-between items-center group"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div className="pr-8">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full uppercase tracking-widest mb-3 ${faq.corFundo} ${faq.corTexto}`}
                      >
                        {faq.iconeTag} {faq.tag}
                      </span>
                      <h3 className="text-xl md:text-2xl font-extrabold text-[#012d1d] leading-tight group-hover:text-[#1B4332] transition-colors">
                        {faq.pergunta}
                      </h3>
                    </div>
                    <div className="bg-[#f3f4f5] p-2 rounded-full transition-colors group-hover:bg-[#e8f5e9] text-[#717973]">
                      <MdKeyboardArrowDown
                        size={32}
                        className={`transition-transform duration-300 ${activeFaq === faq.id ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${activeFaq === faq.id ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="px-8 pb-8 pt-0 text-[#414844] border-t border-[#e1e3e4]">
                      <p className="mb-6 text-base leading-relaxed mt-4">
                        {faq.resposta}
                      </p>
                      <div className="bg-[#f3f4f5] p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between border border-[#e1e3e4]">
                        <span className="text-sm font-semibold text-[#3e6653] mb-4 md:mb-0 flex items-center">
                          <FaInfoCircle
                            size={20}
                            className="mr-2 text-[#1B4332]"
                          />{" "}
                          Esta orientação técnica foi útil para você?
                        </span>
                        <div className="flex space-x-3 w-full md:w-auto">
                          {feedbackGiven[faq.id] ? (
                            <div className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold ${
                              feedbackGiven[faq.id] === 'yes'
                                ? 'bg-[#e8f5e9] text-[#1B4332] border border-[#c8e6c9]'
                                : 'bg-red-50 text-red-600 border border-red-200'
                            }`}>
                              {feedbackGiven[faq.id] === 'yes' ? <FaThumbsUp /> : <FaThumbsDown />}
                              <span>Obrigado pelo feedback!</span>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => setFeedbackGiven(prev => ({ ...prev, [faq.id]: 'yes' }))}
                                className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-white border border-[#a5d0b8] text-[#3e6653] font-semibold hover:bg-[#3e6653] hover:text-white hover:border-[#3e6653] transition-all shadow-sm text-sm"
                              >
                                <FaThumbsUp /> <span>Sim, ajudou</span>
                              </button>
                              <button
                                onClick={() => setFeedbackGiven(prev => ({ ...prev, [faq.id]: 'no' }))}
                                className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-white border border-red-100 text-[#717973] font-semibold hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm text-sm"
                              >
                                <FaThumbsDown /> <span>Não muito</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
