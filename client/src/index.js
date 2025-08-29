import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { SearchContextProvider } from "./context/SearchContext";
import axios from 'axios'; // <-- IMPORT AXIOS

axios.defaults.baseURL = "https://iitg-connect-hub-api.onrender.com/api"; // <-- SET THE BASE URL
axios.defaults.withCredentials = true; // <-- ADD THIS LINE

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SearchContextProvider>
        <App />
      </SearchContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
