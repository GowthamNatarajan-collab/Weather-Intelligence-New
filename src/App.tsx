import { useState, useEffect } from "react";
import { Cloud, MapPin, Loader2, AlertCircle } from "lucide-react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import ForecastGrid from "./components/ForecastGrid";
import WeatherChart from "./components/WeatherChart";
import AIRecommendations from "./components/AIRecommendations";
import { WeatherData, Recommendation, WeatherResponse } from "./types";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (searchCity: string) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `/api/weather?city=${encodeURIComponent(searchCity)}`;
      const response = await fetch(apiUrl);
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}: Failed to fetch weather`);
        }
        throw new Error(`API failed with status ${response.status}. The request to ${apiUrl} returned ${contentType || "unknown content"}.`);
      }

      if (!contentType?.includes("application/json")) {
        console.error("Non-JSON response received:", contentType);
        throw new Error(`Received an unexpected ${contentType || "HTML"} response. This means Cloudflare is serving your static index.html instead of the API function. Please ensure the 'functions' folder is at the repository root and you have pushed your latest changes to GitHub.`);
      }

      const data: WeatherResponse = await response.json();
      setWeather(data.weather);
      setRecommendations(data.recommendations);
    } catch (err: any) {
      console.error("Weather fetch error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather("London");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans selection:bg-blue-100">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Cloud className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Weather Intelligence</h1>
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <MapPin className="w-2.5 h-2.5" />
                <span>Global Forecast System</span>
              </div>
            </div>
          </div>
          <SearchBar onSearch={fetchWeather} isLoading={loading} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8 pb-12">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && !weather ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">
              Analyzing Atmospheric Patterns...
            </p>
          </div>
        ) : weather ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Top Section: Current & Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <CurrentWeather weather={weather} />
              </div>
              <div className="lg:col-span-7">
                <WeatherChart hourly={weather.hourly} />
              </div>
            </div>

            {/* Recommendations Section */}
            <AIRecommendations recommendations={recommendations} />

            {/* Forecast Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">7-Day Outlook</h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Extended Forecast</span>
              </div>
              <ForecastGrid forecast={weather.forecast} />
            </section>
          </motion.div>
        ) : null}
      </main>

      <footer className="border-t border-gray-100 py-8 px-6 text-center">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Powered by Open-Meteo & Gemini AI
        </p>
      </footer>
    </div>
  );
}
