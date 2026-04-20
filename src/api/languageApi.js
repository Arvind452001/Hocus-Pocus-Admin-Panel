import axios from "axios";
import { BASE_URL } from "../config/apiConfig";


export const updateLanguageApi = async (lang) => {
  console.log("api call",lang)
  const token = localStorage.getItem("token");

  const formData = new URLSearchParams();
  formData.append("language", lang);

  return axios.post(
    `${BASE_URL}/settings/language/update`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "Accept-Language": lang, // ✅ ADD THIS
      },
    }
  );
};