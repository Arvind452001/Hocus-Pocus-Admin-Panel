import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./main.css";   // ✅ correct CSS import
import { LanguageProvider } from "./context/LanguageProvider"; // NEW
import App from "./App";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider> {/* Wrap the whole app */}
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
