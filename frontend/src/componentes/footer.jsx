import { Link } from "react-router-dom";
import folhaLogo from "../assets/folha.svg";

export default function Footer() {
  return (
    <footer className="bg-emerald-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-8">
        {/* Top section with columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-8 pb-8 border-b border-emerald-900/10">
          {/* Brand & Logo */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              <img src={folhaLogo} alt="AgroSmart" className="w-8 h-8" />
              <span className="text-xl font-extrabold text-amber-400 tracking-tighter">AgroSmart</span>
            </Link>
            <p className="text-emerald-200/40 text-xs leading-relaxed max-w-xs mx-auto md:mx-0">
              Transformando a complexidade do campo em decisões de elite. Tecnologia e sustentabilidade para o agronegócio inteligente.
            </p>
          </div>

          {/* Links Column 1: Plataforma */}
          <div>
            <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-4">Plataforma</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-emerald-200/50 hover:text-white transition-all text-xs">Dashboard</Link></li>
              <li><Link to="/clima" className="text-emerald-200/50 hover:text-white transition-all text-xs">Previsão do Tempo</Link></li>
            </ul>
          </div>

          {/* Links Column 2: Ajuda */}
          <div>
            <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-4">Ajuda</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-emerald-200/50 hover:text-white transition-all text-xs">Suporte do Sistema</Link></li>
              <li><Link to="/duvidas" className="text-emerald-200/50 hover:text-white transition-all text-xs">Consultoria Técnica</Link></li>
            </ul>
          </div>

          {/* Links Column 3: Conta */}
          <div>
            <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-4">Conta</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-emerald-200/50 hover:text-white transition-all text-xs">Entrar</Link></li>
              <li><Link to="/cadastro" className="text-emerald-200/50 hover:text-white transition-all text-xs">Cadastrar</Link></li>
              <li><Link to="/configuracao" className="text-emerald-200/50 hover:text-white transition-all text-xs">Configurações</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom section: Legal & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-emerald-50/30 text-[10px] uppercase font-manrope tracking-widest">
            © 2024 AgroSmart. Digital Atelier para o Agronegócio Global.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-emerald-200/20 hover:text-white transition-all text-[9px] uppercase tracking-widest">Privacidade</a>
            <a href="#" className="text-emerald-200/20 hover:text-white transition-all text-[9px] uppercase tracking-widest">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
