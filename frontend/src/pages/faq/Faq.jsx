import React, { useState } from "react";
import { Link } from "react-router-dom";
import userImage from "../../assets/user.png";
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

  const toggleAnswer = (e) => {
    const answer = e.currentTarget.nextElementSibling;
    if (answer.style.display === "block") {
      answer.style.display = "none";
    } else {
      answer.style.display = "block";
    }
  };

  return (
    <div>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          background: #f5f5f5;
          color: #333;
        }

        .container {
          max-width: 960px;
          margin: 20px auto;
          padding: 0 20px;
        }

        header {
          background: #2e7d32;
          color: #fff;
          padding: 20px 0;
          text-align: center;
          margin-bottom: 30px;
        }

        h1, h2 {
          margin-bottom: 15px;
          font-size: 2em;
          font-family: 'Arial', sans-serif;
        }

        .support-form {
          background: #fff;
          padding: 20px;
          border-radius: 4px;
          margin-bottom: 40px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .support-form label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .support-form input,
        .support-form textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .support-form button {
          display: inline-block;
          background: #2e7d32;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }

        .support-form button:hover {
          background: #45a049;
        }

        .faq-section {
          background: #fff;
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .faq-item + .faq-item {
          margin-top: 15px;
        }

        .faq-item .question {
          background: #f1f1f1;
          padding: 10px;
          cursor: pointer;
          border-radius: 4px;
          transition: 0.3s;
        }

        .faq-item .question:hover {
          background: #e2e2e2;
        }

        .faq-item .answer {
          margin-top: 5px;
          padding: 10px;
          display: none;
          border-left: 3px solid #4CAF50;
          background: #fafafa;
          border-radius: 4px;
        }

        footer {
          text-align: center;
          margin-top: 40px;
          padding: 20px 0;
          background: #2e7d32;
          color: #fff;
        }
      `}</style>

      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">AGROSMART+</a>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            ></div>
            <div
              tabIndex={0}
              className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
            ></div>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="User" src={userImage} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Perfil
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <Link to="/configuracao">Configuração</Link>
              </li>
              <li>
                <a>Sair</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container">
        <section className="support-form">
          <h2>Fale Conosco</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Seu nome"
              required
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Seu e-mail"
              required
            />

            <label htmlFor="message">Mensagem:</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              placeholder="Escreva sua mensagem"
              required
            ></textarea>

            <button type="submit">Enviar</button>
            {enviado && (
              <div style={{ color: "green", marginTop: 8 }}>
                Mensagem enviada com sucesso!
              </div>
            )}
          </form>
        </section>

        <section className="faq-section">
          <h2>Perguntas Frequentes</h2>

          {faqData.map((item, index) => (
            <div className="faq-item" key={index}>
              <div className="question" onClick={toggleAnswer}>
                {item.question}
              </div>
              <div className="answer">{item.answer}</div>
            </div>
          ))}
        </section>
      </div>

      <footer>
        <p>&copy; 2023 Site Agrícola. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

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
