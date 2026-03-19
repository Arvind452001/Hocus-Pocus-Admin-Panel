import { BASE_URL } from "../config/apiConfig";
import axiosFormData from "./axiosFormData";
import axiosJSONData from "./axiosJSONData";
import axios from "axios";


// 🟢dashboard data Api
export const loginApi = (data) => {
  console.log(data);
  
  return axiosFormData.post("/auth/login",data);
};

// 🟢dashboard data Api
export const getDashboaranalyticsdApi = () => {
  return axiosFormData.get("/admin/dashboard/stats");
};

// Get User data Api
export const getUsersApi = ({
  page = 1,
  limit = 10,
  sort_by = "newest",
}) => {
  return axiosFormData.get(
    `/admin/users?page=${page}&limit=${limit}&sort_by=${sort_by}`
  );
};

// Get User details Api
export const getUserDetailsApi = (id) => {
  return axiosFormData.get(`/admin/users/${id}`);
};

// delete User  Api
export const deleteUserApi = (id) => {
  return axiosFormData.delete(`/admin/users/${id}`);
};

// Block User  Api
export const blockUserApi = (id) => {
  return axiosFormData.post(`/admin/block-user/${id}`);
};


// unblock User  Api
export const unblockUserApi = (id) => {
  return axiosFormData.post(`/admin/unblock-user/${id}`);
};


// make Admin  Api
export const makeAdminApi = (id) => {
  return axiosFormData.post(`/admin/make-admin/${id}`);
};


// remove Admin  Api
export const  removeAdminApi = (id) => {
  return axiosFormData.post(`/admin/remove-admin/${id}`);
};


///////////////////////////////////////////////////////////////////////////////

/* ================= GET ALL CATEGORIES ================= */

export const getCategoriesApi = () => {
  return axiosFormData.get("/admin/categories");
};


/* ================= GET CATEGORY DETAILS ================= */

export const getCategoryDetailsApi = (id) => {
  return axiosFormData.get(`/admin/categories/${id}`);
};


/* ================= CREATE CATEGORY ================= */

export const createCategoryApi = (data) => {
  return axiosFormData.post("/admin/category", data);
};


/* ================= UPDATE CATEGORY ================= */

export const updateCategoryApi = (id, data) => {
  return axiosFormData.put(`/admin/category/${id}`, data);
};


/* ================= DELETE CATEGORY ================= */

export const deleteCategoryApi = (id) => {
  return axiosFormData.delete(`/admin/category/${id}`);
};


///////////////////////////////////////////////////////////////////////////////

export const getPromptsApi = () => {
  return axiosJSONData.get("/admin/prompts");
};

////============================////
export const createPromptApi = (data) => {
  return axiosJSONData.post("/admin/prompts", data);
};


////============================////
export const updatePromptApi = async (promptId, template) => {

  try {

    const body = new URLSearchParams();
    body.append("new_template", template);

    const response = await axios.put(
      `${BASE_URL}/admin/prompts/${promptId}`,
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response;

  } catch (error) {

    console.error("Update Prompt Error:", error.response?.data || error);

    throw error;

  }

};

///////////////////////////////////////////////////////////////////////////////


export const getReadingsApi = (page = 1, limit = 10) => {
  return axiosJSONData.get(`/admin/readings?page=${page}&limit=${limit}`);
};

export const deleteReadingsApi = (id) => {
  return axiosJSONData.delete(`/admin/readings/${id}`);
};


///////////////////////////////////////////////////////////////////////////////


// ✅ Get All Messages (with pagination)
export const getSupportMessagesApi = (page = 1, limit = 10) => {
  return axiosJSONData.get(
    `/admin/support-messages?page=${page}&limit=${limit}`
  );
};

// ✅ Get Single Message Detail
export const getSupportMessageByIdApi = (id) => {
  return axiosJSONData.get(`/admin/support-messages/${id}`);
};

// ✅ Delete Message
export const deleteSupportMessageApi = (id) => {
  return axiosJSONData.delete(`/admin/support-message/${id}`);
};