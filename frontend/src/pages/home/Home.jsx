import { Link } from "react-router-dom";
import Navbar from "../../componentes/navbar";
import Footer from "../../componentes/footer";
import backgroundImg from "../../assets/background.jpg";
import cotacaoImg from "../../assets/cotacao.jpg";
import solucoesImg from "../../assets/solucoes.jpg";
import climaImg from "../../assets/clima.jpg";
import coamoLogo from "../../assets/coamo.png";
import larLogo from "../../assets/lar.png";
import granosLogo from "../../assets/granos_logo.png";
import cvaleLogo from "../../assets/cvaleLogo.jpg";

const partners = [
  { nome: "Coamo", logo: coamoLogo, site: "https://www.coamo.com.br/" },
  { nome: "Lar", logo: larLogo, site: "https://www.lar.ind.br/" },
  { nome: "Granos", logo: granosLogo, site: "https://granoscorretora.com.br" },
  { nome: "C.Vale", logo: cvaleLogo, site: "https://www.cvale.com.br/" },
];

export default function Home() {
  return (
    <div className="bg-surface selection:bg-tertiary-fixed-dim/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-primary-container">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container via-primary-container/90 to-transparent"></div>
          <img
            className="w-full h-full object-cover mix-blend-overlay opacity-60"
            src={backgroundImg}
            alt="Campo de cultivo ao entardecer"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full -mt-20">
          <div className="max-w-3xl">
            <span className="inline-block text-tertiary-fixed-dim font-bold tracking-widest text-xs uppercase mb-6">
              Inovação Rural de Elite
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] mb-8">
              O Futuro do Agronegócio é Inteligente
            </h1>
            <p className="text-secondary-container text-lg md:text-xl font-medium max-w-xl mb-12 leading-relaxed">
              Transformamos dados complexos em decisões de luxo. A excelência técnica encontra a sensibilidade da terra em uma plataforma única.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                to="/login"
                className="bg-tertiary-fixed-dim text-on-tertiary-fixed px-10 py-5 rounded-full font-extrabold text-lg hover:bg-white transition-all shadow-xl text-center"
              >
                Comece Agora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Nossos Serviços) */}
      <section id="servicos" className="py-20 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-12">
            <h2 className="text-primary text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Nossos Serviços</h2>
            <div className="h-1 w-20 bg-tertiary-fixed-dim rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento Card 1 - Cotações - 50/50 Grid for symmetry */}
            <div className="md:col-span-6 group bg-zinc-900 rounded-full p-12 transition-all duration-500 hover:shadow-2xl flex flex-col justify-between min-h-[480px] overflow-hidden relative shadow-sm">
              <div className="flex justify-between items-start relative z-10">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">currency_exchange</span>
                </div>
                <span className="text-white/20 font-extrabold text-6xl tracking-tighter">01</span>
              </div>
              <div className="relative z-10 transition-all duration-500 group-hover:translate-x-2">
                <h3 className="text-white text-2xl font-extrabold mb-4 drop-shadow-md">Cotações em Tempo Real</h3>
                <p className="text-stone-200 text-base leading-relaxed max-w-sm drop-shadow-md">
                  Acompanhe as flutuações das principais commodities globais com precisão milimétrica e insights preditivos.
                </p>
              </div>
              {/* Dynamic Gradient Overlay - Subtle shadow for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[5] transition-all duration-500 group-hover:from-black/90"></div>
              <img src={cotacaoImg} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" alt="" />
            </div>

            {/* Bento Card 2 - Clima - 50/50 Grid for symmetry */}
            <div className="md:col-span-6 group bg-zinc-900 rounded-full p-12 transition-all duration-500 hover:shadow-2xl flex flex-col justify-between min-h-[480px] overflow-hidden relative shadow-sm">
              <div className="flex justify-between items-start relative z-10">
                <div className="w-16 h-16 bg-tertiary-fixed-dim text-on-tertiary-fixed rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">cloudy_snowing</span>
                </div>
                <span className="text-white/20 font-extrabold text-6xl tracking-tighter">02</span>
              </div>
              <div className="relative z-10 transition-all duration-500 group-hover:translate-x-2">
                <h3 className="text-white text-2xl font-extrabold mb-4 drop-shadow-md">Previsão de Clima</h3>
                <p className="text-stone-200 text-base leading-relaxed max-w-sm drop-shadow-md">
                  Modelagem hiper-localizada para planejar seu plantio e colheita com segurança absoluta.
                </p>
              </div>
              {/* Dynamic Gradient Overlay - Subtle shadow for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[5] transition-all duration-500 group-hover:from-black/90"></div>
              <img src={climaImg} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" alt="" />
            </div>

            {/* Bento Card 3 - Gestão */}
            <div className="md:col-span-12 group bg-primary rounded-full p-10 md:p-14 transition-all duration-500 hover:shadow-2xl flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
              <div className="md:w-1/2 relative z-10">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-3xl">analytics</span>
                </div>
                <h3 className="text-white text-4xl font-extrabold mb-6">Gestão Inteligente</h3>
                <p className="text-secondary-container/80 text-xl leading-relaxed mb-8">
                  Um ecossistema completo de gestão financeira e operacional desenhado para a alta liderança do agronegócio.
                </p>
                <Link to="/login" className="text-tertiary-fixed-dim font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                  Saiba mais <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
              <div className="md:w-1/2 relative">
                <img
                  className="rounded-full shadow-2xl scale-110 translate-x-12 translate-y-12"
                  src={solucoesImg}
                  alt="Dashboard de gestão agrícola"
                />
              </div>
              {/* Decorative Gradient */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="parceiros" className="py-32 bg-surface-container border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-on-surface-variant/40 font-manrope text-xs uppercase tracking-[0.3em] font-bold mb-2 translate-x-8 -translate-y-16 pl-[0.3em]">
            Alianças Estratégicas de Confiança
          </p>
          <div className="flex justify-center items-center gap-16 md:gap-24">
            {partners.map((partner, index) => (
              <a
                key={index}
                href={partner.site}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-3 group hover:opacity-100 hover:-translate-y-3 transition-all duration-300 w-40"
              >
                <div className="h-20 flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.nome}
                    className={`max-h-full max-w-full object-contain ${partner.nome === 'Granos' ? 'scale-[1.4] translate-y-2' : ''}`}
                  />
                </div>
                <div className="h-0.5 w-0 group-hover:w-full bg-tertiary-fixed-dim transition-all duration-300"></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-primary rounded-[2.5rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-block text-tertiary-fixed-dim font-bold tracking-widest text-xs uppercase mb-4">
                O Próximo Nível
              </span>
              <h2 className="text-white text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">
                Pronto para liderar o amanhã?
              </h2>
              <p className="text-emerald-100/70 text-lg mb-10">
                Junte-se às maiores cooperativas e produtores do país na revolução inteligente.
              </p>
              <Link
                to="/cadastro"
                className="bg-tertiary-fixed-dim text-on-tertiary-fixed px-10 py-4 rounded-full font-extrabold text-lg hover:bg-white transition-all hover:scale-105 active:scale-95 inline-block shadow-xl"
              >
                Realizar Cadastro
              </Link>
            </div>
            {/* Background texture with better visibility */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-overlay">
              <img className="w-full h-full object-cover" src={backgroundImg} alt="" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
