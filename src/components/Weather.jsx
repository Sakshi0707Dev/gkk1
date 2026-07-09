import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Thermometer, Droplets, Cloud, Wind, MapPin, Calendar } from 'lucide-react';

const Weather = () => {
  const [city, setCity] = useState('Mumbai');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');

    try {
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('City not found. Please check the city name.');
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#2E7D32] font-semibold hover:text-[#1B5E20] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#388E3C] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Cloud className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Weather Updates
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Check real-time weather for your location
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={fetchWeather} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#2E7D32] focus:outline-none transition-colors text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2E7D32] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#1B5E20] transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-center">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Weather Display */}
      {weather && (
        <section className="py-8 md:py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{weather.name}, {weather.sys.country}</span>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Cloud className="w-16 h-16 text-[#2E7D32]" />
                  <div className="text-center">
                    <p className="text-6xl md:text-7xl font-bold text-gray-900">
                      {Math.round(weather.main.temp)}°
                    </p>
                    <p className="text-lg text-gray-500 capitalize">
                      {weather.weather[0].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Thermometer className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Feels Like</p>
                  <p className="text-xl font-bold text-gray-900">{Math.round(weather.main.feels_like)}°C</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Humidity</p>
                  <p className="text-xl font-bold text-gray-900">{weather.main.humidity}%</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Wind className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Wind Speed</p>
                  <p className="text-xl font-bold text-gray-900">{weather.wind.speed} m/s</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Weather;