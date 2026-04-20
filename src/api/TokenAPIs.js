import { BASE_URL } from "../config/apiConfig";
import axiosFormData from "./axiosFormData"
import axiosJSONData from "./axiosJSONData"
import axios from "axios";


// ✅ Add Tokens

export const addTokensApi = (userId, amount) => {
  const formData = new FormData()
  formData.append("amount", amount)

  return axiosFormData.post(
    `/admin/add-tokens/${userId}`,
    formData
  )
}

export const deductTokensApi = (userId, amount) => {
  const formData = new FormData()
  formData.append("amount", amount)

  return axiosFormData.post(
    `/admin/deduct-tokens/${userId}`,
    formData
  )
}

// ✅ Reset Tokens
export const resetTokensApi = (userId) => {
  return axiosJSONData.post(`/admin/reset-tokens/${userId}`)
}

// ✅ Extend Token Expiry
export const extendTokenExpiryApi = (userId, amount) => {
  return axiosJSONData.post(
    `/admin/extend-token-expiry/${userId}`,
    new URLSearchParams({ amount }) // or days/months based on backend
  )
}

// ✅ Get Tokens Overview
export const getTokensOverviewApi = () => {
  return axiosJSONData.get(`/admin/tokens/overview`)
}

// ✅ Cleanup Expired Tokens
export const cleanupExpiredTokensApi = () => {
  return axiosJSONData.post(`/admin/tokens/cleanup-expired`)
}

//////////////////////////////////////////////////////////////////////////

// ✅ Get Token Packages
export const getTokenPackagesApi = (params = {}) => {
  return axiosJSONData.get("/admin/token-packages", {
    params: {
      include_inactive: false,
      lang: "en",
      ...params, // 👈 optional override
    },
  });
};


export const createTokenPackageApi = (data) => {
  const formData = new FormData()

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })

  return axiosFormData.post("/admin/token-packages", formData)
}

export const updateTokenPackageApi = (id, data) => {
  const formData = new FormData()

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })

  return axiosFormData.put(`/admin/token-packages/${id}`, formData)
}


export const deleteTokenPackageApi = (id) => {
  return axiosJSONData.delete(`/admin/token-packages/${id}`)
}



export const setPopularPackageApi = (id) => {
  return axiosJSONData.post(
    `/admin/token-packages/${id}/set-popular`
  )
}

////////////////////////////////////////////////////////
// GET Config
export const getTokenConfigApi = () => {
  return axiosJSONData.get("/admin/token-config")
}

// CREATE / UPDATE Config

export const updateTokenConfigApi = async (data) => {
  try {
    const formData = new URLSearchParams();

    formData.append("daily_free_limit", String(data.daily_free_limit));
    formData.append("ad_reward_tokens", String(data.ad_reward_tokens));

    const res = await axios.put(
      `${BASE_URL}/admin/token-config`,
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return res;
  } catch (error) {
    console.error("API Error:", error?.response?.data || error.message);
    throw error;
  }
};