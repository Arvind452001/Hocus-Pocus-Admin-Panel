import React, { useEffect, useState } from "react";

import CardModal from "../components/CardModal";
import { getCategoriesApi } from "../api/Api";
import {
  createCardApi,
  getKatinaCardsApi,
  updateCardApi,
} from "../api/CardsAPI";
import { useNavigate } from "react-router-dom";
import { BASE_URL_CARD } from "../config/apiConfig";

const KatinaCards = () => {
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

      const res = await getKatinaCardsApi(payload);

      console.log("API RES 👉", res);

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
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

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
    const confirmDelete = window.confirm("Are you sure you want to delete?");
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
            <h5 className="mb-0">Cards</h5>

            <div className="d-flex gap-2 flex-wrap">
              {/* Category */}
              <select
                className="form-select"
                style={{ width: "180px" }}
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">All Categories</option>
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
                placeholder="Search..."
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
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              <button
                className="btn btn-primary"
                onClick={() => navigate("/createCard")}
              >
                + Upload
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
      <th style={{ width: "70px" }}>Image</th>
      <th style={{ width: "60px" }}>No</th>
      <th style={{ width: "200px" }}>Name</th>
      <th>Meaning</th>
      <th style={{ width: "100px" }}>Status</th>
      <th style={{ width: "140px" }} className="text-end">
        Action
      </th>
    </tr>
  </thead>

  <tbody>
    {cards.map((card) => (
      <tr key={card.id}>
        {/* IMAGE */}
        <td style={{ verticalAlign: "middle" }}>
          <img
            src={`${BASE_URL_CARD}/${card.image}`}
            alt={card.name}
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
            title={card.name}
          >
            {card.name}
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
            title={card.keywords}
          >
            {card.keywords}
          </small>
        </td>

        {/* MEANING */}
        <td
          style={{
            verticalAlign: "middle",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {card.meaning}
        </td>

        {/* STATUS */}
        <td style={{ verticalAlign: "middle" }}>
          {card.is_active ? (
            <span className="badge bg-success">Active</span>
          ) : (
            <span className="badge bg-secondary">Inactive</span>
          )}
        </td>

        {/* ACTION */}
        <td
          className="text-end"
          style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}
        >
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
    ))}
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
              Prev
            </button>

            <span>Page {page}</span>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
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
