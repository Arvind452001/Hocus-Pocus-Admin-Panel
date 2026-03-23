import axiosFormData from "./axiosFormData";
import axiosJSONData from "./axiosJSONData";


// 🔹 GET All Cards
export const getCardsApi = (params) => {
  return axiosJSONData.get("/admin/cards", {
    params: params,
  });
};


// 🔹 GET Card By ID
export const getCardByIdApi = async (cardId) => {
  return axiosJSONData.get(`/admin/cards/${cardId}`);
};


// CREATE
export const createCardApi = (formData) => {
  return axiosFormData.post("/admin/card", formData);
};

// UPDATE
export const updateCardApi = (id, formData) => {
  return axiosFormData.put(`/admin/cards/${id}/`, formData);
};


// 🔹 DELETE Card
export const deleteCardApi = async (cardId) => {
  return axiosJSONData.delete(`/admin/card/${cardId}`);
};