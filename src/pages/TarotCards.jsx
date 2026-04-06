import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import CardModal from "../components/CardModal";
import { getCategoriesApi } from "../api/Api";
import { createCardApi, getTarotCardsApi, updateCardApi } from "../api/CardsAPI";
import { useNavigate } from "react-router-dom";
import { BASE_URL, BASE_URL_CARD } from "../config/apiConfig";

const TarotCards = () => {
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);

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

  let navigate = useNavigate();
  // 🔥 Dummy fallback
  const dummyData = [
    {
      id: 1,
      title: "The Sun",
      type: "TAROT",
      file: "sun_major_01.png",
      status: "Active",
      image: "https://via.placeholder.com/60x90",
    },
  ];

    const DEFAULT_IMAGES = [
  "https://picsum.photos/40/60?random=1",
  "https://picsum.photos/40/60?random=2",
  "https://picsum.photos/40/60?random=3",
  "https://picsum.photos/40/60?random=4",
];
const getRandomImage = () => {
  return DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)];
};
const fallbackImage = useMemo(() => getRandomImage(), []);
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
      const payload = {
        ...(selectedCategory && { category_id: selectedCategory }),
        ...(search && { search }),
        ...(isActive !== "" && { is_active: isActive }),
        page,
        limit,
      };

      // console.log("🔥 PAYLOAD", payload);

      const res = await getTarotCardsApi(payload);

      console.log("API RES 👉", res.data.cards);

      if (res?.data?.cards?.length > 0) {
        setCards(res.data.cards);
      } else {
        setCards([]);
      }
    } catch (err) {
      console.log(err);
      setCards(dummyData);
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
      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      // ✅ API CALL
      if (mode === "add") {
        await createCardApi(formData);
      } else if (mode === "edit") {
        await updateCardApi(selected.id, formData);
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
      // console.log("Delete API call", id);

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
            <h5 className="mb-0">{t("tarotCards.title")}</h5>

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
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>{t("cards.image")}</th>
                  <th>{t("cards.no")}</th>
                  <th>{t("cards.name")}</th>
                  <th>{t("cards.arcana")}</th>
                  <th>{t("cards.suit")}</th>
                  <th>{t("cards.element")}</th>
                  <th className="text-end">{t("cards.action")}</th>
                </tr>
              </thead>

              <tbody>
                {cards.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      {t("cards.noCardsFound")}
                    </td>
                  </tr>
                ) : (
                  cards.map((card) => (
                    <tr key={card.id}>
                      {/* IMAGE */}
                      <td>
                       <img
  src={
    card?.image_file
      ? `${BASE_URL_CARD}/tarot-images/${card.image_file}`
      : getRandomImage()
  }
  alt={card?.name || "card"}
  onError={(e) => {
    e.currentTarget.src = fallbackImage;
  }}
  style={{
    width: "40px",
    height: "60px",
    borderRadius: "6px",
    objectFit: "cover",
  }}
/>
                      </td>

                      {/* CARD NUMBER */}
                      <td>{card.card_number}</td>

                      {/* NAME */}
                      <td>
                        <div className="fw-bold">{card.name}</div>
                        <small className="text-muted">
                          {card.turkish_name}
                        </small>
                      </td>

                      {/* ARCANA */}
                      <td>
                        <span className="badge bg-primary">{card.arcana}</span>
                      </td>

                      {/* SUIT */}
                      <td>{card.suit}</td>

                      {/* ELEMENT */}
                      <td>{card.element}</td>

                      {/* ACTION */}
                      <td className="text-end">
                        {/* View */}
                        <button
                          className="btn btn-sm me-2"
                          style={{
                            backgroundColor: "#e3f2fd",
                            color: "#0d6efd",
                          }}
                          onClick={() => openModal("view", card)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        {/* Edit */}
                        <button
                          className="btn btn-sm me-2"
                          style={{
                            backgroundColor: "#fff3cd",
                            color: "#ffc107",
                          }}
                          onClick={() => openModal("edit", card)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>

                        {/* Delete */}
                        <button
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#f8d7da",
                            color: "#dc3545",
                          }}
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

            <span>{t("cards.page")} {page}</span>

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

export default TarotCards;
