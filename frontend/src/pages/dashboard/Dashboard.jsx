import { useNavigate } from "react-router-dom";
import Footer from "../../componentes/footer";
import Navbar from "../../componentes/navbar";
import coamoLogo from "../../assets/coamo-logo.png";
import cocamarLogo from "../../assets/cocamar-logo.png";
import larLogo from "../../assets/lar-logo.png";

// Dados das cooperativas
const cooperativasData = [
  {
    nome: "COAMO",
    logo: coamoLogo,
    telefone: "556721088600",
    produtos: [
      { nome: "SOJA", preco: "R$ 128,50", dataHora: "4/12/2024 12:32" },
      { nome: "MILHO", preco: "R$ 56,30", dataHora: "4/12/2024 12:32" },
      { nome: "TRIGO", preco: "R$ 67,00", dataHora: "4/12/2024 12:32" },
      { nome: "CAFÉ EM COCO", preco: "R$ 29,24", dataHora: "4/12/2024 12:32" },
    ],
  },
  {
    nome: "LAR",
    logo: larLogo,
    telefone: "556734243449",
    produtos: [
      { nome: "SOJA", preco: "R$ 128,50", dataHora: "4/12/2024 12:32" },
      { nome: "MILHO", preco: "R$ 56,30", dataHora: "4/12/2024 12:32" },
      { nome: "TRIGO", preco: "R$ 67,00", dataHora: "4/12/2024 12:32" },
      { nome: "CAFÉ EM COCO", preco: "R$ 20,00", dataHora: "4/12/2024 12:32" },
    ],
  },
  {
    nome: "COCAMAR",
    logo: cocamarLogo,
    telefone: "551194567890",
    produtos: [
      { nome: "SOJA", preco: "R$ 132,00", dataHora: "4/12/2024 12:32" },
      { nome: "MILHO", preco: "R$ 60,00", dataHora: "4/12/2024 12:32" },
      { nome: "TRIGO", preco: "R$ 72,00", dataHora: "4/12/2024 12:32" },
      { nome: "CAFÉ EM COCO", preco: "R$ 29,50", dataHora: "4/12/2024 12:32" },
    ],
  },
];

// Componente da Tabela de Preços
const TabelaPrecos = ({ cooperativa }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 mb-12 px-4">
      <div className="flex-shrink-0 w-96 h-60 bg-white rounded-lg shadow-md flex flex-col items-center justify-start p-4">
        <div className="w-full h-3/4 flex items-center justify-center">
          <img
            src={cooperativa.logo}
            alt={`Logo ${cooperativa.nome}`}
            className="w-full h-full object-contain rounded-lg"
            style={{ background: "#fff" }}
          />
        </div>
        <div className="w-full flex justify-center mt-6">
          <a
            href={`https://api.whatsapp.com/send/?phone=${cooperativa.telefone}&text&type=phone_number&app_absent=0`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-700 text-yellow-400 px-6 py-3 border-none rounded-lg shadow-lg hover:bg-green-600 hover:shadow-xl transition-all duration-300 font-semibold text-lg flex items-center"
          >
            Fale com um Vendedor
          </a>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table
          className="border-2 border-collapse font-sans shadow-xl rounded-lg overflow-hidden bg-green-50 text-green-900 border-green-300"
          style={{ minWidth: "600px" }}
        >
          <thead>
            <tr>
              <th className="bg-green-700 text-yellow-400 border border-green-600 p-3 text-center font-bold text-lg">
                PRODUTOS
              </th>
              <th className="bg-green-700 text-yellow-400 border border-green-600 p-3 text-center font-bold text-lg">
                PREÇOS
              </th>
              <th className="bg-green-700 text-yellow-400 border border-green-600 p-3 text-center font-bold text-lg">
                DATA E HORA
              </th>
            </tr>
          </thead>
          <tbody>
            {cooperativa.produtos.map((produto, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-green-100" : "bg-green-50"}
              >
                <td className="border border-green-300 p-3 text-center font-medium">
                  {produto.nome}
                </td>
                <td className="border border-green-300 p-3 text-center font-semibold text-green-800">
                  {produto.preco}
                </td>
                <td className="border border-green-300 p-3 text-center text-sm">
                  {produto.dataHora}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-full flex justify-center mt-4">
          <button
            onClick={() => navigate("/cotacoes")}
            className="bg-yellow-400 text-green-800 px-6 py-3 rounded-lg font-semibold shadow hover:bg-yellow-300 transition-colors flex items-center"
          >
            Ver Histórico
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
const AgroSmartApp = () => {
  return (
    <div className="min-h-screen bg-green-50 text-gray-900">
      <Navbar />
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto">
          {cooperativasData.map((cooperativa, index) => (
            <div key={index} className="mb-12">
              <h2 className="text-2xl font-bold text-center text-green-900">
                {cooperativa.nome}
              </h2>
              <TabelaPrecos cooperativa={cooperativa} />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgroSmartApp;