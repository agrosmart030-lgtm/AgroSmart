import React, { useState, useEffect } from "react";
import {
  Wind,
  Droplets,
  Eye,
  Gauge,
  MapPin,
  Search,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  CloudSun,
  AlertTriangle,
  Leaf,
} from "lucide-react";
import Navbar from "../../componentes/navbar";
import Footer from "../../componentes/footer";

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("São Paulo");
  const [searchCity, setSearchCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // Busca sugestões de cidades
  const fetchCitySuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    if (!apiKey) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          query
        )}&limit=5&appid=${apiKey}`
      );
      if (!response.ok) return;
      const data = await response.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };

  // Atualiza sugestões enquanto digita
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCitySuggestions(searchCity);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchCity]);

  // Função para buscar clima atual
  const fetchWeatherData = async (cityName = city) => {
    setLoading(true);
    setError(null);
    if (!apiKey) {
      setError("Chave da API OpenWeatherMap nao configurada.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${apiKey}&units=metric&lang=pt_br`
      );
      if (!response.ok) throw new Error("Erro ao buscar dados da API");
      const data = await response.json();
      setWeatherData(data);
      setCity(cityName);
      fetchForecastData(cityName); // Busca a previsão junto
    } catch (err) {
      console.log(err);
      setError("Erro ao buscar dados do clima. Tente novamente.");
      setWeatherData(null);
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar previsão de 5 dias
  const fetchForecastData = async (cityName = city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          cityName
        )}&appid=${apiKey}&units=metric&lang=pt_br`
      );
      if (!response.ok) throw new Error("Erro ao buscar previsão");
      const data = await response.json();
      // Filtra apenas um horário por dia (ex: 12:00)
      const daily = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecastData(daily);
    } catch {
      setForecastData([]);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchCity.trim()) {
      fetchWeatherData(searchCity.trim());
      setSearchCity("");
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherDataByCoords(latitude, longitude);
        },
        () => {
          setError("Erro ao obter localização");
        }
      );
    }
  };

  const fetchWeatherDataByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    if (!apiKey) {
      setError("Chave da API OpenWeatherMap nao configurada.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`
      );
      if (!response.ok) throw new Error("Erro ao buscar dados da API");
      const data = await response.json();
      setWeatherData(data);
      setCity(data.name);
      fetchForecastData(data.name);
    } catch (err) {
      console.log(err);
      setError("Erro ao buscar dados do clima. Tente novamente.");
      setWeatherData(null);
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  // Função para formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const handleSuggestionClick = (suggestion) => {
    const cityName = `${suggestion.name}${
      suggestion.state ? ", " + suggestion.state : ""
    }, ${suggestion.country}`;
    setSearchCity(cityName);
    setSuggestions([]);
    fetchWeatherData(cityName);
  };

  // Helper to get wind direction string from degrees
  const getWindDirection = (deg) => {
    if (deg == null) return "";
    const dirs = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];
    return dirs[Math.round(deg / 45) % 8];
  };

  // Helper to get a humidity status message
  const getHumidityStatus = (humidity) => {
    if (humidity == null) return "";
    if (humidity < 30) return "Ar muito seco";
    if (humidity < 60) return "Confortável";
    if (humidity < 80) return "Ideal para a fase atual";
    return "Umidade elevada";
  };

  // Helper to get pressure status
  const getPressureStatus = (pressure) => {
    if (pressure == null) return "";
    if (pressure < 1010) return "Baixa";
    if (pressure <= 1020) return "Estável";
    return "Alta";
  };

  // Helper to get visibility status
  const getVisibilityStatus = (visibility) => {
    if (visibility == null) return "";
    const km = visibility / 1000;
    if (km >= 10) return "Condições claras";
    if (km >= 5) return "Visibilidade moderada";
    return "Visibilidade reduzida";
  };

  // Format the last update time
  const getUpdateTime = () => {
    const now = new Date();
    return `Atualizado: Hoje, ${now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })} BRT`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f4f5]">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto w-full p-6 lg:p-12">

          {/* Header with Search */}
          <div className="flex justify-between mb-12 flex-col lg:flex-row lg:items-start gap-6 lg:gap-0">
            <div className="flex flex-col md:flex-row md:items-center gap-6 w-full lg:w-auto flex-1">
              {/* City Name & Description */}
              <div className="min-w-fit">
                <h2 className="text-4xl font-bold tracking-tight text-[#012d1d]">
                  {weatherData ? weatherData.name : city}
                </h2>
                <p className="text-xl text-[#3e6653] font-medium mt-1">
                  {weatherData
                    ? weatherData.weather[0].description.charAt(0).toUpperCase() +
                      weatherData.weather[0].description.slice(1)
                    : "Carregando..."}
                </p>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2 flex-1 max-w-2xl w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3e6653] w-4 h-4" />
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                    placeholder="Pesquisar cidade..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#e1e3e4] rounded-xl shadow-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none text-[#012d1d] text-sm transition-all"
                    autoComplete="off"
                  />
                  {/* Suggestions Dropdown */}
                  {suggestions.length > 0 && (
                    <ul className="absolute z-40 left-0 right-0 bg-white border border-[#e1e3e4] rounded-xl mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {suggestions.map((s, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2.5 cursor-pointer hover:bg-[#e8f5e9] text-[#012d1d] text-sm transition-colors"
                          onClick={() => handleSuggestionClick(s)}
                        >
                          {s.name}
                          {s.state ? `, ${s.state}` : ""}, {s.country}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-4 py-2 bg-[#1B4332] text-white rounded-xl shadow-sm hover:bg-[#012d1d] transition-colors text-sm font-semibold flex items-center gap-2 border border-[#1B4332]"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Pesquisar</span>
                </button>
                <button
                  onClick={getCurrentLocation}
                  className="p-2 bg-white border border-[#e1e3e4] rounded-xl shadow-sm hover:bg-[#f8f9fa] text-[#1B4332] transition-colors"
                  title="Usar minha localização"
                >
                  <MapPin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => fetchWeatherData()}
                  disabled={loading}
                  className="p-2 bg-white border border-[#e1e3e4] rounded-xl shadow-sm hover:bg-[#f8f9fa] text-[#FFBA27] transition-colors"
                  title="Atualizar"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>
            <p className="text-sm text-[#3e6653] hidden lg:block whitespace-nowrap ml-6 pt-2">
              {getUpdateTime()}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <RefreshCw className="w-12 h-12 text-[#1B4332] animate-spin mx-auto mb-4" />
              <p className="text-[#3e6653] text-lg font-medium">
                Carregando dados do clima...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 rounded-2xl p-6 mb-6 border border-red-200">
              <p className="text-red-700 text-center font-medium">{error}</p>
            </div>
          )}

          {/* Weather Data */}
          {weatherData && !loading && (
            <>
              {/* Bento Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                {/* Hero Weather Card */}
                <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-[#1B4332] to-[#012d1d] rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between shadow-lg min-h-[240px]">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                  <div className="flex justify-between items-start z-10">
                    {/* Weather Icon from API */}
                    <img
                      src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                      alt={weatherData.weather[0].description}
                      className="w-24 h-24 drop-shadow-lg"
                    />
                    <div className="text-right">
                      <span className="text-[5rem] leading-none font-extrabold text-white tracking-tighter">
                        {Math.round(weatherData.main.temp)}°
                      </span>
                      <p className="text-base text-[#a5d0b9] font-semibold">
                        Sensação térmica{" "}
                        {Math.round(weatherData.main.feels_like)}°
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center gap-6 z-10">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="w-5 h-5 text-[#FFBA27]" />
                      <span className="text-xl font-bold text-white">
                        {Math.round(weatherData.main.temp_max)}°
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowDown className="w-5 h-5 text-[#FFBA27]" />
                      <span className="text-xl font-bold text-[#a5d0b9]">
                        {Math.round(weatherData.main.temp_min)}°
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics Cells Wrapper */}
                <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Umidade */}
                  <div className="bg-[#e8f5e9] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-[#c8e6c9] rounded-lg">
                        <Droplets className="w-5 h-5 text-[#1b4332]" />
                      </div>
                      <span className="text-base font-semibold text-[#1b4332]">
                        Umidade
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-[#012d1d]">
                        {weatherData.main.humidity}%
                      </p>
                      <p className="text-sm text-[#3e6653] mt-1">
                        {getHumidityStatus(weatherData.main.humidity)}
                      </p>
                    </div>
                  </div>

                  {/* Vento */}
                  <div className="bg-[#fff8e1] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-[#ffecb3] rounded-lg">
                        <Wind className="w-5 h-5 text-[#513700]" />
                      </div>
                      <span className="text-base font-semibold text-[#513700]">
                        Velocidade do Vento
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-[#352300]">
                        {weatherData.wind.speed} km/h
                      </p>
                      <p className="text-sm text-[#5f4100] mt-1">
                        Direção {getWindDirection(weatherData.wind.deg)}
                      </p>
                    </div>
                  </div>

                  {/* Pressão */}
                  <div className="bg-[#e0f2f1] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-[#b2dfdb] rounded-lg">
                        <Gauge className="w-5 h-5 text-[#004d40]" />
                      </div>
                      <span className="text-base font-semibold text-[#004d40]">
                        Pressão
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-[#002114]">
                        {weatherData.main.pressure} hPa
                      </p>
                      <p className="text-sm text-[#004d40] mt-1">
                        {getPressureStatus(weatherData.main.pressure)}
                      </p>
                    </div>
                  </div>

                  {/* Visibilidade */}
                  <div className="bg-[#e1f5fe] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-[#b3e5fc] rounded-lg">
                        <Eye className="w-5 h-5 text-[#01579b]" />
                      </div>
                      <span className="text-base font-semibold text-[#01579b]">
                        Visibilidade
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-[#01579b]">
                        {weatherData.visibility / 1000} km
                      </p>
                      <p className="text-sm text-[#0277bd] mt-1">
                        {getVisibilityStatus(weatherData.visibility)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forecast Row */}
              {forecastData.length > 0 && (
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#e1e3e4] mb-6">
                  <h3 className="text-xl font-bold text-[#012d1d] mb-6">
                    Previsão para 5 Dias
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {forecastData.map((item, idx) => (
                      <div
                        key={idx}
                        className={`rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm transition-colors cursor-pointer ${
                          idx === 0
                            ? "bg-[#FFBA27] text-[#352300] border border-[#FFBA27]"
                            : "bg-[#f8f9fa] hover:bg-[#edeeef] border border-[#e1e3e4]"
                        }`}
                      >
                        <p
                          className={`text-base font-bold mb-3 ${
                            idx === 0 ? "text-[#352300]" : "text-[#414844]"
                          }`}
                        >
                          {idx === 0 ? "Amanhã" : formatDate(item.dt_txt)}
                        </p>
                        <div className="w-16 h-16 rounded-full bg-[#1B4332]/10 flex items-center justify-center mb-2">
                          <img
                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                            alt={item.weather[0].description}
                            className="w-12 h-12"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-bold ${
                              idx === 0 ? "text-[#352300]" : "text-[#012d1d]"
                            }`}
                          >
                            {Math.round(item.main.temp_max)}°
                          </span>
                          <span
                            className={
                              idx === 0 ? "text-[#513700]" : "text-[#717973]"
                            }
                          >
                            {Math.round(item.main.temp_min)}°
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs">
                          <Droplets className={`w-3 h-3 ${idx === 0 ? "text-[#352300]" : "text-[#3e6653]"}`} />
                          <span className={idx === 0 ? "text-[#513700]" : "text-[#717973]"}>
                            {item.pop ? Math.round(item.pop * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tips and Alerts Section */}
              <section className="bg-[#1b4332]/5 p-6 rounded-2xl border border-[#1b4332]/10 shadow-sm flex flex-col md:flex-row gap-6 mb-12">
                {/* Alertas Meteorológicos */}
                <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-[#e1e3e4]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#ffecb3] rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-[#513700]" />
                    </div>
                    <h4 className="text-lg font-bold text-[#012d1d]">
                      Alertas Meteorológicos
                    </h4>
                  </div>
                  <p className="text-sm text-[#414844] leading-relaxed">
                    Nenhum alerta severo ativo para a região de{" "}
                    {weatherData.name} no momento. Condições favoráveis para
                    atividades a campo.
                  </p>
                </div>

                {/* Dicas de Manejo */}
                <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-[#e1e3e4]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#c8e6c9] rounded-lg">
                      <Leaf className="w-5 h-5 text-[#1b4332]" />
                    </div>
                    <h4 className="text-lg font-bold text-[#012d1d]">
                      Dicas de Manejo
                    </h4>
                  </div>
                  <ul className="text-sm text-[#414844] space-y-2 list-disc list-inside leading-relaxed">
                    <li>
                      Umidade em {weatherData.main.humidity}%:{" "}
                      {weatherData.main.humidity >= 50 &&
                      weatherData.main.humidity <= 80
                        ? "Condições ideais para pulverização."
                        : weatherData.main.humidity < 50
                        ? "Ar seco — evite pulverização nas horas mais quentes."
                        : "Umidade alta — risco de doenças fúngicas."}
                    </li>
                    <li>
                      Ventos a {weatherData.wind.speed} km/h:{" "}
                      {weatherData.wind.speed <= 15
                        ? "Risco baixo de deriva, monitore à tarde."
                        : "Ventos fortes — evite pulverização aérea."}
                    </li>
                  </ul>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WeatherApp;
