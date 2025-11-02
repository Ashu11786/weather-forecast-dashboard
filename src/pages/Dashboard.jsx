import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWeather,
  toggleUnit,
  toggleDarkMode,
  addFavorite,
  removeFavorite,
  addRecent,
} from "../redux/weatherSlice";
import CityCard from "../components/CityCard.jsx";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [city, setCity] = useState("");
  const { cities, favorites, recent, unit, darkMode, status, error } =
    useSelector((state) => state.weather);

  const handleSearch = async () => {
    if (city.trim()) {
      const res = await dispatch(fetchWeather(city));
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(addRecent(res.payload));
      }
      setCity("");
    }
  };

  const convertTemp = (tempC) =>
    unit === "C"
      ? `${tempC.toFixed(1)}°C`
      : `${((tempC * 9) / 5 + 32).toFixed(1)}°F`;

  // 🆕 Function to open forecast chart in new browser tab
  const handleOpenForecast = (cityName) => {
    const forecastWindow = window.open("", "_blank");
    const themeBg = darkMode ? "#1a1a1a" : "#f8f9fa";
    const themeText = darkMode ? "#ffffff" : "#212529";

    forecastWindow.document.write(`
      <html>
        <head>
          <title>${cityName} Forecast</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
              background: ${themeBg};
              color: ${themeText};
            }
            h2 {
              margin-bottom: 10px;
            }
            canvas {
              max-width: 90%;
              margin-top: 20px;
            }
            .details {
              display: flex;
              justify-content: center;
              gap: 20px;
              flex-wrap: wrap;
              margin-top: 25px;
              font-size: 16px;
            }
            .detail-box {
              background: ${darkMode ? "#333" : "#ffffff"};
              color: ${themeText};
              border-radius: 10px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              padding: 15px 25px;
              min-width: 120px;
            }
            img {
              width: 60px;
              height: 60px;
            }
            button {
              margin-top: 30px;
              padding: 10px 20px;
              background: #d9534f;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <h2>Loading forecast for ${cityName}...</h2>
          <canvas id="forecastChart"></canvas>
          <div id="details"></div>
          <button onclick="window.close()">Close Tab</button>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <script>
            const apiKey = '${process.env.REACT_APP_WEATHER_API_KEY}';
            fetch('https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=' + apiKey)
              .then(res => res.json())
              .then(data => {
                const list = data.list.slice(0, 10);
                const labels = list.map(e => new Date(e.dt_txt).toLocaleString('en-IN', { hour: '2-digit', day: 'numeric', month: 'short' }));
                const temps = list.map(e => e.main.temp);
                const hums = list.map(e => e.main.humidity);
                const winds = list.map(e => e.wind.speed);

                const ctx = document.getElementById('forecastChart').getContext('2d');
                new Chart(ctx, {
                  type: 'line',
                  data: {
                    labels,
                    datasets: [{
                      label: 'Temperature (°C)',
                      data: temps,
                      borderColor: '#007bff',
                      backgroundColor: 'rgba(0, 123, 255, 0.2)',
                      fill: true,
                      tension: 0.3
                    }]
                  },
                  options: {
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Next 5-Day Temperature Trend'
                      }
                    },
                    scales: {
                      y: { beginAtZero: false }
                    }
                  }
                });

                // Current weather details (from first record)
                const curr = list[0];
                const weather = curr.weather[0];
                const icon = 'https://openweathermap.org/img/wn/' + weather.icon + '@2x.png';

                document.querySelector('h2').innerText = '5-Day Forecast for ${cityName}';
                document.getElementById('details').innerHTML = \`
                  <div class="details">
                    <div class="detail-box">
                      <img src="\${icon}" alt="weather icon" />
                      <div>\${weather.description.toUpperCase()}</div>
                    </div>
                    <div class="detail-box">🌡 Temp: \${curr.main.temp}°C</div>
                    <div class="detail-box">💧 Humidity: \${curr.main.humidity}%</div>
                    <div class="detail-box">🌬 Wind: \${curr.wind.speed} m/s</div>
                    <div class="detail-box">☁️ Clouds: \${curr.clouds.all}%</div>
                  </div>
                \`;
              })
              .catch(() => {
                document.querySelector('h2').innerText = 'Failed to load forecast data.';
              });
          </script>
        </body>
      </html>
    `);
  };


  return (
    <div className={darkMode ? "dashboard dark" : "dashboard"}>
      <div className="header">
        <h1>🌦 Weather Analytics Dashboard</h1>
        <div className="toggles">
          <button onClick={() => dispatch(toggleUnit())}>
            °{unit === "C" ? "F" : "C"}
          </button>
          <button onClick={() => dispatch(toggleDarkMode())}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      <div className="search-box">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {status === "loading" && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}

      {/* Current cities */}
      <div className="section">
        <h2>🌤 Current Cities</h2>
        <div className="city-list">
          {cities.length === 0 && <p>No cities loaded yet.</p>}
          {cities.map((c) => (
            <div key={c.id} onClick={() => handleOpenForecast(c.name)}>
              <CityCard
                city={c}
                unit={unit}
                convertTemp={convertTemp}
                isFavorite={favorites.some((f) => f.id === c.id)}
                onToggleFavorite={() =>
                  favorites.some((f) => f.id === c.id)
                    ? dispatch(removeFavorite(c.id))
                    : dispatch(addFavorite(c))
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Favorite cities */}
      <div className="section">
        <h2>⭐ Favorite Cities</h2>
        <div className="city-list">
          {favorites.length === 0 && <p>No favorites yet.</p>}
          {favorites.map((c) => (
            <div key={c.id} onClick={() => handleOpenForecast(c.name)}>
              <CityCard
                city={c}
                unit={unit}
                convertTemp={convertTemp}
                isFavorite
                onToggleFavorite={() => dispatch(removeFavorite(c.id))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Recently searched */}
      <div className="section">
        <h2>🕓 Recently Searched</h2>
        <div className="city-list">
          {recent.length === 0 && <p>No recent searches yet.</p>}
          {recent.map((c) => (
            <div key={c.id} onClick={() => handleOpenForecast(c.name)}>
              <CityCard
                city={c}
                unit={unit}
                convertTemp={convertTemp}
                isFavorite={favorites.some((f) => f.id === c.id)}
                onToggleFavorite={() =>
                  favorites.some((f) => f.id === c.id)
                    ? dispatch(removeFavorite(c.id))
                    : dispatch(addFavorite(c))
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
