import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(localStorage.getItem("wd_theme") === "dark");
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark-mode");
    else document.documentElement.classList.remove("dark-mode");
    localStorage.setItem("wd_theme", dark ? "dark" : "light");
  }, [dark]);
  return (
    <button onClick={() => setDark(d => !d)} style={{ padding: "8px 10px", borderRadius: 8 }}>
      {dark ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}
