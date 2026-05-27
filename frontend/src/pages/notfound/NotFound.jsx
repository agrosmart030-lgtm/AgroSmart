import { ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../../componentes/footer";
import Navbar from "../../componentes/navbar";
import backgroundImg from "../../assets/background.jpg";

function BrokenHarvesterIllustration() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[640px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
      <div className="absolute right-4 top-4 z-10 max-w-[190px] rounded-2xl bg-white px-4 py-3 text-left text-xs font-extrabold leading-snug text-primary shadow-xl sm:right-8 sm:top-8 sm:max-w-[230px] sm:text-sm">
        Ops, houve algum erro por aqui!
        <span className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 bg-white" />
      </div>

      <svg
        className="absolute inset-x-0 bottom-1 mx-auto h-[78%] w-[96%] drop-shadow-2xl sm:bottom-0"
        viewBox="0 0 720 430"
        role="img"
        aria-labelledby="broken-harvester-title broken-harvester-description"
      >
        <title id="broken-harvester-title">Colheitadeira estragada</title>
        <desc id="broken-harvester-description">
          Ilustração de uma colheitadeira parada no campo com sinais de falha.
        </desc>

        <path
          d="M64 360C138 336 208 338 276 354C348 371 408 374 486 350C560 328 623 330 674 356V430H64V360Z"
          fill="#c0edd4"
          opacity="0.28"
        />
        <path
          d="M32 372H688"
          stroke="#c0edd4"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.45"
        />

        <g className="animate-pulse" opacity="0.85">
          <circle cx="515" cy="93" r="16" fill="#e1e3e4" opacity="0.88" />
          <circle cx="546" cy="75" r="23" fill="#e1e3e4" opacity="0.72" />
          <circle cx="581" cy="57" r="15" fill="#e1e3e4" opacity="0.62" />
          <path
            d="M500 126C535 118 562 105 592 82"
            fill="none"
            stroke="#e1e3e4"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.45"
          />
        </g>

        <g transform="translate(78 86)">
          <path
            d="M178 92H320C349 92 371 111 378 139L395 210H143L161 115C164 101 174 92 178 92Z"
            fill="#ffba29"
          />
          <path
            d="M251 39H342C365 39 383 57 383 80V142H237V55C237 46 242 39 251 39Z"
            fill="#1b4332"
          />
          <path
            d="M268 58H337C350 58 360 68 360 81V119H268V58Z"
            fill="#c0edd4"
            opacity="0.9"
          />
          <path
            d="M360 63L415 78L398 95L364 84Z"
            fill="#012d1d"
          />
          <path
            d="M409 79L440 24"
            stroke="#012d1d"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M145 131H109C89 131 73 147 73 167V210H161L145 131Z"
            fill="#3e6653"
          />
          <path
            d="M120 159H158"
            stroke="#c0edd4"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M116 210H419C436 210 450 224 450 241V249H91V235C91 221 102 210 116 210Z"
            fill="#012d1d"
          />
          <path
            d="M395 168L538 137L553 188L421 220Z"
            fill="#ffba29"
            transform="rotate(-7 474 178)"
          />
          <path
            d="M533 137L598 126"
            stroke="#012d1d"
            strokeWidth="12"
            strokeLinecap="round"
            transform="rotate(-7 565 132)"
          />
          <path
            d="M431 220L589 188"
            stroke="#012d1d"
            strokeWidth="10"
            strokeLinecap="round"
            transform="rotate(-7 510 204)"
          />
          <path
            d="M445 215L465 247M486 207L506 239M527 199L547 231M568 191L588 223"
            stroke="#012d1d"
            strokeWidth="7"
            strokeLinecap="round"
            transform="rotate(-7 516 219)"
          />

          <circle cx="203" cy="250" r="62" fill="#012d1d" />
          <circle cx="203" cy="250" r="42" fill="#3e6653" />
          <circle cx="203" cy="250" r="17" fill="#ffba29" />
          <path
            d="M172 221L234 279M234 221L172 279"
            stroke="#c0edd4"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.8"
          />

          <circle cx="372" cy="255" r="44" fill="#012d1d" />
          <circle cx="372" cy="255" r="28" fill="#3e6653" />
          <circle cx="372" cy="255" r="12" fill="#ffba29" />

          <circle cx="477" cy="292" r="20" fill="#012d1d" opacity="0.95" />
          <circle cx="477" cy="292" r="9" fill="#ffba29" />
          <path
            d="M450 280C466 272 488 272 505 282"
            stroke="#c0edd4"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.65"
          />

          <path
            d="M246 119L224 148H254L230 184"
            fill="none"
            stroke="#ba1a1a"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M312 151L326 166M333 147L318 179"
            stroke="#012d1d"
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M420 244L449 267"
            stroke="#ba1a1a"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M69 249L39 276M80 266L53 294"
            stroke="#ffba29"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.95"
          />
        </g>
      </svg>
    </div>
  );
}

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-surface selection:bg-tertiary-fixed-dim/30">
      <Navbar />

      <main className="relative flex-grow overflow-hidden bg-primary-container">
        <section className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden py-16 sm:py-20 lg:py-24">
          <img
            src={backgroundImg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container via-primary-container/95 to-primary/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/90 to-transparent" />

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
            <div className="text-center lg:text-left">
              <p className="mb-4 text-7xl font-extrabold leading-none text-tertiary-fixed-dim drop-shadow-sm sm:text-8xl lg:text-9xl">
                404
              </p>

              <h1 className="max-w-3xl text-4xl font-extrabold leading-[0.95] text-white sm:text-5xl lg:text-7xl">
                Ops! Página não encontrada
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-secondary-container sm:text-lg lg:mx-0">
                Parece que nossa colheitadeira teve um problema no caminho e
                não conseguiu encontrar esta página.
              </p>

              <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
                <Link
                  to="/"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-tertiary-fixed-dim px-7 py-4 text-sm font-extrabold text-on-tertiary-fixed shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:w-auto sm:px-8"
                >
                  <Home size={20} aria-hidden="true" />
                  Voltar para a página inicial
                </Link>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-extrabold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 sm:w-auto sm:px-8"
                >
                  <ArrowLeft size={20} aria-hidden="true" />
                  Voltar à página anterior
                </button>
              </div>
            </div>

            <BrokenHarvesterIllustration />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
