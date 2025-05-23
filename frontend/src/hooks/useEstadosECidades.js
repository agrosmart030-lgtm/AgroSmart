import { useState, useEffect } from "react";
import axios from "axios";

// Hook customizado para buscar estados e cidades do IBGE
export function useEstadosECidades(estadoSelecionado) {
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => setEstados(res.data))
      .catch(() => setEstados([]));
  }, []);

  useEffect(() => {
    if (estadoSelecionado) {
      axios
        .get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`
        )
        .then((res) => setCidades(res.data))
        .catch(() => setCidades([]));
    } else {
      setCidades([]);
    }
  }, [estadoSelecionado]);

  return { estados, cidades };
}
