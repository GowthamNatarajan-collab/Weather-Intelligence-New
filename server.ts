import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini (will be done per-request if API key exists)

// Weather Code to Human Readable
const getWeatherDescription = (code: number) => {
  const codes: Record<number, { text: string; icon: string }> = {
    0: { text: "Clear sky", icon: "Sun" },
    1: { text: "Mainly clear", icon: "CloudSun" },
    2: { text: "Partly cloudy", icon: "CloudSun" },
    3: { text: "Overcast", icon: "Cloud" },
    45: { text: "Fog", icon: "CloudFog" },
    48: { text: "Depositing rime fog", icon: "CloudFog" },
    51: { text: "Light drizzle", icon: "CloudDrizzle" },
    53: { text: "Moderate drizzle", icon: "CloudDrizzle" },
    55: { text: "Dense drizzle", icon: "CloudDrizzle" },
    61: { text: "Slight rain", icon: "CloudRain" },
    63: { text: "Moderate rain", icon: "CloudRain" },
    65: { text: "Heavy rain", icon: "CloudRain" },
    71: { text: "Slight snow", icon: "CloudSnow" },
    73: { text: "Moderate snow", icon: "CloudSnow" },
    75: { text: "Heavy snow", icon: "CloudSnow" },
    77: { text: "Snow grains", icon: "CloudSnow" },
    80: { text: "Slight rain showers", icon: "CloudRain" },
    81: { text: "Moderate rain showers", icon: "CloudRain" },
    82: { text: "Violent rain showers", icon: "CloudRain" },
    95: { text: "Thunderstorm", icon: "CloudLightning" },
  };
  return codes[code] || { text: "Unknown", icon: "Cloud" };
};

app.get("/api/weather", async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    // 1. Geocoding
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city as string
      )}&count=1&language=en&format=json`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    const location = geoData.results[0];
    const { latitude, longitude, name, country } = location;

    // 2. Forecast
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=temperature_2m&timezone=auto`
    );
    const weatherData = await weatherRes.json();

    const currentDesc = getWeatherDescription(weatherData.current.weather_code);

    const formattedData = {
      location: { name, country, lat: latitude, lon: longitude },
      current: {
        temp: weatherData.current.temperature_2m,
        description: currentDesc.text,
        icon: currentDesc.icon,
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: weatherData.current.wind_speed_10m,
        precip: weatherData.daily.precipitation_probability_max[0],
      },
      forecast: weatherData.daily.time.map((time: string, i: number) => {
        const desc = getWeatherDescription(weatherData.daily.weather_code[i]);
        return {
          date: time,
          tempMax: weatherData.daily.temperature_2m_max[i],
          tempMin: weatherData.daily.temperature_2m_min[i],
          description: desc.text,
          icon: desc.icon,
          precipProb: weatherData.daily.precipitation_probability_max[i],
        };
      }),
      hourly: weatherData.hourly.time
        .slice(0, 24)
        .map((time: string, i: number) => ({
          time,
          temp: weatherData.hourly.temperature_2m[i],
        })),
    };

    // 3. AI Recommendations
    let recommendations = [];
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (apiKey) {
      try {
        const prompt = `Based on the following weather in ${name}, ${country}:
Current Temp: ${formattedData.current.temp}°C, ${formattedData.current.description}.
Humidity: ${formattedData.current.humidity}%, Wind: ${formattedData.current.windSpeed} km/h.
7-day forecast shows max temps around ${formattedData.forecast[0].tempMax}°C and min around ${formattedData.forecast[0].tempMin}°C.
Provide exactly 4 specific planning recommendations for today and the week.
Return the result as a JSON array of objects with 'category', 'advice', and 'icon' fields.`;

        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        const aiResponse = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  advice: { type: Type.STRING },
                  icon: { type: Type.STRING },
                },
                required: ["category", "advice", "icon"],
              },
            },
          },
        });

        recommendations = JSON.parse(aiResponse.text || "[]");
      } catch (aiError) {
        console.error("AI Recommendation error:", aiError);
        // Fallback to empty recommendations if AI fails
      }
    }

    res.json({ weather: formattedData, recommendations });
  } catch (error) {
    console.error("Weather fetch error:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
