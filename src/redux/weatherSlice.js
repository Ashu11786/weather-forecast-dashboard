import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY =
  process.env.REACT_APP_WEATHER_API_KEY ||
  "7a7a122f691fbe6c6d28c559a47bdbb1";

// Load from localStorage
const loadState = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (city) => {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=metric&appid=${API_KEY}`
    );
    return res.data;
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    cities: [],
    favorites: loadState("favorites", []),
    recent: loadState("recent", []),
    unit: loadState("unit", "C"),
    darkMode: loadState("darkMode", false),
    status: "idle",
    error: null,
  },
  reducers: {
    toggleUnit(state) {
      state.unit = state.unit === "C" ? "F" : "C";
      localStorage.setItem("unit", JSON.stringify(state.unit));
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(state.darkMode));
    },
    addFavorite(state, action) {
      const exists = state.favorites.find((c) => c.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
        localStorage.setItem("favorites", JSON.stringify(state.favorites));
      }
    },
    removeFavorite(state, action) {
      state.favorites = state.favorites.filter((c) => c.id !== action.payload);
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },
    addRecent(state, action) {
      const exists = state.recent.find((c) => c.id === action.payload.id);
      if (!exists) {
        state.recent.unshift(action.payload);
        if (state.recent.length > 5) state.recent.pop();
        localStorage.setItem("recent", JSON.stringify(state.recent));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = "succeeded";
        const exists = state.cities.find((c) => c.id === action.payload.id);
        if (!exists) state.cities.unshift(action.payload);
        else {
          state.cities = state.cities.map((c) =>
            c.id === action.payload.id ? action.payload : c
          );
        }
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  toggleUnit,
  toggleDarkMode,
  addFavorite,
  removeFavorite,
  addRecent,
} = weatherSlice.actions;
export default weatherSlice.reducer;
