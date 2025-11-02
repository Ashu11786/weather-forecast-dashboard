import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ForecastChart({ forecast, unit = "C" }) {
  if (!forecast || !forecast.list) return <div style={{ padding: 20 }}>No forecast available</div>;

  // pick one reading per day (every 8 items)
  const daily = forecast.list.filter((_, i) => i % 8 === 0).slice(0, 5).map(item => ({
    day: new Date(item.dt * 1000).toLocaleDateString(undefined, { weekday: "short" }),
    temp: unit === "C" ? item.main.temp : (item.main.temp * 9 / 5) + 32
  }));

  const hourly = forecast.list.slice(0, 12).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: unit === "C" ? item.main.temp : (item.main.temp * 9 / 5) + 32
  }));

  return (
    <div>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temp" stroke="#1976d2" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h4 style={{ marginTop: 12 }}>Hourly (next entries)</h4>
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={hourly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temp" stroke="#ff8a65" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
