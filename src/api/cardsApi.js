import axiosJSONData from "./axiosJSONData";


// 🔹 GET All Cards
export const getCardsApi = async () => {
  return axiosJSONData.get("/admin/cards");
};


// 🔹 GET Card By ID
export const getCardByIdApi = async (cardId) => {
  return axiosJSONData.get(`/admin/cards/${cardId}`);
};


// 🔹 CREATE Card (Upload)
export const createCardApi = async (data) => {
  return axiosJSONData.post("/admin/card", data);
};


// 🔹 UPDATE Card
export const updateCardApi = async (cardId, data) => {
  return axiosJSONData.put(`/admin/cards/${cardId}`, data);
};


// 🔹 DELETE Card
export const deleteCardApi = async (cardId) => {
  return axiosJSONData.delete(`/admin/card/${cardId}`);
};