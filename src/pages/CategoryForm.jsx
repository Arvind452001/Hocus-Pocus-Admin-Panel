import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCategoryApi,
  getCategoryDetailsApi,
  updateCategoryApi,
} from "../api/Api";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageProvider";

const CategoryForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { t } = useTranslation();
  const { language } = useLanguage(); // ✅ USE CONTEXT

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    token_cost: "",
    is_free_daily: false,
    description: "",
  });

  /* ================= HELPER ================= */
  const getLangValue = (obj, key) => {
    return obj?.[`${key}_${language}`] || obj?.[key] || "";
  };

  /* ================= FETCH CATEGORY ================= */

  useEffect(() => {
    if (mode !== "create" && id) {
      fetchCategory();
    }
  }, [id, language]); // 🔥 IMPORTANT

  const fetchCategory = async () => {
    try {
      const res = await getCategoryDetailsApi(id, { lang: language });
      const cat = res?.data?.category;

      setFormData({
        name: getLangValue(cat, "name"),
        subtitle: getLangValue(cat, "subtitle"),
        token_cost: cat.token_cost || "",
        is_free_daily: cat.is_free_daily || false,
        description: getLangValue(cat, "description"),
      });
    } catch (error) {
      console.error("Category fetch failed", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFreeDaily = (e) => {
    setFormData((prev) => ({
      ...prev,
      is_free_daily: e.target.value === "true",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        token_cost: Number(formData.token_cost),
      };

      if (mode === "create") {
        await createCategoryApi(payload);
        alert(t("categoryForm.createSuccess"));
      }

      if (mode === "edit") {
        await updateCategoryApi(id, payload);
        alert(t("categoryForm.updateSuccess"));
      }

      navigate("/categories");
    } catch (error) {
      console.error("Category save failed", error);
      alert(t("categoryForm.operationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const pageTitle =
    mode === "create"
      ? t("categoryForm.addCategory")
      : mode === "edit"
      ? t("categoryForm.editCategory")
      : t("categoryForm.viewCategory");

  return (
    <main className="container-fluid">
      <div className="page-section">
        <div className="card">
          <div className="card-body">
            <h5 className="mb-4">{pageTitle}</h5>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label">
                    {t("categoryForm.categoryName")} *
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={mode === "view"}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    {t("categoryForm.subtitle")}
                  </label>

                  <input
                    type="text"
                    name="subtitle"
                    className="form-control"
                    value={formData.subtitle}
                    onChange={handleChange}
                    disabled={mode === "view"}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    {t("categoryForm.tokenCost")}
                  </label>

                  <input
                    type="number"
                    name="token_cost"
                    className="form-control"
                    value={formData.token_cost}
                    onChange={handleChange}
                    disabled={mode === "view"}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    {t("categoryForm.freeDaily")}
                  </label>

                  <select
                    className="form-select"
                    value={formData.is_free_daily ? "true" : "false"}
                    onChange={handleFreeDaily}
                    disabled={mode === "view"}
                  >
                    <option value="true">{t("categoryForm.yes")}</option>
                    <option value="false">{t("categoryForm.no")}</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">
                    {t("categoryForm.description")}
                  </label>

                  <textarea
                    className="form-control"
                    rows="4"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={mode === "view"}
                  />
                </div>

              </div>

              {mode !== "view" && (
                <button className="btn btn-primary mt-4" type="submit">
                  {mode === "create"
                    ? t("categoryForm.addBtn")
                    : t("categoryForm.updateBtn")}
                </button>
              )}
            </form>

          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryForm;