import React, { useEffect, useState } from "react";
import axiosJSONData from "../api/axiosJSONData";
import Loader from "../components/Loader";
import { useTranslation } from "react-i18next";

const ContactMessages = () => {
  const { t } = useTranslation();

  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const res = await axiosJSONData.get(
        `/admin/support-messages?page=${page}&limit=${limit}`
      );

      if (res.data.status === 1) {
        setMessages(res.data.messages);
        setTotalPages(res.data.pages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, limit]);

  const handleView = (msg) => {
    setSelectedMessage(msg);
  };

  return (
    <div className="container mt-4">
      <h3>{t("sideBar.ContactMessages")}</h3>

      {/* 🔽 Per Page Selector */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <label>{t("common.show")}</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="form-select d-inline w-auto mx-2"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          {t("common.entries")}
        </div>
      </div>

      {/* 🔽 Table */}
      {loading ? (
        <Loader />
      ) : (
        <div
          className="table-responsive rounded shadow-sm mt-3"
          style={{ overflow: "hidden" }}
        >
          <table className="table table-bordered mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>{t("users.email")}</th>
                <th>{t("support.subject")}</th>
                <th>{t("userDetails.date")}</th>
                <th>{t("users.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <tr key={msg.id}>
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td>{msg.user_email}</td>
                    <td>{msg.subject}</td>
                    <td>
                      {new Date(msg.created_at).toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#viewModal"
                        onClick={() => handleView(msg)}
                      >
                        {t("common.view")}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    {t("common.noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔽 Pagination */}
      <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
        <button
          className="btn btn-secondary"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          {t("common.prev")}
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`btn ${
              page === i + 1 ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="btn btn-secondary"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          {t("common.next")}
        </button>
      </div>

      {/* 🔽 Modal */}
      <div className="modal fade" id="viewModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{t("common.view")}</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              {selectedMessage && (
                <>
                  <p>
                    <strong>{t("users.email")}:</strong>{" "}
                    {selectedMessage.user_email}
                  </p>
                  <p>
                    <strong>{t("support.subject")}:</strong>{" "}
                    {selectedMessage.subject}
                  </p>
                  <p>
                    <strong>{t("support.message")}:</strong>{" "}
                    {selectedMessage.message}
                  </p>
                  <p>
                    <strong>{t("userDetails.date")}:</strong>{" "}
                    {new Date(
                      selectedMessage.created_at
                    ).toLocaleString()}
                  </p>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                {t("common.close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;