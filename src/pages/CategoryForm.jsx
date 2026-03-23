import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCategoryApi,
  getCategoryDetailsApi,
  updateCategoryApi,
} from "../api/Api";

const CategoryForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    token_cost: "",
    is_free_daily: false,
    description: "",
  });

  /* ================= FETCH CATEGORY ================= */

  useEffect(() => {
    if (mode !== "create" && id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      const res = await getCategoryDetailsApi(id);
      // console.log("getCategoryDetailsApi",res)
      const cat = res?.data?.category;

      setFormData({
        name: cat.name || "",
        subtitle: cat.subtitle || "",
        token_cost: cat.token_cost || "",
        is_free_daily: cat.is_free_daily || false,
        description: cat.description || "",
      });
    } catch (error) {
      console.error("Category fetch failed", error);
    }
  };

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /* ================= HANDLE BOOLEAN ================= */

  const handleFreeDaily = (e) => {
    setFormData({
      ...formData,
      is_free_daily: e.target.value === "true",
    });
  };

  /* ================= SUBMIT ================= */

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
        alert("Category created successfully");
      }

      if (mode === "edit") {
        await updateCategoryApi(id, payload);
        alert("Category updated successfully");
      }

      navigate("/categories");
    } catch (error) {
      console.error("Category save failed", error);
      alert("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAGE TITLE ================= */

  const pageTitle =
    mode === "create"
      ? "Add Category"
      : mode === "edit"
        ? "Edit Category"
        : "View Category";

  return (
    <main className="container-fluid">
      <div className="page-section">
        <div className="card">
          <div className="card-body">
            <h5 className="mb-4">{pageTitle}</h5>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* CATEGORY NAME */}

                <div className="col-md-6">
                  <label className="form-label">Category Name *</label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Example: Tarot Reading"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={mode === "view"}
                    required
                  />
                </div>

                {/* SUBTITLE */}

                <div className="col-md-6">
                  <label className="form-label">Subtitle</label>

                  <input
                    type="text"
                    name="subtitle"
                    className="form-control"
                    placeholder="Short description"
                    value={formData.subtitle}
                    onChange={handleChange}
                    disabled={mode === "view"}
                  />
                </div>

                {/* TOKEN COST */}

                <div className="col-md-4">
                  <label className="form-label">Token Cost</label>

                  <input
                    type="number"
                    name="token_cost"
                    className="form-control"
                    min="0"
                    placeholder="Example: 5"
                    value={formData.token_cost}
                    onChange={handleChange}
                    disabled={mode === "view"}
                  />
                </div>

                {/* FREE DAILY */}

                <div className="col-md-4">
                  <label className="form-label">Free Daily Reading</label>

                  <select
                    className="form-select"
                    value={formData.is_free_daily ? "true" : "false"}
                    onChange={handleFreeDaily}
                    disabled={mode === "view"}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                {/* DESCRIPTION */}

                <div className="col-12">
                  <label className="form-label">Description</label>

                  <textarea
                    className="form-control"
                    rows="4"
                    name="description"
                    placeholder="Write category description..."
                    value={formData.description}
                    onChange={handleChange}
                    disabled={mode === "view"}
                  />
                </div>
              </div>

              {/* BUTTON */}

              {mode !== "view" && (
                <button
                  className="btn btn-primary mt-4"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : mode === "create"
                      ? "Add Category"
                      : "Update Category"}
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
