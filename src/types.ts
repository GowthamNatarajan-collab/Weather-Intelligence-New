export interface WeatherData {
  current: {
    temp: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
    precip: number;
  };
  forecast: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    description: string;
    icon: string;
    precipProb: number;
  }>;
  hourly: Array<{
    time: string;
    temp: number;
  }>;
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
}

export interface Recommendation {
  category: string;
  advice: string;
  icon: string;
}

export interface WeatherResponse {
  weather: WeatherData;
  recommendations: Recommendation[];
}
