// src/App.js
import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./redux/weatherSlice";
import Dashboard from "./pages/Dashboard.jsx";
import "./App.css";

const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
});

function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <Dashboard />
      </div>
    </Provider>
  );
}

export default App;
