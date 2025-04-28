import React, { createContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  login as loginApi,
  register as registerApi,
} from "../api/auth";
import { debugAuthToken, isTokenExpired } from "../utils/authDebugger";

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found, skipping current user fetch");
        setLoading(false);
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        console.warn(
          "Token is expired, clearing and skipping current user fetch"
        );
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      console.log("Fetching current user with token");
      const response = await getCurrentUser();

      console.log("Current user response:", response);
      if (response.data) {
        setUser(response.data);
      }
    } catch (err) {
      console.error("Error fetching current user:", err);

      // Even if error occurs, set user to null and allow app to continue
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (credentials) => {
    try {
      console.log("Login with credentials:", credentials);
      const response = await loginApi(credentials);

      console.log("Login response:", response);
      if (response.data && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        // Debug the token we just stored
        debugAuthToken();
        await fetchCurrentUser();
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
      return false;
    }
  };

  const register = async (userData) => {
    try {
      console.log("Register with data:", userData);
      const response = await registerApi(userData);

      console.log("Registration response:", response);
      if (response && response.data) {
        // Registration successful
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Registration error:", err);
      // More detailed error logging
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);
      } else if (err.request) {
        console.error("Error request:", err.request);
      } else {
        console.error("Error message:", err.message);
      }

      // Pass along the error message from the backend if available
      const errorMessage =
        err.response?.data?.detail || err.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Provide all the auth values and functions
  const contextValue = {
    user,
    loading,
    error,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// No default export to force the use of named imports
