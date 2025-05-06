// src/pages/Home.jsx
import { Link } from "react-router-dom";
import Navbar from "../../componentes/navbar";
import Footer from "../../componentes/footer";
import backgroundImg from "../../assets/background.jpg";
import cotacaoImg from "../../assets/cotacao.jpg";
import solucoesImg from "../../assets/solucoes.jpg";
import climaImg from "../../assets/clima.jpg";
import coamoLogo from "../../assets/coamo.png";
import cocamarLogo from "../../assets/cocamar.png";
import larLogo from "../../assets/lar.png";
import timelineImg from "../../assets/timelineImg.jpg";

// Dados extraídos para evitar recriação a cada render
const timelineSteps = [
  "Crie sua conta",
  "Acesse a plataforma",
  "Veja cotações atualizadas",
  "Planeje com precisão",
  "Decida o melhor momento para vender",
];

const services = [
  {
    title: "Cotação de Grãos em Tempo Real",
    img: cotacaoImg,
    subtitle: "Acompanhe os preços do mercado agrícola em tempo real.",
  },
  {
    title: "Soluções Integradas",
    img: solucoesImg,
    subtitle: "Ferramentas e insights para gestão e tomada de decisão.",
  },
  {
    title: "Clima Atualizado",
    img: climaImg,
    subtitle: "Previsão do tempo precisa para o planejamento do campo.",
  },
];

const partners = [
  {
    nome: "Coamo",
    logo: coamoLogo,
    site: "https://www.coamo.com.br/",
  },
  {
    nome: "Cocamar",
    logo: cocamarLogo,
    site: "https://www.cocamar.com.br/",
  },
  {
    nome: "Lar",
    logo: larLogo,
    site: "https://www.lar.ind.br/",
  },
];

// Componentes menores para cada seção

function TimelineItem({ index, step }) {
  return (
    <li className="relative">
      {index % 2 === 0 ? (
        <div className="timeline-start timeline-box bg-green-100 text-green-900 font-medium p-2">
          {step}
        </div>
      ) : (
        <div className="timeline-end timeline-box bg-green-100 text-green-900 font-medium p-2">
          {step}
        </div>
      )}
      <div className="timeline-middle flex items-center justify-center relative z-10">
        <div className="flex items-center justify-center h-6 w-6 bg-green-600 text-white font-bold rounded-full">
          {index + 1}
        </div>
      </div>
    </li>
  );
}

function ServiceCard({ title, img, subtitle }) {
  return (
    <div className="card bg-base-100 shadow-xl hover:scale-105 transition-transform duration-300">
      <figure>
        <img src={img} alt={title} className="h-48 w-full object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function PartnerCard({ nome, logo, site }) {
  return (
    <a
      href={site}
      target="_blank"
      rel="noopener noreferrer"
      className="card w-80 h-56 bg-white shadow-xl hover:scale-105 transition-transform duration-300 flex items-center justify-center p-6 border border-green-300 rounded-3xl"
    >
      <img src={logo} alt={nome} className="object-contain h-20" />
    </a>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <div className="mt-[85px]">
          <div
            className="hero min-h-screen relative bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImg})`,
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-neutral-content">
              <div className="max-w-md">
                <h1 className="mb-5 text-5xl font-bold">
                  Saudações, <br />
                  Bem-vindo ao{" "}
                  <span className="text-[#ffc107]">Agro</span>
                  <span className="text-[#fff]">Smart</span>
                </h1>
                <p className="mb-5">
                  Transformamos o agronegócio com inovação e tecnologia. Descubra um
                  mundo de possibilidades para o seu negócio.
                </p>
                <Link
                  to="/login"
                  className="btn btn-sm text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(76,175,80,0.6), rgba(255,193,7,0.3))",
                    backdropFilter: "blur(4px)",
                    borderRadius: "5px",
                  }}
                >
                  Comece Agora
                </Link>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="p-10 bg-base-100">
            <h2 className="text-3xl font-bold text-center mb-10">Como Funciona</h2>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
              <div className="relative w-full lg:w-1/2">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-green-600" />
                <ul className="timeline timeline-vertical relative">
                  {timelineSteps.map((step, idx) => (
                    <TimelineItem key={idx} index={idx} step={step} />
                  ))}
                </ul>
              </div>
              <div className="hidden lg:block w-1/2">
                <img
                  src={timelineImg}
                  alt="Ilustração de timeline"
                  className="rounded-lg shadow-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Serviços */}
          <div className="p-10 bg-base-100">
            <h2 className="text-3xl font-bold text-center mb-8">Nossos Serviços</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <ServiceCard key={idx} {...service} />
              ))}
            </div>
          </div>

          {/* Parceiros */}
          <div className="p-10 bg-gradient-to-br from-gray-100 to-gray-150">
            <h2 className="text-3xl font-bold text-center mb-8">Nossos Parceiros</h2>
            <div className="flex flex-wrap justify-center gap-12">
              {partners.map((partner, idx) => (
                <PartnerCard key={idx} {...partner} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
