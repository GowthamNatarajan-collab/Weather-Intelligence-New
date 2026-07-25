# Weather Intelligence

A sophisticated weather dashboard built with React, Express, and Gemini AI. This application provides real-time weather data, 7-day forecasts, and AI-driven planning recommendations based on current atmospheric conditions.

## Features

- **Global City Search**: Search for weather data in any city worldwide using the Open-Meteo Geocoding API.
- **Current Weather Insights**: View temperature, humidity, wind speed, and precipitation probability at a glance.
- **24-Hour Trend**: Interactive temperature chart showing the upcoming 24-hour atmospheric trend.
- **7-Day Forecast**: Extended outlook with daily high/low temperatures and conditions.
- **AI Planning Recommendations**: Personalized insights powered by Gemini AI (requires API key) for clothing, activities, and travel.

## Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, Motion (Framer Motion), Lucide Icons.
- **Backend**: Express.js, TypeScript.
- **Data Visualization**: Recharts.
- **APIs**: Open-Meteo (Weather & Geocoding), Google Gemini AI.

## Configuration

To unlock the AI recommendations feature, you must provide a Gemini API key:

1. Go to the **Settings** menu in AI Studio.
2. Open the **Secrets** panel.
3. Add a new secret named `GEMINI_API_KEY`.
4. Provide your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Development

The app uses a full-stack architecture with a custom Express server.

- `npm run dev`: Starts the development server using `tsx`.
- `npm run build`: Builds the frontend and bundles the server code into `dist/`.
- `npm run start`: Runs the production build.
