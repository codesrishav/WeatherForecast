import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import WeatherCard from './Weathercard';
import Particles from 'react-tsparticles'; // Import particles from tsparticles

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]); // 7-day forecast
  const [hourlyForecast, setHourlyForecast] = useState([]); // Hourly forecast data
  const [unit, setUnit] = useState('metric'); // metric = Celsius
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    setLoading(true);
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`;

      const weatherRes = await axios.get(weatherUrl);
      const forecastRes = await axios.get(forecastUrl);

      setWeather(weatherRes.data);
      setForecast(forecastRes.data.list.filter((_, idx) => idx % 8 === 0)); // 7-day forecast
      setHourlyForecast(forecastRes.data.list); // All hourly forecast
    } catch (error) {
      alert("City not found!");
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const getBackground = () => {
    if (!weather) return "from-blue-400 to-indigo-700";
    const main = weather.weather[0].main;
    switch (main) {
      case 'Clear':
        return 'from-yellow-300 to-orange-500';
      case 'Clouds':
        return 'from-gray-400 to-gray-700';
      case 'Rain':
        return 'from-blue-700 to-gray-900';
      case 'Snow':
        return 'from-blue-300 to-white';
      default:
        return 'from-blue-400 to-indigo-700';
    }
  };

  const getParticleOptions = () => {
    if (!weather) return {};
    const main = weather.weather[0].main;
    switch (main) {
      case 'Rain':
        return {
          particles: {
            number: { value: 200 },
            size: { value: 3 },
            move: { direction: "bottom", speed: 10 },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            color: { value: "#00bfff" },
          }
        };
      case 'Snow':
        return {
          particles: {
            number: { value: 300 },
            size: { value: 4 },
            move: { direction: "bottom", speed: 3 },
            opacity: { value: 0.7 },
            shape: { type: "circle" },
            color: { value: "#ffffff" },
          }
        };
      case 'Clear':
        return {
          particles: {
            number: { value: 100 },
            size: { value: 5 },
            move: { direction: "top-right", speed: 1 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            color: { value: "#ffff00" },
          }
        };
      case 'Clouds':
        return {
          particles: {
            number: { value: 60 },
            size: { value: 4 },
            move: { direction: "top", speed: 1 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            color: { value: "#d3d3d3" },
          }
        };
      default:
        return {};
    }
  };

  return (
    <div className={`relative min-h-screen bg-gradient-to-b ${getBackground()} flex flex-col items-center justify-center p-6 overflow-hidden`}>
      {/* Add Particles as Background */}
      <Particles
        id="tsparticles"
        options={getParticleOptions()}  // Directly use the options
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl font-bold text-white mb-8 animate-bounce">🌦️ Weather App</h1>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="px-5 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={fetchWeather}
            className="bg-white px-6 py-3 rounded-lg shadow hover:bg-gray-300 transition"
          >
            Search
          </button>
          <button
            onClick={toggleUnit}
            className="bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition text-sm"
          >
            {unit === 'metric' ? '°F' : '°C'}
          </button>
        </div>

        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="text-white text-4xl mt-6"
          >
            🔄
          </motion.div>
        )}

        {weather && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-xl text-white shadow-2xl mt-6 text-center w-80"
          >
            <h2 className="text-2xl font-bold">{weather.name}, {weather.sys.country}</h2>
            <p className="text-lg mt-2">🌡 {weather.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
            <p className="capitalize">☁️ {weather.weather[0].description}</p>
            <p className="mt-2">💧 Humidity: {weather.main.humidity}%</p>
            <p>🌬 Wind: {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
            <p className="text-sm mt-4">{new Date().toLocaleString()}</p>
          </motion.div>
        )}

        {forecast.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10">
            {forecast.map((item, idx) => (
              <WeatherCard
                key={idx}
                day={new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}
                temp={Math.round(item.main.temp)}
                description={item.weather[0].description}
                main={item.weather[0].main}
              />
            ))}
          </div>
        )}

        {/* Hourly Forecast Section */}
        {hourlyForecast.length > 0 && (
          <div className="mt-10 w-full max-w-screen-lg mx-auto">
            <h2 className="text-2xl text-white mb-4">Hourly Forecast</h2>
            <div className="flex overflow-x-auto gap-4">
              {hourlyForecast.slice(0, 24).map((item, idx) => (
                <div key={idx} className="bg-white bg-opacity-20 backdrop-blur-lg p-4 rounded-xl text-white shadow-2xl text-center w-24">
                  <p className="font-semibold">{new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-lg">{Math.round(item.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>
                  <p>{item.weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
