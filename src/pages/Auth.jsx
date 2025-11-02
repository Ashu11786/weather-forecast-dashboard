import React, { useEffect } from "react";

function Auth({ setUser }) {
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "1053098885389-scc8ljdmkq93lmqro81gcle7dk817b9o.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("google-signin-btn"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCredentialResponse = (response) => {
    const userData = decodeJwtResponse(response.credential);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const decodeJwtResponse = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>🌦️ Weather Analytics Dashboard</h1>
      <p>Sign in with Google to save favorites & preferences (local)</p>
      <p style={{ color: "gray", fontSize: "14px" }}>
        Note: This project uses client-side Google Sign-In and stores session in
        localStorage.
      </p>
      <div id="google-signin-btn" style={{ marginTop: "20px" }}></div>
    </div>
  );
}

export default Auth;
