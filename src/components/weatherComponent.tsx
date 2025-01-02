import { Droplet, Search, Sun, Wind } from "lucide-react";
import { useEffect, useState } from "react";

type LocationDataProps = {
  cityName?: string;
  cityLat?: number;
  cityLon?: number;
};

type WeatherDataProps = {
  cityTemp?: number;
  cityHumidity?: number;
  cityWindSpeed?: number;
};

export function WeatherComponent() {
  const [locationData, setLocationData] = useState<LocationDataProps | null>(
    null
  );
  const [weatherData, setWeatherData] = useState<WeatherDataProps | null>(null);
  const [city, setCity] = useState("");

  const searchLocation = async (city: string) => {
    try {
      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${
        import.meta.env.VITE_WEATHER_APP_ID
      }`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setLocationData({
        cityName: data[0].name,
        cityLat: data[0].lat,
        cityLon: data[0].lon,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const searchWeatherData = async (locationData: LocationDataProps) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${locationData.cityLat}&longitude=${locationData.cityLon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setWeatherData({
        cityTemp: data.current.temperature_2m,
        cityHumidity: data.hourly.relative_humidity_2m[0], 
        cityWindSpeed: data.current.wind_speed_10m, 
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    if (city) {
      searchLocation(city);
      console.log(city);
    }
  };

  useEffect(() => {
    if (locationData) {
      searchWeatherData(locationData);
    }
  }, [locationData]);

  return (
    <section className="space-y-8">
      <div className="flex gap-2">
        <input
          type="text"
          className="rounded-md bg-transparent border border-[#b0b0b0] px-3 py-2"
          placeholder="Digite o nome da cidade"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="flex items-center justify-center bg-[#f7ae2b] rounded-md px-3 py-2 gap-2"
          onClick={handleSearch}
        >
          Pesquisar <Search className="w-4 h-4" />
        </button>
      </div>

      {locationData && weatherData && (
        <div className="flex flex-col items-center justify-center py-8 gap-10 bg-[#0d0d0d] border border-[#27272a] rounded-md">
          <div>
            <Sun className="w-20 h-20" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-5xl">{weatherData.cityTemp} ºC</h2>
            <h3 className="text-3xl">{locationData.cityName}</h3>
          </div>
          <div className="flex gap-20">
            <div className="flex gap-2">
              <div>
                <Droplet />
              </div>
              <span>{weatherData.cityHumidity} %</span>
            </div>
            <div className="flex gap-2">
              <div>
                <Wind />
              </div>
              <span>{weatherData.cityWindSpeed} Km/h</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
