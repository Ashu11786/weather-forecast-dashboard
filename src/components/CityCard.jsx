import React from "react";

const CityCard = ({ city, convertTemp, isFavorite, onToggleFavorite }) => (
  <div className="city-card">
    <h3>{city.name}</h3>
    <p className="temp">{convertTemp(city.main.temp)}</p>
    <p style={{ textTransform: "capitalize" }}>{city.weather[0].description}</p>
    <button onClick={onToggleFavorite}>
      {isFavorite ? "💔 Remove Favorite" : "❤️ Add Favorite"}
    </button>
  </div>
);

export default CityCard;
