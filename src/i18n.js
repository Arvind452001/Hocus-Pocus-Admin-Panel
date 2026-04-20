import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import tr from "./locales/tr/translation.json";
import hi from "./locales/hi/translation.json"; // ✅ add this

const savedLang = localStorage.getItem("lang") || "tr";

i18n.use(initReactI18next).init({
  resources: {
    hi: { translation: hi },
    en: { translation: en },
    tr: { translation: tr },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;