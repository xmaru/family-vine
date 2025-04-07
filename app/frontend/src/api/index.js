/**
 * @fileoverview API configuration and setup for the Family Vine application.
 * This file configures axios with base URL, default headers, and authentication interceptors.
 */

import axios from "axios";

/**
 * Base URL for API requests. Falls back to localhost if environment variable is not set.
 * @constant {string}
 */
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

/**
 * Axios instance configured with base URL and default headers.
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request interceptor that adds authentication token to requests.
 * Automatically attaches the JWT token from localStorage to the Authorization header.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor that handles authentication errors globally.
 * - Clears invalid/expired tokens from localStorage
 * - Redirects to login page on 401 Unauthorized errors
 * - Excludes login and register pages from redirect
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors globally
    if (error.response && error.response.status === 401) {
      // If the token is expired or invalid, clear it
      localStorage.removeItem("token");

      // Redirect to login page if not already there
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
