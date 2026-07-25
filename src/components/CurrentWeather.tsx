import * as Icons from "lucide-react";
import { WeatherData } from "../types";

interface CurrentWeatherProps {
  weather: WeatherData;
}

export default function CurrentWeather({ weather }: CurrentWeatherProps) {
  const { current, location } = weather;
  const IconComponent = (Icons as any)[current.icon] || Icons.Cloud;

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{location.name}</h2>
          <p className="text-gray-500">{location.country}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">Current Weather</p>
        </div>
      </div>

      <div className="flex items-center gap-8 mb-10">
        <div className="p-4 bg-blue-50 rounded-2xl">
          <IconComponent className="w-16 h-16 text-blue-600" />
        </div>
        <div>
          <div className="text-6xl font-black text-gray-900 leading-none">
            {Math.round(current.temp)}°
          </div>
          <p className="text-xl text-gray-600 font-medium mt-1">{current.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icons.Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-gray-400 uppercase">Humidity</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{current.humidity}%</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icons.Wind className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-gray-400 uppercase">Wind</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{current.windSpeed} km/h</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icons.CloudRain className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-gray-400 uppercase">Rain Prob.</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{current.precip}%</p>
        </div>
      </div>
    </div>
  );
}
