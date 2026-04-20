import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteCategoryApi, getCategoriesApi } from "../api/Api";
import { useTranslation } from "react-i18next";

const Categories = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CATEGORIES ================= */
  const currentLang = localStorage.getItem("lang") || "en";

  const { t } = useTranslation();
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategoriesApi();

      setCategories(res?.data?.categories || []);
    } catch (error) {
      console.error("Categories fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE CATEGORY ================= */

  const handleDeleteCategory = async (id) => {
    const confirmDelete = window.confirm(t("categories.deleteConfirm"));

    if (!confirmDelete) return;

    try {
      await deleteCategoryApi(id);

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  /* ================= FILTER + LIMIT ================= */

  const filteredData = categories
    .filter((cat) => {
  const name =
    currentLang === "tr" ? cat.name_tr : cat.name;

  return name.toLowerCase().includes(search.toLowerCase());
})
    .slice(0, entries);

  return (
    <main className="container-fluid">
      <div className="page-section">
        <div className="card">
          <div className="card-body">
            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>{t("categories.title")}</h5>

              <Link
                to="/add-category"
                className="btn"
                style={{ backgroundColor: "#bd00da", color: "#fff" }}
              >
                {t("categories.newCategory")}
              </Link>
            </div>

            {/* SEARCH + LIMIT */}

            <div className="d-flex justify-content-between mb-3">
              <div>
                <select
                  className="form-select"
                  style={{ width: "120px" }}
                  value={entries}
                  onChange={(e) => setEntries(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>

                <small>{t("categories.entriesPerPage")}</small>
              </div>

              <div>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("categories.search")}
                  style={{ width: "220px" }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* TABLE */}

            <div className="table-responsive">
              <table className="table datatable">
                <thead>
                  <tr>
                    <th>{t("categories.id")}</th>
                    <th>{t("categories.name")}</th>
                    <th>{t("categories.subtitle")}</th>
                    <th>{t("categories.tokenCost")}</th>
                    <th>{t("categories.freeDaily")}</th>
                    <th>{t("categories.readings")}</th>
                    <th>{t("categories.status")}</th>
                    <th>{t("categories.actions")}</th>
                  </tr>
                </thead>

                <tbody>
                  {/* LOADING */}

                  {loading && (
                    <tr>
                      <td colSpan="8" className="text-center">
                        {t("categories.loading")}
                      </td>
                    </tr>
                  )}

                  {/* DATA */}

                  {!loading &&
                    filteredData.map((cat) => (
                    <tr key={cat.id}>
  <td>{cat.id}</td>

  <td>
  {currentLang === "tr" ? cat.name_tr : cat.name}
</td>

 <td>
  {currentLang === "tr" ? cat.subtitle_tr : cat.subtitle}
</td>

  <td>
    <span className="badge bg-primary">
      {cat.token_cost}
    </span>
  </td>

  {/* ✅ FIX HERE */}
  <td>
    {cat.is_free_daily
      ? t("categories.yes")
      : t("categories.no")}
  </td>

  <td>
    <span className="badge bg-info">
      {cat.reading_count}
    </span>
  </td>

  <td>
    {cat.is_active
      ? t("categories.active")
      : t("categories.disabled")}
  </td>

  <td>
    <Link
      to={`/category-view/${cat.id}`}
      className="btn btn-sm btn-outline-primary me-1"
    >
      <i className="bi bi-eye"></i>
    </Link>

    <Link
      to={`/category-edit/${cat.id}`}
      className="btn btn-sm btn-outline-success me-1"
    >
      <i className="bi bi-pencil"></i>
    </Link>

    <button
      onClick={() => handleDeleteCategory(cat.id)}
      className="btn btn-sm btn-outline-danger"
    >
      <i className="bi bi-trash"></i>
    </button>
  </td>
</tr>
                    ))}

                  {/* EMPTY */}

                  {!loading && filteredData.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        {t("categories.noCategoriesFound")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Categories;
