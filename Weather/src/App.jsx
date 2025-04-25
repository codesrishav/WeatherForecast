import { useState } from 'react';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
      const res = await axios.get(url);
      setWeather(res.data);
    } catch (error) {
      alert("City not found!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-indigo-500 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-6">🌦️ Weather Forecast</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city..."
          className="px-4 py-2 rounded shadow-md focus:outline-none"
        />
        <button
          onClick={fetchWeather}
          className="bg-white px-4 py-2 rounded shadow hover:bg-gray-200"
        >
          Search
        </button>
      </div>

      {weather && (
        <div className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-xl text-white shadow-lg mt-4 text-center">
          <h2 className="text-2xl font-semibold">{weather.name}, {weather.sys.country}</h2>
          <p className="text-xl mt-2">🌡 {weather.main.temp}°C</p>
          <p className="capitalize">☁️ {weather.weather[0].description}</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬 Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}
console.log("API Key:", import.meta.env.VITE_WEATHER_API_KEY);

export default App;
