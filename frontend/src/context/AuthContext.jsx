// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
// Replace these with your real service functions if available:
// import { getProfile, loginRequest, registerRequest } from "../services/auth.service";
// import storage from "../services/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const profile = await fetchUserProfile(token); // implement below
        setUser(profile);
      } catch (err) {
        console.error("Auth: failed to fetch profile", err);
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (credentials) => {
    // Replace this with real API call:
    // const { token: t } = await loginRequest(credentials);
    // localStorage.setItem("token", t);
    // setToken(t);

    throw new Error("login() not implemented — wire to your auth service.");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    loading,
    setUser,
    setToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

/* ---------- Helpers (replace with your services) ---------- */

// Minimal example of profile fetch to be replaced by your API call.
// Keep this file self-contained while you wire in real services.
async function fetchUserProfile(jwt) {
  // Example: call your API with fetch/axios:
  // const res = await fetch("/api/me", { headers: { Authorization: `Bearer ${jwt}` }});
  // if (!res.ok) throw new Error("Unauthorized");
  // return await res.json();

  // Temporary stub — remove once real API wired:
  await delay(300); // simulate latency
  // For local dev you can return a fake admin user:
  return { id: 1, name: "Dev Admin", role: "admin", email: "admin@example.com" };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
