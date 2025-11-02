import React from "react";

const WeatherDetails = ({ weather, onAddFavorite, unit }) => {
  if (!weather) return null;

  const temp =
    unit === "C"
      ? weather.main.temp.toFixed(2)
      : ((weather.main.temp * 9) / 5 + 32).toFixed(2);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 text-center max-w-sm mx-auto mt-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {weather.name}
      </h2>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-2 capitalize">
        {weather.weather[0].description}
      </p>
      <h1 className="text-4xl font-bold mb-2 text-blue-500">{temp}°{unit}</h1>

      <div className="flex justify-around text-sm text-gray-600 dark:text-gray-300 mt-4">
        <p>💧 Humidity: {weather.main.humidity}%</p>
        <p>🌬 Wind: {weather.wind.speed} m/s</p>
      </div>

      <button
        onClick={() => onAddFavorite(weather.name)}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
      >
        Add to Favorites
      </button>
    </div>
  );
};

export default WeatherDetails;
