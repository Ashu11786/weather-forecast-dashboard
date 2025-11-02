import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");

  const handle = () => {
    if (!q.trim()) return alert("Enter a city name");
    onSearch(q.trim());
    setQ("");
  };

  return (
    <div className="search-area" style={{ display: "flex", justifyContent: "center" }}>
      <input
        placeholder="Enter city name (e.g., London)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handle()}
        style={{ padding: 10, width: 320, borderRadius: 8, border: "1px solid #ddd" }}
      />
      <button onClick={handle} style={{ marginLeft: 8, padding: "10px 14px", borderRadius: 8, background: "var(--primary)", color: "#fff", border: "none" }}>
        Search
      </button>
    </div>
  );
}
