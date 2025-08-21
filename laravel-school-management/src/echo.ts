// src/realtime/echo.ts
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

let echoInstance: Echo | null = null;

export const getEcho = () => {
  if (echoInstance) return echoInstance;

  const token = localStorage.getItem("token");

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY || "local-key",
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
    forceTLS: false,
    enabledTransports: ["ws", "wss"],
    authEndpoint: "http://localhost:8000/broadcasting/auth",
    auth: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });

  return echoInstance;
};
