// src/api/Api.js

import axiosJSONData from "./axiosJSONData";


// 🔹 GET All Dreams
export const getDreamsApi = async () => {
  return axiosJSONData.get("/admin/dreams");
};


// 🔹 GET Dream By ID
export const getDreamByIdApi = async (dreamId) => {
  return axiosJSONData.get(`/admin/dreams/${dreamId}`);
};


// 🔹 DELETE Dream
export const deleteDreamApi = async (dreamId) => {
  return axiosJSONData.delete(`/admin/dreams/${dreamId}`);
};