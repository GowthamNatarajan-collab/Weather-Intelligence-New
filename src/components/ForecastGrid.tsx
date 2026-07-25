import * as Icons from "lucide-react";
import { format } from "date-fns";
import { WeatherData } from "../types";

interface ForecastGridProps {
  forecast: WeatherData["forecast"];
}

export default function ForecastGrid({ forecast }: ForecastGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {forecast.map((day, i) => {
        const IconComponent = (Icons as any)[day.icon] || Icons.Cloud;
        const isToday = i === 0;

        return (
          <div
            key={day.date}
            className={`p-4 rounded-2xl border transition-all ${
              isToday
                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-white border-gray-100 text-gray-900 hover:border-blue-200"
            }`}
          >
            <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${isToday ? "text-blue-100" : "text-gray-400"}`}>
              {format(new Date(day.date), "EEE")}
            </p>
            <IconComponent className={`w-8 h-8 mb-4 ${isToday ? "text-white" : "text-blue-600"}`} />
            <div className="mb-2">
              <span className="text-lg font-black">{Math.round(day.tempMax)}°</span>
              <span className={`text-sm ml-2 ${isToday ? "text-blue-100" : "text-gray-400"}`}>
                {Math.round(day.tempMin)}°
              </span>
            </div>
            <p className={`text-[10px] font-medium leading-tight line-clamp-1 ${isToday ? "text-blue-50" : "text-gray-500"}`}>
              {day.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
