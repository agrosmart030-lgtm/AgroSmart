import React, { useState, useEffect } from "react";
import {
  Wind,
  Droplets,
  Eye,
  Gauge,
  MapPin,
  Search,
  RefreshCw,
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

  const apiKey = "54a5e454d3908f64653aa11798007b06";

  // Busca sugestões de cidades
  const fetchCitySuggestions = async (query) => {
    if (!query) {
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-600 via-slate-800 to-slate-900">
      <Navbar />
      <main className="flex-grow pt-28 ">
        <div className="min-h-screen p-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-yellow-400 mb-2">
                Previsão do Tempo
              </h1>
              <p className="text-green-200">
                Informações meteorológicas em tempo real
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 mb-6 border border-green-500/30 relative z-20">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300 w-5 h-5" />
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                    placeholder="Digite o nome da cidade..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/60 border border-green-500/40 rounded-xl text-white placeholder-green-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                    autoComplete="off"
                  />
                  {/* Sugestões */}
                  {suggestions.length > 0 && (
                    <ul className="absolute z-50 left-0 right-0 bg-slate-800 border border-green-500/40 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-2xl">
                      {suggestions.map((s, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2 cursor-pointer hover:bg-green-700 text-white"
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
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 border border-green-500 rounded-xl text-white font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Buscar
                </button>
                <button
                  onClick={getCurrentLocation}
                  className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 border border-yellow-400 rounded-xl text-slate-900 transition-all duration-200"
                >
                  <MapPin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => fetchWeatherData()}
                  disabled={loading}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 border border-green-500/50 rounded-xl text-green-300 transition-all duration-200"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
                <p className="text-green-200 text-lg">
                  Carregando dados do clima...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-600/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-red-500/40">
                <p className="text-red-200 text-center font-medium">{error}</p>
              </div>
            )}

            {/* Weather Data */}
            {weatherData && !loading && (
              <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-8 mb-6 border border-green-500/30">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-2">
                    {weatherData.name}
                  </h2>
                  <p className="text-green-200">{weatherData.sys?.country}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Main Weather */}
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <img
                        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                        alt={weatherData.weather[0].description}
                        className="w-20 h-20 mx-auto"
                      />
                    </div>
                    <div className="text-6xl font-bold text-yellow-400 mb-2">
                      {Math.round(weatherData.main.temp)}°C
                    </div>
                    <p className="text-xl text-green-200 mb-2">
                      {weatherData.weather[0].description}
                    </p>
                    <p className="text-green-300">
                      Sensação térmica:{" "}
                      {Math.round(weatherData.main.feels_like)}°C
                    </p>
                  </div>

                  {/* Weather Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/60 rounded-xl p-4 text-center border border-green-500/20">
                      <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-green-200 text-sm">Umidade</p>
                      <p className="text-yellow-400 font-bold text-lg">
                        {weatherData.main.humidity}%
                      </p>
                    </div>
                    <div className="bg-slate-700/60 rounded-xl p-4 text-center border border-green-500/20">
                      <Wind className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-green-200 text-sm">Vento</p>
                      <p className="text-yellow-400 font-bold text-lg">
                        {weatherData.wind.speed} km/h
                      </p>
                    </div>
                    <div className="bg-slate-700/60 rounded-xl p-4 text-center border border-green-500/20">
                      <Gauge className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-green-200 text-sm">Pressão</p>
                      <p className="text-yellow-400 font-bold text-lg">
                        {weatherData.main.pressure} mb
                      </p>
                    </div>
                    <div className="bg-slate-700/60 rounded-xl p-4 text-center border border-green-500/20">
                      <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-green-200 text-sm">Visibilidade</p>
                      <p className="text-yellow-400 font-bold text-lg">
                        {weatherData.visibility / 1000} km
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Forecast Data */}
            {forecastData.length > 0 && !loading && (
              <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-green-500/30 mt-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-6 text-center">
                  Previsão para os próximos dias
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {forecastData.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-700/60 rounded-xl p-4 text-center border border-green-500/20"
                    >
                      <p className="text-green-200 text-sm font-medium mb-2">
                        {idx === 0 ? "Hoje" : formatDate(item.dt_txt)}
                      </p>
                      <div className="flex justify-center mb-3">
                        <img
                          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                          alt={item.weather[0].description}
                          className="w-10 h-10 mx-auto"
                        />
                      </div>
                      <div className="mb-2">
                        <span className="text-yellow-400 font-bold text-lg">
                          {Math.round(item.main.temp_max)}°
                        </span>
                        <span className="text-green-300 text-sm ml-1">
                          {Math.round(item.main.temp_min)}°
                        </span>
                      </div>
                      <p className="text-green-200 text-xs mb-2">
                        {item.weather[0].description}
                      </p>
                      <div className="flex items-center justify-center text-blue-300 text-xs">
                        <Droplets className="w-3 h-3 mr-1" />
                        {item.pop ? Math.round(item.pop * 100) : 0}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WeatherApp;
