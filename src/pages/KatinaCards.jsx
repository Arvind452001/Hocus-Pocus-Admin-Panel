import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import CardModal from "../components/CardModal";
import { getCategoriesApi } from "../api/Api";
import {
  createCardApi,
  getKatinaCardsApi,
  updateCardApi,
} from "../api/CardsAPI";
import { useNavigate } from "react-router-dom";
import { BASE_URL_CARD } from "../config/apiConfig";
import Loader from "../components/Loader";

const KatinaCards = () => {
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 Filters State
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState(""); // "", true, false

  // 🔥 Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);

  const currentLang = localStorage.getItem("lang") || "en";
  const getLocalizedField = (obj, field) => {
    return currentLang === "tr" ? obj[`${field}_tr`] || obj[field] : obj[field];
  };
  let navigate = useNavigate();

  const DEFAULT_IMAGES = [
    "https://picsum.photos/40/60?random=1",
    "https://picsum.photos/40/60?random=2",
    "https://picsum.photos/40/60?random=3",
    "https://picsum.photos/40/60?random=4",
  ];

  const getRandomImage = () => {
    return DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];
  };
  // ✅ Initial Load
  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Fetch when filters change
  useEffect(() => {
    fetchCards();
  }, [selectedCategory, search, isActive, page]);

  // ✅ Fetch Cards
  const fetchCards = async () => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        ...(selectedCategory && { category_id: selectedCategory }),
        ...(search && { search }),
        ...(isActive !== "" && { is_active: isActive }),
        page,
        limit,
      };

      const res = await getKatinaCardsApi(payload);

      if (res?.data?.cards?.length > 0) {
        setCards(res.data.cards);
      } else {
        setCards([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch cards");
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await getCategoriesApi();

      if (res?.data?.status === 1) {
        setCategories(res?.data?.categories || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.log(error);
      setCategories([]);
    }
  };

  // ✅ Handlers
  const handleCategoryChange = (id) => {
    setSelectedCategory(id);
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setIsActive(value);
    setPage(1);
  };

  const openModal = (type, data = null) => {
    setMode(type);
    setSelected(data);
    setShowModal(true);
  };

  const handleSubmit = async (form) => {
    try {
      const formData = new FormData();

      // ✅ REQUIRED
      formData.append("category_id", selectedCategory);
      formData.append("name", form.name);
      formData.append("meaning", form.meaning);

      // ✅ OPTIONAL
      formData.append("turkish_name", form.turkish_name || "");
      formData.append("card_number", form.card_number || "");
      formData.append("arcana", form.arcana || "");
      formData.append("suit", form.suit || "");
      formData.append("element", form.element || "");
      formData.append("keywords", form.keywords || "");
      formData.append("upright_meaning", form.upright_meaning || "");
      formData.append("reversed_meaning", form.reversed_meaning || "");

      // 🔥 VERY IMPORTANT (image)
      if (form.file) {
        formData.append("image", form.file);
      }

      // 🧪 DEBUG
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // ✅ API CALL
      if (mode === "add") {
        await createCardApi(formData);
      } else if (mode === "edit") {
        await updateCardApi(selected.id, formData);
        alert(t("cards.updateSuccess"));
      }

      setShowModal(false);
      fetchCards();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(t("cards.deleteConfirm"));
    if (!confirmDelete) return;

    try {
      console.log("Delete API call", id);

      // TODO: call delete API
      // await deleteCardApi(id);

      // refresh list
      fetchCards();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="container-fluid mt-4">
      <div className="card">
        <div className="card-body">
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 className="mb-0">{t("cards.title")}</h5>

            <div className="d-flex gap-2 flex-wrap">
              {/* Category */}
              <select
                className="form-select"
                style={{ width: "180px" }}
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">{t("cards.allCategories")}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Search */}
              <input
                type="text"
                className="form-control"
                placeholder={t("cards.search")}
                value={search}
                onChange={handleSearch}
                style={{ width: "180px" }}
              />

              {/* Status */}
              <select
                className="form-select"
                style={{ width: "150px" }}
                value={isActive}
                onChange={(e) =>
                  handleStatusChange(
                    e.target.value === "" ? "" : e.target.value === "true",
                  )
                }
              >
                <option value="">{t("cards.allStatus")}</option>
                <option value="true">{t("cards.active")}</option>
                <option value="false">{t("cards.inactive")}</option>
              </select>

              <button
                className="btn btn-primary"
                onClick={() => navigate("/createCard")}
              >
                {t("cards.upload")}
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table
              className="table table-bordered"
              style={{ tableLayout: "fixed", width: "100%" }}
            >
              <thead>
                <tr>
                  <th style={{ width: "70px" }}>{t("cards.image")}</th>
                  <th style={{ width: "60px" }}>{t("cards.no")}</th>
                  <th style={{ width: "200px" }}>{t("cards.name")}</th>
                  <th>{t("cards.meaning")}</th>
                  <th style={{ width: "100px" }}>{t("cards.status")}</th>
                  <th style={{ width: "140px" }} className="text-end">
                    {t("cards.action")}
                  </th>
                </tr>
              </thead>

            <tbody>
  {loading ? (
    <tr>
      <td colSpan="6" className="text-center py-4">
        <Loader />
      </td>
    </tr>
  ) : error ? (
    <tr>
      <td colSpan="6" className="text-center text-danger">
        {error}
      </td>
    </tr>
  ) : cards.length === 0 ? (
    <tr>
      <td colSpan="6" className="text-center text-muted">
        {t("cards.noCardsFound")}
      </td>
    </tr>
  ) : (
    cards.map((card) => (
      <tr key={card.id}>
        {/* IMAGE */}
        <td style={{ verticalAlign: "middle" }}>
          <img
            src={
              card?.image
                ? `${BASE_URL_CARD}/${card.image}`
                : getRandomImage()
            }
            alt={getLocalizedField(card, "name")}
            onError={(e) => {
              e.currentTarget.src = getRandomImage();
            }}
            style={{
              width: "40px",
              height: "60px",
              borderRadius: "6px",
              objectFit: "cover",
            }}
          />
        </td>

        {/* NO */}
        <td style={{ verticalAlign: "middle" }}>{card.id}</td>

        {/* NAME */}
        <td style={{ verticalAlign: "middle" }}>
          <div
            className="fw-bold"
            style={{
              maxWidth: "180px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={getLocalizedField(card, "name")}
          >
            {getLocalizedField(card, "name")}
          </div>

          <small
            className="text-muted"
            style={{
              display: "block",
              maxWidth: "180px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={getLocalizedField(card, "keywords")}
          >
            {getLocalizedField(card, "keywords")}
          </small>
        </td>

        {/* MEANING */}
        <td style={{ verticalAlign: "middle" }}>
          {getLocalizedField(card, "meaning")}
        </td>

        {/* STATUS */}
        <td style={{ verticalAlign: "middle" }}>
          {card.is_active ? (
            <span className="badge bg-success">
              {t("cards.active")}
            </span>
          ) : (
            <span className="badge bg-secondary">
              {t("cards.inactive")}
            </span>
          )}
        </td>

        {/* ACTION */}
        <td className="text-end" style={{ whiteSpace: "nowrap" }}>
          <button
            className="btn btn-sm me-2"
            style={{ backgroundColor: "#e3f2fd", color: "#0d6efd" }}
            onClick={() => openModal("view", card)}
          >
            <i className="bi bi-eye"></i>
          </button>

          <button
            className="btn btn-sm me-2"
            style={{ backgroundColor: "#fff3cd", color: "#ffc107" }}
            onClick={() => openModal("edit", card)}
          >
            <i className="bi bi-pencil-square"></i>
          </button>

          <button
            className="btn btn-sm"
            style={{ backgroundColor: "#f8d7da", color: "#dc3545" }}
            onClick={() => handleDelete(card.id)}
          >
            <i className="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              {t("cards.prev")}
            </button>

            <span>
              {t("cards.page")} {page}
            </span>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setPage((prev) => prev + 1)}
            >
              {t("cards.next")}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <CardModal
        show={showModal}
        onClose={() => setShowModal(false)}
        mode={mode}
        selectedData={selected}
        onSubmit={handleSubmit}
      />
    </main>
  );
};

export default KatinaCards;
