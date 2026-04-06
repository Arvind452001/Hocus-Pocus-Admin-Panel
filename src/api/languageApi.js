import axios from "axios";
import { BASE_URL } from "../config/apiConfig";

export const updateLanguageApi = async (lang) => {
  const token = localStorage.getItem("token");
console.log("Updating language to:", lang);
  const formData = new URLSearchParams();
  formData.append("language", lang);

  return axios.post(
    `${BASE_URL}/settings/language/update`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        accept: "application/json",
      },
    }
  );
};



         