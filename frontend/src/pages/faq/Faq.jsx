import React, { useState } from "react";
import Navbar from "../../componentes/navbar";
import Footer from "../../componentes/footer";
import axios from "axios";
import { exibirAlertaErro } from "../../hooks/useAlert";

export default function SuporteAgricola() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [enviado, setEnviado] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/faq", {
        nome: form.name,
        email: form.email,
        mensagem: form.message,
      });
      setEnviado(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setEnviado(false), 3000);
    } catch (err) {
      exibirAlertaErro('Falha ao enviar mensagem', (err.response?.data?.error || err.message));
    }
  };

  const faqData = [
    {
      question: "Como posso entrar em contato?",
      answer:
        "Você pode utilizar o formulário ao lado para enviar sua mensagem diretamente ao nosso suporte.",
      color: "bg-[#e8f5e9]",
      iconColor: "text-[#1B4332]",
    },
    {
      question: "Como funciona o site?",
      answer:
        "Nossa plataforma é de cotação de preços dos grãos em tempo real onde você consegue ver as melhores cooperativas da região.",
      color: "bg-[#fff8e1]",
      iconColor: "text-[#513700]",
    },
    {
      question: "Quanto tempo demora para conseguir uma resposta?",
      answer: "Nosso tempo de resposta tem um prazo de até 2 dias úteis.",
      color: "bg-[#e0f2f1]",
      iconColor: "text-[#004d40]",
    },
    {
      question: "Qual o horário de atendimento?",
      answer: "Nosso atendimento funciona de segunda a sexta, das 8h às 18h.",
      color: "bg-[#e1f5fe]",
      iconColor: "text-[#01579b]",
    },
    {
      question: "Como acompanhar minhas solicitações?",
      answer:
        "Após o envio da mensagem, você receberá um protocolo e poderá acompanhar sua solicitação através do nosso site.",
      color: "bg-[#fce4ec]",
      iconColor: "text-[#880e4f]",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f5]">
      <Navbar isLoggedIn={true} />

      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-[#1B4332] to-[#012d1d] py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold mb-4 tracking-wide border border-white/20 uppercase text-white">
              Suporte
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
              Fale Conosco
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto">
              Envie sua mensagem e nossa equipe retornará o mais breve possível.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#e1e3e4]">
              <h2 className="text-xl font-bold text-[#012d1d] mb-6">
                Envie sua mensagem
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#414844] mb-1.5">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    required
                    className="w-full px-4 py-3 bg-[#f3f4f5] border border-[#e1e3e4] rounded-xl text-[#012d1d] text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none transition-all placeholder:text-[#717973]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#414844] mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Seu e-mail"
                    required
                    className="w-full px-4 py-3 bg-[#f3f4f5] border border-[#e1e3e4] rounded-xl text-[#012d1d] text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none transition-all placeholder:text-[#717973]"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[#414844] mb-1.5">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Escreva sua mensagem"
                    required
                    className="w-full px-4 py-3 bg-[#f3f4f5] border border-[#e1e3e4] rounded-xl text-[#012d1d] text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none transition-all resize-none placeholder:text-[#717973]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1B4332] text-white rounded-xl font-semibold hover:bg-[#012d1d] transition-colors text-sm shadow-sm"
                >
                  Enviar Mensagem
                </button>
                {enviado && (
                  <div className="bg-[#e8f5e9] text-[#1B4332] text-sm font-semibold px-4 py-3 rounded-xl border border-[#c8e6c9] text-center">
                    ✓ Mensagem enviada com sucesso!
                  </div>
                )}
              </form>
            </section>

            {/* FAQ Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#e1e3e4]">
              <h2 className="text-xl font-bold text-[#012d1d] mb-6">
                Perguntas Frequentes
              </h2>

              <div className="space-y-3">
                {faqData.map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl border border-[#e1e3e4] overflow-hidden transition-all ${openFaq === index ? "shadow-md" : ""
                      }`}
                  >
                    <button
                      className="w-full text-left p-5 flex justify-between items-center group hover:bg-[#f8f9fa] transition-colors"
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center shrink-0`}
                        >
                          <span className={`text-sm font-bold ${item.iconColor}`}>
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-[#012d1d] group-hover:text-[#1B4332] transition-colors">
                          {item.question}
                        </span>
                      </div>
                      <span
                        className={`text-[#717973] text-xl transition-transform duration-300 shrink-0 ml-2 ${openFaq === index ? "rotate-45" : ""
                          }`}
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${openFaq === index
                          ? "max-h-[200px] opacity-100"
                          : "max-h-0 opacity-0"
                        }`}
                    >
                      <div className="px-5 pb-5 pt-0">
                        <p className="text-sm text-[#414844] leading-relaxed pl-11">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
