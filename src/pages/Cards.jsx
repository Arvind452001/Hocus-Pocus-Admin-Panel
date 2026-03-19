import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getCardsApi } from "../api/CardsAPI"; // create this API
import CardModal from "../components/CardModal";

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);

  // 🔥 Dummy Data (fallback)
  const dummyData = [
    {
      id: 1,
      title: "The Sun",
      type: "TAROT",
      file: "sun_major_01.png",
      status: "Active",
      image: "https://via.placeholder.com/60x90",
    },
    {
      id: 2,
      title: "The Anchor",
      type: "KATINA",
      file: "anchor_k_05.jpg",
      status: "Active",
      image: "https://via.placeholder.com/60x90",
    },
  ];

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await getCardsApi();
console.log(res)
      if (res?.data?.cards?.length > 0) {
        setCards(res.data.cards);
      } else {
        setCards(dummyData); // fallback
      }
    } catch (err) {
      console.log(err);
      setCards(dummyData); // fallback on error
    }
  };

  const openModal = (type, data = null) => {
    setMode(type);
    setSelected(data);
    setShowModal(true);
  };

  const handleSubmit = (form) => {
    if (mode === "add") {
      console.log("Add API call", form);
    } else {
      console.log("Update API call", form);
    }

    setShowModal(false);
  };

  return (
    <div className="admin-app">
      <Sidebar />

      <div className="content">
        <Header title="Cards" />

        <main className="container-fluid mt-4">
          <div className="card">
            <div className="card-body">
              <style>
                {`
                .card-preview {
                  width: 40px;
                  height: 40px;
                  border-radius: 8px;
                  object-fit: cover;
                  background: #eee;
                }
              `}
              </style>

              {/* HEADER */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Cards</h5>

                <button
                  className="btn btn-primary"
                  onClick={() => openModal("add")}
                >
                  + Upload New Card
                </button>
              </div>

              {/* TABLE */}
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Card Title</th>
                      <th>System Type</th>
                      <th>File Name</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cards.map((card) => (
                      <tr key={card.id}>
                        <td>
                          <img
                            src={
                              card.image || "https://via.placeholder.com/60x90"
                            }
                            className="card-preview"
                            alt=""
                          />
                        </td>

                        <td className="fw-bold">{card.title}</td>

                        <td>
                          <span
                            className={`badge ${
                              card.type === "TAROT"
                                ? "bg-primary"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {card.type}
                          </span>
                        </td>

                        <td className="text-muted">{card.file}</td>

                        <td>
                          <span
                            className={`badge ${
                              card.status === "Active"
                                ? "bg-success"
                                : card.status === "Pending"
                                  ? "bg-warning"
                                  : "bg-danger"
                            }`}
                          >
                            {card.status}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="text-end">
                          <button
                            className="btn btn-light border btn-sm"
                            onClick={() => openModal("edit", card)}
                          >
                            Edit
                          </button>

                          <button className="btn btn-outline-danger btn-sm ms-2">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <CardModal
            show={showModal}
            onClose={() => setShowModal(false)}
            mode={mode}
            selectedData={selected}
            onSubmit={handleSubmit}
          />
        </main>
      </div>
    </div>
  );
};

export default Cards;
