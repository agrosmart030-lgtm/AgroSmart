import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="footer bg-base-200 text-base-content p-10"
      style={{ backgroundColor: "#2e7d32" }}
    >
      <nav>
        <h6 className="footer-title text-white">Serviços</h6>
        <a className="link link-hover text-white">Gestão Agrícola</a>
        <a className="link link-hover text-white">Tecnologia de Precisão</a>
        <a className="link link-hover text-white">Soluções Integradas</a>
      </nav>
      <nav>
        <h6 className="footer-title text-white">Empresa</h6>
        <a className="link link-hover text-white">Sobre Nós</a>
        <a className="link link-hover text-white">Contato</a>
        <Link to="/LoginAdmin" className="link link-hover text-white">
          Portal Admin
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title text-white">Legal</h6>
        <a className="link link-hover text-white">Termos de Uso</a>
        <a className="link link-hover text-white">Política de Privacidade</a>
        <a className="link link-hover text-white">Cookies</a>
      </nav>
      <form>
        <h6 className="footer-title text-white">Newsletter</h6>
        <fieldset className="form-control w-60">
          <label className="label">
            <span className="label-text text-white text-sm">
              Informe seu e-mail
            </span>
          </label>
          <div className="join">
            <input
              type="email"
              placeholder="nome@exemplo.com"
              className="input input-bordered input-sm join-item text-gray-800"
            />
            <button className="btn btn-primary btn-sm join-item">
              Assinar
            </button>
          </div>
        </fieldset>
      </form>
    </footer>
  );
}
