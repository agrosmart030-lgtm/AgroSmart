import React, { useState } from "react";
import Navbar from "../../componentes/navbar";
import Footer from "../../componentes/footer";
import axios from "axios";

export default function SuporteAgricola() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [enviado, setEnviado] = useState(false);

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
      alert(
        "Erro ao enviar mensagem: " + (err.response?.data?.error || err.message)
      );
    }
  };

  const faqData = [
    {
      question: "Como posso entrar em contato?",
      answer:
        "Você pode utilizar o formulário acima para enviar sua mensagem diretamente ao nosso suporte.",
    },
    {
      question: "Como funciona o site?",
      answer:
        "Nossa plataforma é de cotação de preços dos grãos em tempo real onde você consegue ver as melhores cooperativas da região.",
    },
    {
      question: "Quanto tempo demora para conseguir uma resposta?",
      answer: "Nosso tempo de resposta tem um prazo de até 2 dias úteis.",
    },
    {
      question: "Qual o horário de atendimento?",
      answer: "Nosso atendimento funciona de segunda a sexta, das 8h às 18h.",
    },
    {
      question: "Como acompanhar minhas solicitações?",
      answer:
        "Após o envio da mensagem, você receberá um protocolo e poderá acompanhar sua solicitação através do nosso site.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={true} />

      <main className="container mx-auto p-6 flex-grow">
        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">Fale Conosco</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Nome:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Seu nome"
                required
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Seu e-mail"
                required
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium">
                Mensagem:
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                placeholder="Escreva sua mensagem"
                required
                className="textarea textarea-bordered w-full"
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Enviar
            </button>
            {enviado && (
              <div className="text-green-600 mt-2">
                Mensagem enviada com sucesso!
              </div>
            )}
          </form>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Perguntas Frequentes</h2>

          {faqData.map((item, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <button
                className="w-full text-left text-lg font-medium text-green-700 hover:text-green-900 transition-colors duration-300 flex justify-between items-center"
                onClick={() => {
                  const answerElement = document.getElementById(`answer-${index}`);
                  if (answerElement.classList.contains('hidden')) {
                    answerElement.classList.remove('hidden');
                    answerElement.classList.add('block');
                  } else {
                    answerElement.classList.remove('block');
                    answerElement.classList.add('hidden');
                  }
                }}
              >
                {item.question}
                <span className="text-gray-500">+</span>
              </button>
              <div
                id={`answer-${index}`}
                className="hidden text-gray-700 mt-2 transition-all duration-500 ease-in-out"
              >
                {item.answer}
              </div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
