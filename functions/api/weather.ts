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

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const city = url.searchParams.get("city");

  if (!city) {
    return new Response(JSON.stringify({ error: "City is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // 1. Geocoding
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}&count=1&language=en&format=json`
    );
    const geoData: any = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return new Response(JSON.stringify({ error: "City not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const location = geoData.results[0];
    const { latitude, longitude, name, country } = location;

    // 2. Forecast
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=temperature_2m&timezone=auto`
    );
    const weatherData: any = await weatherRes.json();

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
    const apiKey = env.GEMINI_API_KEY;

    if (apiKey) {
      const prompt = `Based on the following weather in ${name}, ${country}:
Current Temp: ${formattedData.current.temp}°C, ${formattedData.current.description}.
Humidity: ${formattedData.current.humidity}%, Wind: ${formattedData.current.windSpeed} km/h.
7-day forecast shows max temps around ${formattedData.forecast[0].tempMax}°C and min around ${formattedData.forecast[0].tempMin}°C.
Provide exactly 4 specific planning recommendations for today and the week.
Return the result as a JSON array of objects with 'category', 'advice', and 'icon' (Lucide icon name like 'Shirt', 'Coffee', 'Car') fields.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    category: { type: "STRING" },
                    advice: { type: "STRING" },
                    icon: { type: "STRING" },
                  },
                  required: ["category", "advice", "icon"],
                },
              },
            },
          }),
        }
      );

      if (response.ok) {
        const aiData: any = await response.json();
        const text = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
        recommendations = JSON.parse(text || "[]");
      } else {
        console.error("Gemini API error:", await response.text());
      }
    }

    return new Response(
      JSON.stringify({ weather: formattedData, recommendations }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
